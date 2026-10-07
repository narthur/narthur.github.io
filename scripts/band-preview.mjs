// Renders a Band Sketch straight to a PNG, so it can be looked at while it is being written.
//
// This exists because the alternative is reloading a page and squinting, and that is genuinely
// bad at it: the `hopfield` Sketch went through three versions judged that way, two of them wrong
// in ways a single glance at a rendered strip would have caught immediately. It is also the only
// way to compare several seeds side by side, or to see what a parameter change did, without
// waiting on a browser.
//
//   node scripts/band-preview.mjs --sketch=hopfield --seeds=1,2,3
//
// Writes .band-preview.png in the repo root (gitignored) unless --out says otherwise.
//
// IMPORTANT: this is NOT the page's renderer, and it does not produce the page's image. It stands
// in its own PRNG for p5's, so the same seed gives a different arrangement here than in the
// browser. Use it to judge density, contrast, line weight and overall character — the things a
// parameter controls — and use the dev picker in the browser to choose the actual Seed. For the
// real shipped image see docs/adr/0001 and scripts/bands.mjs.

// Sketches are imported as TypeScript directly: Node 22 strips types natively, and every Sketch
// imports only `import type` from ./types, which erases completely — so no bundler is involved.
// src/bands/index.ts is deliberately NOT used for this, because its extensionless re-exports are
// a TypeScript convention Node's resolver does not follow; the sketch file is loaded by name.
import { parseArgs } from 'node:util';
import sharp from 'sharp';

const { values } = parseArgs({
	options: {
		sketch: { type: 'string', default: 'hopfield' },
		seeds: { type: 'string', default: '1,2,3' },
		width: { type: 'string', default: '1280' },
		height: { type: 'string', default: '240' },
		out: { type: 'string', default: '.band-preview.png' }
	}
});

const W = Number(values.width);
const H = Number(values.height);
const seeds = values.seeds.split(',').map(Number);

/** mulberry32 — deterministic, so a preview is reproducible even though it is not p5's sequence. */
function rng(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * The smallest p5 a Sketch can run against. Anything a Sketch reaches for that is not here throws
 * by name rather than returning undefined and drawing a blank — a silent blank is the one failure
 * this script exists to make impossible.
 */
function fakeP5(rnd, captured) {
	const random = (a, b) => {
		if (a === undefined) return rnd();
		if (b === undefined) return rnd() * a;
		return a + rnd() * (b - a);
	};
	const real = {
		random,
		randomSeed: () => {},
		noiseSeed: () => {},
		pixelDensity: () => 1,
		drawingContext: {
			createImageData: (w, h) => ({
				data: new Uint8ClampedArray(w * h * 4),
				width: w,
				height: h
			}),
			putImageData: (img) => {
				captured.img = img;
			}
		}
	};
	return new Proxy(real, {
		get(target, prop) {
			if (prop in target) return target[prop];
			throw new Error(
				`band-preview: the Sketch called p5's "${String(prop)}", which this shim does not ` +
					`implement. Add it to fakeP5 in scripts/band-preview.mjs.`
			);
		}
	});
}

const { ACCENT } = await import('../src/theme.ts');
// Sketches read --accent off the document; the real render page declares it from this same
// constant, so resolving it here keeps the preview honest after a re-theme.
globalThis.document = { documentElement: {} };
globalThis.getComputedStyle = () => ({ getPropertyValue: () => ACCENT });

let sketch;
try {
	({ default: sketch } = await import(`../src/bands/${values.sketch}.ts`));
} catch (e) {
	throw new Error(`band-preview: could not load sketch "${values.sketch}": ${e.message}`);
}

const GAP = 8;
const tiles = [];
for (const seed of seeds) {
	const captured = {};
	await sketch(fakeP5(rng(seed), captured), { width: W, height: H, density: 1, seed });
	if (!captured.img) {
		throw new Error(
			`band-preview: "${values.sketch}" drew nothing via putImageData at seed ${seed}. ` +
				`Sketches that draw with p5 primitives instead are not previewable this way yet.`
		);
	}
	// Flatten onto the page background. The Band is drawn on #0a0c10 and alpha is most of what a
	// Sketch is tuning, so compositing against black would misreport every faint mark.
	const px = captured.img.data;
	const flat = Buffer.alloc(W * H * 3);
	for (let i = 0; i < W * H; i++) {
		const a = px[i * 4 + 3] / 255;
		flat[i * 3] = px[i * 4] * a + 0x0a * (1 - a);
		flat[i * 3 + 1] = px[i * 4 + 1] * a + 0x0c * (1 - a);
		flat[i * 3 + 2] = px[i * 4 + 2] * a + 0x10 * (1 - a);
	}
	tiles.push(
		await sharp(flat, { raw: { width: W, height: H, channels: 3 } })
			.png()
			.toBuffer()
	);
	process.stdout.write(`rendered ${values.sketch} seed ${seed}\n`);
}

await sharp({
	create: {
		width: W,
		height: H * tiles.length + GAP * (tiles.length - 1),
		channels: 3,
		background: '#000000'
	}
})
	.composite(tiles.map((input, i) => ({ input, top: i * (H + GAP), left: 0 })))
	.png()
	.toFile(values.out);
process.stdout.write(`wrote ${values.out}\n`);
