import { describe, expect, it } from 'vitest';
import { energy, makePatterns, overlap, paint, simulate, sweep, sweepAt, train } from './hopfield';

/**
 * The Band is a picture of recall, so the thing worth testing is that recall happens: a corrupted
 * pattern has to come back, and energy has to fall while it does. Both fail silently in the render
 * — a net that never settles still produces a plausible-looking wash — which is the whole reason
 * these exist rather than eyeballing the strip.
 */

/** Deterministic RNG, so a failure is reproducible. mulberry32. */
function rng(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

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

describe('hopfield paint', () => {
	const W = 64;
	const H = 24;
	const CELLX = W / GW;
	const CELLY = H / GH;
	const run = (ink: Float32Array) => {
		const px = new Uint8ClampedArray(W * H * 4);
		paint(ink, GW, GH, W, H, CELLX, CELLY, '#8ded51', px);
		return px;
	};

	it('paints nothing where the field is flat', () => {
		// A contour exists only where reliability crosses a half, so a constant field has none.
		// This asserts that outcome, not the `grad < 1e-7` guard: verified by mutation that
		// deleting the guard still passes, because a flat field puts `a` at 0 and `|0 - 0.5| / 0`
		// is Infinity, which the distance cutoff already rejects. The guard is defence in depth.
		const px = run(new Float32Array(GW * GH).fill(5));
		for (let i = 3; i < px.length; i += 4) expect(px[i]).toBe(0);
	});

	it('paints a contour where the field has an edge, with bounded alpha', () => {
		const ink = new Float32Array(GW * GH);
		for (let y = 0; y < GH; y++) {
			for (let x = 0; x < GW; x++) ink[y * GW + x] = x < GW / 2 ? 0 : 10;
		}
		const px = run(ink);
		let lit = 0;
		for (let i = 3; i < px.length; i += 4) {
			expect(px[i]).toBeGreaterThanOrEqual(0);
			expect(px[i]).toBeLessThanOrEqual(255);
			if (px[i] > 0) lit++;
		}
		expect(lit).toBeGreaterThan(0);
		// A contour, not a fill: an edge down the middle must not light most of the canvas.
		expect(lit).toBeLessThan(W * H * 0.5);
	});

	it('paints deterministically', () => {
		const ink = Float32Array.from({ length: GW * GH }, (_, i) => (i * 7919) % 23);
		expect(run(ink)).toEqual(run(ink));
	});

	it('draws the same amount of contour at any render size', () => {
		// The row count was once derived from the width by keeping cells square, which produced a
		// different picture at every render size — 24 rows in a preview, 8 in a dev browser, 9 in
		// the image that ships. Both lattice dimensions are constants now, so the contour's LENGTH
		// is fixed and only its pixel scale changes.
		//
		// A contract test, not a guard against that specific regression: mutation-checked, and
		// forcing square cells again still passes, because compressing the lattice vertically does
		// not move contour length by 10%. It does catch the coarser failures — a lattice that
		// scaled with the canvas, or a line width that stopped being expressed in pixels.
		//
		// Normalised by the linear dimension, not by area: the contour is a fixed pixel width, so
		// its length grows linearly while area grows quadratically, and lit/area legitimately falls
		// as the canvas grows (measured: 0.55 at 64×24 down to 0.11 at 512×192). lit/√(w·h) is the
		// invariant, and it settles once the canvas is big enough that the line is thin relative to
		// it — hence two realistic sizes rather than a tiny one.
		const ink = Float32Array.from({ length: GW * GH }, (_, i) => Math.sin(i * 0.7) * 10);
		const perLinear = (w: number, h: number) => {
			const px = new Uint8ClampedArray(w * h * 4);
			paint(ink, GW, GH, w, h, w / GW, h / GH, '#8ded51', px);
			let lit = 0;
			for (let i = 3; i < px.length; i += 4) if (px[i] > 0) lit++;
			return lit / Math.sqrt(w * h);
		};
		const small = perLinear(256, 96);
		const large = perLinear(512, 192);
		expect(Math.abs(small - large) / large).toBeLessThan(0.1);
	});
});
