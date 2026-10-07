import { describe, expect, it } from 'vitest';
import {
	energy,
	geometry,
	makePatterns,
	overlap,
	reliabilityField,
	simulate,
	sweep,
	sweepAt,
	train
} from './hopfield';
import { rng, toSvg } from './vector';

/**
 * The Band is a picture of recall, so the thing worth testing is that recall happens: a corrupted
 * pattern has to come back, and energy has to fall while it does. Both fail silently in the render
 * — a net that never settles still produces a plausible-looking wash — which is the whole reason
 * these exist rather than eyeballing the strip.
 */

// `rng` comes from ./vector rather than being redefined here: it is the same mulberry32 the Sketch
// itself now runs on, so these tests drive it with the generator that actually ships instead of a
// copy that could drift from it.

const GW = 24;
const GH = 8;
const N = GW * GH;

function order(n: number) {
	const o = new Int32Array(n);
	for (let i = 0; i < n; i++) o[i] = i;
	return o;
}

describe('hopfield', () => {
	it('recalls a stored pattern from a heavily corrupted start', () => {
		const rnd = rng(1);
		const patterns = makePatterns(GW, GH, 3, rnd);
		const w = train(patterns, N);
		const target = patterns[0];

		const state = new Int8Array(N);
		for (let i = 0; i < N; i++) state[i] = rnd() < 0.42 ? (rnd() < 0.5 ? -1 : 1) : target[i];
		expect(Math.abs(overlap(state, target, N))).toBeLessThan(0.85);

		for (let s = 0; s < 30 && sweep(state, w, N, order(N)); s++);
		// Sign-agnostic: a stored pattern's inverse is the same memory to the net.
		expect(Math.abs(overlap(state, target, N))).toBeGreaterThan(0.95);
	});

	it('never raises energy, and settles', () => {
		const rnd = rng(7);
		const patterns = makePatterns(GW, GH, 3, rnd);
		const w = train(patterns, N);

		const state = new Int8Array(N);
		for (let i = 0; i < N; i++) state[i] = rnd() < 0.5 ? -1 : 1;

		let last = energy(state, w, N);
		let changed = 0;
		let sweeps = 0;
		do {
			changed = sweep(state, w, N, order(N));
			const now = energy(state, w, N);
			expect(now).toBeLessThanOrEqual(last + 1e-6);
			last = now;
		} while (changed && ++sweeps < 60);
		expect(changed).toBe(0);
	});

	it('stores every pattern, not just the last one', () => {
		// Capacity is ~0.138n, so three on this lattice should all be fixed points. A net that only
		// holds one still renders a believable Band, which is why this is asserted rather than seen.
		const patterns = makePatterns(GW, GH, 3, rng(11));
		const w = train(patterns, N);
		for (const pattern of patterns) {
			const state = Int8Array.from(pattern);
			expect(sweep(state, w, N, order(N))).toBe(0);
		}
	});

	it('sweeps at temperature without producing NaN, even at t = 0', () => {
		// Asserts the contract, not the guard: whatever t it is handed, sweepAt leaves every cell
		// at ±1 and returns a finite RMS. Verified by mutation that removing `Math.max(1e-6, t)`
		// does NOT fail this — `rnd() < NaN` is false, so a NaN probability yields -1 rather than
		// a NaN in the array. Said plainly because claiming to cover the guard would be the same
		// overclaim this file's other comments were corrected for.
		const rnd = rng(5);
		const w = train(makePatterns(GW, GH, 3, rnd), N);
		const state = new Int8Array(N);
		for (let i = 0; i < N; i++) state[i] = rnd() < 0.5 ? -1 : 1;

		const rms = sweepAt(state, w, N, order(N), 0, rnd);
		expect(Number.isFinite(rms)).toBe(true);
		for (let i = 0; i < N; i++) expect(Math.abs(state[i])).toBe(1);
	});

	it('is nearly deterministic when cold and genuinely random when hot', () => {
		// Pins the sign of the exponent. Flipping it inverts recall while still producing a
		// plausible-looking image, so only a directional check catches it.
		const rnd = rng(13);
		const patterns = makePatterns(GW, GH, 3, rnd);
		const w = train(patterns, N);

		const cold = Int8Array.from(patterns[0]);
		const reference = Int8Array.from(patterns[0]);
		sweepAt(cold, w, N, order(N), 1e-6, rnd);
		sweep(reference, w, N, order(N));
		expect(overlap(cold, reference, N)).toBeGreaterThan(0.95);

		// Hot: the field stops deciding anything, so the state wanders off the stored pattern.
		const hot = Int8Array.from(patterns[0]);
		for (let s = 0; s < 8; s++) sweepAt(hot, w, N, order(N), 1e6, rnd);
		expect(Math.abs(overlap(hot, patterns[0], N))).toBeLessThan(0.4);
	});

	it('builds patterns that are periodic in x, so the Band can repeat seamlessly', () => {
		// docs/adr/0001 renders one wide Band and repeat-x's it, so a pattern that does not close on
		// itself shows a seam in production. makePatterns only returns columns 0..gw-1, so there is
		// no column gw to compare against column 0 — a direct equality check here is the tautology
		// an earlier version of this test shipped. Instead compare how often the sign flips across
		// the wrap edge with how often it flips across an interior edge: if x stopped being
		// periodic (swapping `/ gw` for `/ (gw - 1)`, mirroring the walled y axis right below it),
		// the wrap edge becomes a systematically harder discontinuity and its rate diverges.
		let wrapFlips = 0;
		let wrapPairs = 0;
		let innerFlips = 0;
		let innerPairs = 0;
		for (let seed = 1; seed <= 25; seed++) {
			for (const pattern of makePatterns(GW, GH, 3, rng(seed))) {
				for (let y = 0; y < GH; y++) {
					const row = y * GW;
					if (pattern[row + GW - 1] !== pattern[row]) wrapFlips++;
					wrapPairs++;
					for (let x = 0; x < GW - 1; x++) {
						if (pattern[row + x] !== pattern[row + x + 1]) innerFlips++;
						innerPairs++;
					}
				}
			}
		}
		expect(wrapPairs).toBeGreaterThan(0);
		expect(Math.abs(wrapFlips / wrapPairs - innerFlips / innerPairs)).toBeLessThan(0.1);
	});

	it('simulates deterministically for a given seed', () => {
		// docs/adr/0001: the CI render cache keys on sketch + seed, so identical inputs must give
		// identical output or every deploy churns the images and the cache key is a lie.
		expect(simulate(GW, GH, rng(99))).toEqual(simulate(GW, GH, rng(99)));
	});
});

