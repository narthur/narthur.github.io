// The `.ts` extensions are required: this module is loaded by plain Node, which will not resolve an
// extensionless specifier. See index.ts.
import { BACKGROUND } from '../theme.ts';
import type { VectorSketch } from './types.ts';
import { chain, contour, rng, simplify, toPathData, type Field } from './vector.ts';

/**
 * A digitised survey, for "Cyborg Software Development".
 *
 * One terrain, read two ways. On one side of a wandering seam its contour lines run smooth, as if
 * surveyed by hand; on the other the same terrain is sampled on a coarse grid, so its contours step
 * along the cells like a digitised map. The post is about where the line between Nathan's work and
 * the agent's falls, and that it keeps moving; the seam is that line.
 *
 * The terrain is a sum of sines with whole-number cycles across the width, the seam is too, and
 * the grid snap wraps x back to 0 at the right edge, so the Band tiles.
 */
export const PARAMS = {
	TERMS: 6,
	BANDS: 5, // contour lines per unit of terrain height
	CELL: 12, // digitising grid, in Band units at the 240-high render
	SEAM_TILT: 1.4 // how far the seam leans across the strip's height
};

const STROKE_WIDTH = 1.3;
const SIMPLIFY_TOL = 0.5;
const TAU = 2 * Math.PI;
const snap = (v: number, s: number) => Math.round(v / s) * s;

/** -1..1 along x, wrapping across `W`. */
function wave(W: number, rnd: () => number, n: number): (x: number) => number {
	const t = Array.from({ length: n }, (_, k) => ({
		c: 2 + k * 3 + Math.floor(rnd() * 3),
		a: 1 / (k + 1),
		p: rnd() * TAU
	}));
	const norm = t.reduce((s, q) => s + q.a, 0);
	return (x) => t.reduce((s, q) => s + q.a * Math.sin((q.c * TAU * x) / W + q.p), 0) / norm;
}

/** The surveyed field and which side of the seam a point is on. Exported for the tests. */
export function survey(W: number, H: number, seed: number) {
	const rnd = rng(seed);
	const terms = Array.from({ length: PARAMS.TERMS }, (_, k) => ({
		c: 3 + k * 2 + Math.floor(rnd() * 3),
		ky: ((rnd() - 0.5) * 2 * TAU * (1 + k * 0.6)) / H,
		a: 1 / (k + 1),
		p: rnd() * TAU
	}));
	const norm = terms.reduce((s, q) => s + q.a, 0);
	const terrain = (x: number, y: number) =>
		terms.reduce((s, q) => s + q.a * Math.sin((q.c * TAU * x) / W + q.ky * y + q.p), 0) / norm;
	const seam = wave(W, rnd, 3);
	// A whole number of cells across the width, or the grid lands off-phase at the seam.
	const cell = W / Math.round(W / (PARAMS.CELL * (H / 240)));

	const digitised = (x: number, y: number) => (y / H - 0.5) * PARAMS.SEAM_TILT + seam(x) > 0;
	const level = (x: number, y: number) =>
		0.5 + 0.5 * Math.sin(terrain(x, y) * PARAMS.BANDS * Math.PI);
	const field: Field = (x, y) =>
		digitised(x, y) ? level(snap(x, cell) % W, snap(y, cell)) : level(x, y);
	return { field, digitised };
}

export const geometry: VectorSketch = ({ width: W, height: H, seed, accent }) => {
	const k = H / 240;
	const { field, digitised } = survey(W, H, seed);
	const lines = chain(contour(field, W, H, Math.round(W / (2 * k)), Math.round(H / (2 * k))));
	const hand: string[] = [];
	const grid: string[] = [];
	for (const l of lines) {
		const [mx, my] = l[Math.floor(l.length / 2)];
		(digitised(mx, my) ? grid : hand).push(toPathData(simplify(l, SIMPLIFY_TOL)));
	}
	return {
		width: W,
		height: H,
		background: BACKGROUND,
		strokeWidth: STROKE_WIDTH,
		// The digitised side draws brighter, so the seam reads as a change of instrument.
		paths: [
			{ d: hand.join(''), stroke: accent, opacity: 0.5 },
			{ d: grid.join(''), stroke: accent, opacity: 0.9 }
		].filter((p) => p.d)
	};
};
