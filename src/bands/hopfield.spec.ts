import { describe, expect, it } from 'vitest';
import { energy, makePatterns, overlap, sweep, train } from './hopfield';

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
});