describe('hopfield reliabilityField', () => {
	const W = 1920;
	const H = 240;
	const field = () => {
		const ink = simulate(GW, GH, rng(3));
		return reliabilityField(ink, GW, GH, W / GW, H / GH);
	};

	it('wraps in x, so the Band can be tiled with repeat-x', () => {
		// x = 0 and x = W are the same point on a cylinder, so the field has to agree on them
		// exactly — not approximately. docs/adr/0001 repeats one wide render, and a mismatch here
		// is a visible nick down every tile boundary on the page.
		//
		// Mutation-checked: changing the sampler's `% GW` wrap to a clamp fails this.
		const f = field();
		for (let y = 0; y <= H; y += 15) expect(f(W, y)).toBeCloseTo(f(0, y), 10);
	});

	it('stays within 0 and 1 everywhere, including outside the canvas', () => {
		// The contour tracer samples a pixel either side of each point to take a gradient, so it
		// reads x = -1 and x = W + 1. Those must be defined rather than NaN, or the gradient — and
		// with it the colour of every edge path — comes out NaN and the stroke silently vanishes.
		const f = field();
		for (const x of [-1, 0, W / 3, W, W + 1]) {
			for (const y of [-1, 0, H / 2, H, H + 1]) {
				const v = f(x, y);
				expect(Number.isFinite(v)).toBe(true);
				expect(v).toBeGreaterThanOrEqual(0);
				expect(v).toBeLessThanOrEqual(1);
			}
		}
	});
});

