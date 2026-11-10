// The `.ts` extensions are required: this module is loaded by plain Node, which will not resolve an
// extensionless specifier. See index.ts.
import { BACKGROUND } from '../theme.ts';
import type { VectorSketch } from './types.ts';
import { rng, toPathData, type Point } from './vector.ts';

/**
 * Recursive subdivision, for "Using AI for Recursive Code Review".
 *
 * The strip is a row of cells. Any cell holding a finding splits in four and each quarter is
 * reviewed again, down to a depth limit; a clean cell stays whole. Most findings cluster, as real
 * ones do around the code that changed, so the strip is busy in places and calm in others; each
 * column also gets one stray finding of its own.
 *
 * The Band tiles in x because every cell sits inside one column and the columns divide the width
 * exactly. The clustered findings wrap in x, so a cluster near one edge continues at the other.
 */
export const PARAMS = {
	CLUSTERS: 9,
	FINDINGS: 110,
	SPREAD: [260, 90] as [number, number], // cluster half-width in x and y, in Band units
	MAX_DEPTH: 5
};

const STROKE_WIDTH = 1.1;
const INSET = 2.5; // so neighbouring cells read as separate panes rather than one grid

export type Cell = { x: number; y: number; w: number; h: number; depth: number };

/** Findings, then the leaf cells they produce. Exported for the tests. */
export function layout(W: number, H: number, seed: number): { findings: Point[]; cells: Cell[] } {
	const rnd = rng(seed);
	const cols = Math.round(W / H);
	const cw = W / cols;
	const centres = Array.from({ length: PARAMS.CLUSTERS }, () => [
		rnd() * W,
		H * (0.15 + rnd() * 0.7)
	]);
	// Sum of three uniforms: a cheap bell curve on -1..1.
	const bell = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
	const findings: Point[] = Array.from({ length: PARAMS.FINDINGS }, () => {
		const [cx, cy] = centres[Math.floor(rnd() * centres.length)];
		const x = (((cx + bell() * PARAMS.SPREAD[0]) % W) + W) % W;
		return [x, Math.max(1, Math.min(H - 1, cy + bell() * PARAMS.SPREAD[1]))];
	});
	// One stray finding per column, so no column is left as a whole, empty full-height cell, which
	// reads as a hole in the strip rather than as clean code.
	for (let i = 0; i < cols; i++)
		findings.push([(i + 0.1 + rnd() * 0.8) * cw, H * (0.1 + rnd() * 0.8)]);

	const cells: Cell[] = [];
	const split = (c: Cell) => {
		const dirty = findings.some(
			([px, py]) => px >= c.x && px < c.x + c.w && py >= c.y && py < c.y + c.h
		);
		if (!dirty || c.depth === PARAMS.MAX_DEPTH) {
			cells.push(c);
			return;
		}
		const w = c.w / 2;
		const h = c.h / 2;
		const depth = c.depth + 1;
		for (const [dx, dy] of [
			[0, 0],
			[w, 0],
			[0, h],
			[w, h]
		])
			split({ x: c.x + dx, y: c.y + dy, w, h, depth });
	};
	for (let i = 0; i < cols; i++) split({ x: i * cw, y: 0, w: cw, h: H, depth: 0 });
	return { findings, cells };
}

export const geometry: VectorSketch = ({ width: W, height: H, seed, accent }) => {
	const byDepth: string[][] = Array.from({ length: PARAMS.MAX_DEPTH + 1 }, () => []);
	for (const { x, y, w, h, depth } of layout(W, H, seed).cells) {
		const [l, t, r, b] = [x + INSET, y + INSET, x + w - INSET, y + h - INSET];
		byDepth[depth].push(
			toPathData([
				[l, t],
				[r, t],
				[r, b],
				[l, b],
				[l, t]
			])
		);
	}
	return {
		width: W,
		height: H,
		background: BACKGROUND,
		strokeWidth: STROKE_WIDTH,
		// Deeper cells draw brighter, so the eye lands where the findings are.
		paths: byDepth
			.map((ds, depth) => ({ d: ds.join(''), stroke: accent, opacity: 0.3 + depth * 0.14 }))
			.filter((p) => p.d)
	};
};
