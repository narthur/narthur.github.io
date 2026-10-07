// Renders a Band Sketch straight to a file, so it can be looked at while it is being written.
//
// This exists because the alternative is reloading a page and squinting, and that is genuinely
// bad at it: the `hopfield` Sketch went through three versions judged that way, two of them wrong
// in ways a single glance at a rendered strip would have caught immediately. It is also the only
// way to compare several seeds side by side, or to see what a parameter change did, without
// waiting on a browser.
//
//   node scripts/band-preview.mjs --sketch=hopfield --seeds=1,2,3
//
// A VECTOR Sketch writes .band-preview.svg (the first seed, the asset exactly as it would ship)
// and .band-preview.html — every seed tiled at the size and repeat the post page uses, with a
// title over it. Open the HTML: it is the only preview that shows the Band doing its actual job,
// and because a vector Band has no second rasteriser, what it shows IS what ships.
//
// A RASTER Sketch writes .band-preview.png, the seeds stacked. That one is an approximation: it
// stands in its own PRNG for p5's, so the same seed gives a different arrangement than the page.
// Use it to judge density, contrast, line weight and overall character — the things a parameter
// controls — and use the dev picker in the browser to choose the actual Seed. For the real shipped
// image see docs/adr/0001 and scripts/bands.mjs.
//
// Both outputs are gitignored.

// The registry is imported rather than the Sketch file by name: it is what says which track a
// Sketch takes, and looking the name up in it also rejects a typo'd `--sketch` by listing what is
// actually registered. It loads here for the same reason scripts/bands.mjs can load it — every
// specifier in it carries a `.ts`, which Node's resolver needs and TypeScript's does not.
import { parseArgs } from 'node:util';
import { join } from 'node:path';
import sharp from 'sharp';
import { resolveSketch, sketchNames } from '../src/bands/index.ts';
import { rng, toSvg } from '../src/bands/vector.ts';
import { ACCENT, BACKGROUND, hexToRgb } from '../src/theme.ts';

const { values } = parseArgs({
	options: {
		sketch: { type: 'string', default: 'hopfield' },
		seeds: { type: 'string', default: '1,2,3' },
		width: { type: 'string' },
		height: { type: 'string' },
		out: { type: 'string' },
		title: { type: 'string' }
	}
});

const resolved = resolveSketch(values.sketch);
if (!resolved) {
	throw new Error(
		`band-preview: no Sketch named ${JSON.stringify(values.sketch)}. ` +
			`Registered: ${sketchNames().join(', ')}`
	);
}
const vector = resolved.track === 'vector' ? resolved.draw : null;
const raster = resolved.track === 'raster' ? resolved.draw : null;

// A vector Band defaults to the width scripts/bands.mjs ships, because for a vector Band the width
// is not a preview convenience — it is the tiling period, and judging the repeat at 1280 would be
// judging an image the page never shows. A raster preview has no such constraint.
const W = Number(values.width ?? (vector ? 3440 : 1280));
const H = Number(values.height ?? 240);

// Validated rather than trusted, because every failure mode here is silent or misdirecting. On the
// raster track `--width=0` makes the Sketch's pixel loops run zero times, and sharp then rejects
// the empty buffer with "Input Buffer is empty" from inside its own constructor, pointing nowhere
// near the flag; on the vector track it degenerates the contour arithmetic instead and writes a
// zero-width SVG that simply draws nothing. A non-numeric seed is worse on either track: `NaN >>>
// 0` is 0, so mulberry32 quietly renders seed 0's sequence while the log line reads "seed NaN" —
// in a tool whose whole job is comparing seeds side by side.
//
// Integer, not merely positive: `--width=1280.5` survives createImageData, because `w * h * 4` is
// still a whole number, and dies 100 lines later as "Expected width, height and channels for raw
// pixel input" — which names neither the flag nor the value. Reproduced before this line was
// tightened; `Number.isInteger` subsumes the finite check, so NaN and Infinity are still caught.
for (const [flag, v] of [
	['--width', W],
	['--height', H]
]) {
	if (!Number.isInteger(v) || v <= 0) {
		throw new Error(`band-preview: ${flag} must be a positive integer, got ${JSON.stringify(v)}`);
	}
}

const seeds = values.seeds.split(',').map((s) => {
	const n = Number(s);
	// Emptiness is checked separately because `Number('')` is 0, which IS an integer: a stray comma
	// in `--seeds=1,,2` satisfies the integer test on its own and quietly renders seed 0, which is
	// the same silent-wrong-seed failure that test exists to stop. Order of the two is immaterial —
	// both are pure and neither throws.
	if (s.trim() === '' || !Number.isInteger(n)) {
		throw new Error(`band-preview: --seeds takes integers; ${JSON.stringify(s)} is not one`);
	}
	return n;
});
if (!seeds.length) throw new Error('band-preview: --seeds must name at least one seed');

const write = (name, body) =>
	import('node:fs/promises').then(({ writeFile }) => writeFile(name, body));

/**
 * The title to lay over a vector preview.
 *
 * Looked up from the post whose frontmatter names this Sketch, because the whole reason the
 * preview draws a title at all is to judge the Band UNDER the real one — a stand-in of a different
 * length tells you nothing about whether a contour runs through the descenders. It was hardcoded
 * to one post's title at first, which was invisible only because there was exactly one vector
 * Sketch; the second would have been previewed under the first one's headline.
 *
 * `--title` overrides, for a Sketch no post references yet.
 */