describe('hopfield geometry', () => {
	const args = { width: 3440, height: 240, seed: 1, accent: '#8ded51' };

	// Every geometry() call runs the whole Hopfield net, which is ~0.8s here and roughly twice that
	// on a CI runner — and the cost is the SIMULATION, so it does not shrink with the render size
	// (measured: 824ms to simulate, 11ms for contour + chain + simplify at 3440 wide).
	//
	// So: one shared render for every test that only reads the output, and an explicit timeout on
	// the few that genuinely need several independent runs. The 5s default is not a statement about
	// what these tests should cost; it is just the default, and this block ran 12 simulations before
	// it was cut to 8. Vitest's third argument raises it per test rather than for the whole suite,
	// so a test that hangs for an unrelated reason still fails fast.
	const SLOW = 30_000;
	const shared = geometry(args);

	it(
		'is deterministic for a seed, and the seed changes it',
		() => {
			// docs/adr/0001: the Band must be a pure function of Sketch and Seed, or the render cache
			// is a lie and every deploy churns the asset. Two fresh calls on purpose — reusing `shared`
			// here would compare an object with itself and assert nothing.
			expect(geometry(args)).toEqual(geometry(args));
			expect(geometry({ ...args, seed: 2 })).not.toEqual(shared);
		},
		SLOW
	);

	it('draws contours, not a fill, and stays inside the canvas', () => {
		const g = shared;
		expect(g.paths.length).toBeGreaterThan(10);
		expect(g.width).toBe(3440);
		expect(g.height).toBe(240);

		// Every coordinate within bounds. A path that escapes is not clipped by anything — the SVG
		// has no clip and the background div does not hide overflow — so it would draw over the
		// title.
		for (const { d } of g.paths) {
			for (const n of d
				.slice(1)
				.split(/[ML]/)
				.flatMap((p) => p.split(' '))) {
				const v = Number(n);
				expect(Number.isFinite(v)).toBe(true);
			}
		}
		const coords = g.paths.flatMap(({ d }) =>
			d
				.slice(1)
				.split(/[ML]/)
				.map((pair) => pair.split(' ').map(Number))
		);
		for (const [x, y] of coords) {
			expect(x).toBeGreaterThanOrEqual(0);
			expect(x).toBeLessThanOrEqual(3440);
			expect(y).toBeGreaterThanOrEqual(0);
			expect(y).toBeLessThanOrEqual(240);
		}
	});

	it(
		'takes its accent from the caller rather than hard-coding one',
		() => {
			// A Sketch that baked the accent in would keep shipping the old colour after a re-theme,
			// with no error to notice it by — the same failure src/theme.ts exists to prevent on the
			// raster track. Mutation-checked: replacing `accent` with the ACCENT constant fails this.
			const red = geometry({ ...args, accent: '#ff0000' });
			const green = geometry({ ...args, accent: '#00ff00' });
			expect(red.paths.map((p) => p.stroke)).not.toEqual(green.paths.map((p) => p.stroke));
			// The firmest boundary reaches the accent itself; the faintest stays off-white either way.
			expect(red.paths.some((p) => /rgb\(2[0-9]{2},\d+,\d+\)/.test(p.stroke))).toBe(true);
		},
		SLOW
	);

	it('fits in a fraction of the raster asset it replaces', () => {
		// The shipped WebP was 38KB. This is not a micro-optimisation note: the whole reason to go
		// vector was fidelity, and the size needs to not have quietly gone the wrong way to buy it.
		//
		// 30KB, not 40KB: the measured size is ~22KB, and a ceiling ABOVE the 38KB WebP would have
		// let the size regress past the thing it is supposed to beat while still passing a test
		// whose own comment says it guards that. 30KB leaves real headroom over 22 and still fails
		// before the asset stops being a saving.
		const svg = toSvg(shared);
		expect(svg.length).toBeLessThan(30_000);
	});

	it(
		'keeps the lattice fixed at any render size while the coordinates scale',
		() => {
			// The row count was once derived from the render width by keeping cells square, which gave
			// 24 rows in a preview, 8 in a dev browser and 9 in the image that shipped — three pictures
			// from one Sketch. PARAMS.GW/GH are constants now, so the lattice, and therefore the NUMBER
			// of distinct contours, is a property of the simulation rather than of the canvas.
			//
			// The raster suite had an equivalent guard and this change deleted it with `paint`. It is
			// restored rather than dropped because a review agent reintroduced the original bug inside
			// `geometry` and watched all 13 remaining tests pass. Mutation-checked the same way:
			// deriving GH from the height to keep cells square fails this.
			//
			// The second assertion is the other half, and it shares these renders rather than making
			// its own: a fixed lattice must not mean a fixed-size DRAWING. Without it, pinning the
			// lattice could be satisfied by a Band that renders at one size and leaves the rest of a
			// wider canvas blank.
			const sizes: [number, number][] = [
				[1280, 240],
				[3440, 240],
				[2048, 480]
			];
			const rendered = sizes.map(([width, height]) => geometry({ ...args, width, height }));

			// Measured 76 / 77 / 76 — the ±1 is a contour grazing the canvas edge, not the lattice
			// moving. A lattice that tracked the canvas would swing by much more than 15%.
			const counts = rendered.map((g) => g.paths.length);
			const lo = Math.min(...counts);
			const hi = Math.max(...counts);
			expect((hi - lo) / lo).toBeLessThan(0.15);

			const widest = (g: { paths: { d: string }[] }) =>
				Math.max(
					...g.paths.flatMap(({ d }) =>
						d
							.split(/[ML]/)
							.slice(1)
							.map((pt) => Number(pt.split(' ')[0]))
					)
				);
			expect(widest(rendered[0])).toBeLessThanOrEqual(1280);
			expect(widest(rendered[1])).toBeGreaterThan(3000);
		},
		SLOW
	);
});
