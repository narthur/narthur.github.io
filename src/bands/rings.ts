// The `.ts` extensions are required: this module is loaded by plain Node, which will not resolve an
// extensionless specifier. See index.ts.
import { BACKGROUND } from '../theme.ts';
import type { VectorSketch } from './types.ts';
import { chain, contour, rng, simplify, toPathData, type Field } from './vector.ts';

/**
 * Tree rings, for "Agent Fieldnotes for Persistent Context".
 *
 * A tree keeps its history by laying a new ring over the last one, and the record can be read
 * long after the season that wrote it. Fieldnotes are the same bargain: each session adds a layer
 * that the next one can read. The stumps sit near the strip's top and bottom edges, and where two sets
 * of rings collide they meet in a seam, as end grain does.
 *
 * Distance to the nearest stump, wobbled by noise and folded through a sine, traced at 0.5. The
 * distance and the noise both wrap in x, so the Band tiles.
 */
export const PARAMS = {
	STUMPS: 9,
	SPACING: 34, // ring pitch, in Band units at the 240-high render
	WOBBLE: 9, // noise scale, same units: the noise is bounded by ±2.45 (1 + 1/2 + … + 1/6), so rings
	// shift by up to 9 × 2.45 ≈ 22. At 0 the rings are perfect circles and read as a diagram.
	SAMPLES: [1720, 120] as [number, number] // marching-squares grid across the full Band
};

const STROKE_WIDTH = 1.4;
const SIMPLIFY_TOL = 0.6;

/** A sum of sines with whole-number cycles across `W`, so it matches itself at the seam. */
function wobble(W: number, rnd: () => number): Field {
	const terms = Array.from({ length: 6 }, (_, k) => ({
		cycles: 2 + k * 3 + Math.floor(rnd() * 3),
		amp: 1 / (k + 1),
		phase: rnd() * 2 * Math.PI,
		tilt: rnd() * 0.02
	}));
	return (x, y) =>
		terms.reduce(
			(s, t) => s + t.amp * Math.sin((t.cycles * 2 * Math.PI * x) / W + t.phase + t.tilt * y),
			0
		);
}

/** The ring field: 0..1, crossing 0.5 twice per ring pitch. Exported for the tiling test. */
export function ringField(W: number, H: number, seed: number): Field {
	const rnd = rng(seed);
	// Jittered even spacing in x. Each stump's centre lies near the top or bottom edge, anywhere from
	// 0.15H outside it to 0.25H inside, so most rings cross the strip as arcs; a stump inside the strip
	// also shows its innermost rings as closed loops.
	const stumps = Array.from({ length: PARAMS.STUMPS }, (_, k) => [
		((k + 0.5 + (rnd() - 0.5) * 0.5) * W) / PARAMS.STUMPS,
		H * (rnd() < 0.5 ? -0.15 + rnd() * 0.4 : 0.75 + rnd() * 0.4)
	]);
	const noise = wobble(W, rnd);
	return (x, y) => {
		let r = Infinity;
		for (const [sx, sy] of stumps) {
			const dx = Math.abs(x - sx);
			r = Math.min(r, Math.hypot(Math.min(dx, W - dx), y - sy));
		}
		return 0.5 + 0.5 * Math.sin(((r + noise(x, y) * PARAMS.WOBBLE) / PARAMS.SPACING) * 2 * Math.PI);
	};
}

export const geometry: VectorSketch = ({ width: W, height: H, seed, accent }) => {
	// Ring sizes are in units of the 240-high render, scaled with H so the picture is the same at
	// any size.
	const k = H / 240;
	const field = ringField(W / k, H / k, seed);
	const lines = chain(contour((x, y) => field(x / k, y / k), W, H, ...PARAMS.SAMPLES)).map((l) =>
		simplify(l, SIMPLIFY_TOL)
	);
	return {
		width: W,
		height: H,
		background: BACKGROUND,
		strokeWidth: STROKE_WIDTH,
		paths: [
			{
				d: lines.map(toPathData).join(''),
				stroke: accent,
				opacity: 245 / 255
			}
		]
	};
};