async function postTitle(sketch) {
	if (values.title) return values.title;
	const { readdir, readFile } = await import('node:fs/promises');
	const { load } = await import('js-yaml');
	for (const file of await readdir('src/content/posts')) {
		if (!file.endsWith('.md')) continue;
		const raw = await readFile(join('src/content/posts', file), 'utf8');
		// Same BOM strip scripts/bands.mjs does, and for the same reason: `^---$` misses a first
		// line carrying one, so the split would hand the post BODY to the YAML parser.
		const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
		const front = text.split(/^---$/m)[1];
		if (!front) continue;
		const data = load(front) ?? {};
		if (data.band?.sketch === sketch && data.title) return data.title;
	}
	return `${sketch} — no post references this Sketch yet`;
}

if (vector) {
	const rendered = seeds.map((seed) => ({
		seed,
		svg: toSvg(vector({ width: W, height: H, seed, accent: ACCENT }))
	}));

	await write(values.out ?? '.band-preview.svg', rendered[0].svg);

	// Shown the way writing/[slug].astro shows it — a repeat-x background at a locked height, with
	// a title bottom-aligned over it — because the thing being judged is whether the Band works
	// UNDER a title at a real viewport width, which a bare strip cannot tell you. The seed is
	// printed beside each so a choice can be read straight off the page.
	// encodeURIComponent is the only escaping the SVG needs, and it is doing two jobs: it makes the
	// SVG a legal URL, and on the way it encodes `"`, `<`, `>` and `&`, which is what keeps the
	// value inside the HTML attribute it is embedded in. A second HTML-escape pass on IT would be
	// dead code, since none of those characters can survive to reach one.
	//
	// The title is a different matter — it comes from a post's frontmatter and goes into the
	// document as markup, so it gets a real escape. A title with an ampersand or an angle bracket
	// in it is ordinary prose, not an attack.
	const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const title = esc(await postTitle(values.sketch));
	const body = rendered
		.map(
			({ seed, svg }) =>
				`<section><p class="seed">seed ${seed} · ${(svg.length / 1024).toFixed(0)} KB</p>` +
				`<div class="band" style="background-image:url(&quot;data:image/svg+xml,${encodeURIComponent(
					svg
				)}&quot;)"><h1>${title}</h1></div></section>`
		)
		.join('');
	await write(
		'.band-preview.html',
		`<!doctype html><meta charset="utf-8"><title>band preview · ${values.sketch}</title>` +
			`<style>` +
			`body{margin:0;background:${BACKGROUND};color:#e8e9ec;` +
			`font:16px/1.5 ui-sans-serif,system-ui,sans-serif}` +
			`section{margin:0 0 3rem}` +
			`.seed{margin:0 0 .25rem;padding:0 1.5rem;font:12px ui-monospace,monospace;color:#6b7280}` +
			// auto 240px and repeat-x: the same two rules the post page sets, so the tiling period
			// and the seam land exactly where they will in production.
			`.band{height:240px;background-size:auto 240px;background-repeat:repeat-x;` +
			`background-position:center;display:flex;align-items:flex-end;padding:0 1.5rem}` +
			`h1{margin:0 0 1rem;font-size:2.25rem;font-weight:500;letter-spacing:-.02em}` +
			`</style>${body}`
	);
	process.stdout.write(
		`${rendered.map((r) => `rendered ${values.sketch} seed ${r.seed}`).join('\n')}\n` +
			`wrote ${values.out ?? '.band-preview.svg'} and .band-preview.html — open the HTML\n`
	);
} else {
	await rasterPreview();
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

async function rasterPreview() {
	// Sketches read --accent off the document; the real render page declares it from this same
	// constant, so resolving it here keeps the preview honest after a re-theme.
	globalThis.document = { documentElement: {} };
	globalThis.getComputedStyle = () => ({ getPropertyValue: () => ACCENT });

	const GAP = 8;
	const tiles = [];
	for (const seed of seeds) {
		const captured = {};
		await raster(fakeP5(rng(seed), captured), { width: W, height: H, density: 1, seed });
		if (!captured.img) {
			throw new Error(
				`band-preview: "${values.sketch}" drew nothing via putImageData at seed ${seed}. ` +
					`Sketches that draw with p5 primitives instead are not previewable this way yet.`
			);
		}
		// Flatten onto the page background. The Band is drawn on BACKGROUND and alpha is most of what
		// a Sketch is tuning, so compositing against black would misreport every faint mark.
		const px = captured.img.data;
		const [br, bg, bb] = hexToRgb(BACKGROUND);
		const flat = Buffer.alloc(W * H * 3);
		for (let i = 0; i < W * H; i++) {
			const a = px[i * 4 + 3] / 255;
			flat[i * 3] = px[i * 4] * a + br * (1 - a);
			flat[i * 3 + 1] = px[i * 4 + 1] * a + bg * (1 - a);
			flat[i * 3 + 2] = px[i * 4 + 2] * a + bb * (1 - a);
		}
		tiles.push(
			await sharp(flat, { raw: { width: W, height: H, channels: 3 } })
				.png()
				.toBuffer()
		);
		process.stdout.write(`rendered ${values.sketch} seed ${seed}\n`);
	}

	const out = values.out ?? '.band-preview.png';
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
		.toFile(out);
	process.stdout.write(`wrote ${out}\n`);
}
