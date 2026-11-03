// The `.ts` extensions are required: scripts/band-preview.mjs imports this Sketch into plain Node,
// which will not resolve an extensionless specifier. See index.ts.
import { ACCENT } from '../theme.ts';
import type { P5, SketchArgs } from './types.ts';
import { rng } from './vector.ts';

/**
 * Kuramoto oscillators, for "Staying Productive on Bad Brain Days".
 *
 * Sixty oscillators, one per row, each with its own natural rhythm and sorted by it. Each is pulled
 * toward the group's mean phase with a coupling strength that rises and falls as time runs left to
 * right. Above a critical strength they lock into step and the stripes stand upright; below it each
 * drifts at its own pace and the strip turns to noise. The coupling follows no regular cycle, so
 * stable stretches and noisy ones arrive unevenly, the way good and bad days do.
 *
 * Time is x, so the strip does not wrap on its own: the phases at the end differ from the start.
 * Each row's mismatch is spread evenly back across the strip, at most π over 1720 columns against a
 * natural step of about 0.3 a column, which is invisible and makes the Band tile exactly.
 */
export const PARAMS = {
	ROWS: 60,
	COLUMN: 2, // CSS px per time step
	OMEGA: 0.3, // mean phase advance per column; sets the stripe pitch (2π / 0.3 ≈ 21 columns)
	SPREAD: 0.06, // standard deviation of the natural rhythms; the critical coupling is ≈ 1.6× this
	K_MAX: 0.25 // peak coupling, about 2.6× critical
};

const SUBSTEPS = 4;
const WARMUP = 300;

/** Coupling over time: 0..K_MAX, a sum of sines with whole-number cycles so it wraps. */
function coupling(cols: number, rnd: () => number): (c: number) => number {
	const terms = Array.from({ length: 4 }, (_, k) => ({
		cycles: 1 + k + Math.floor(rnd() * 2),
		amp: 1 / (k + 1),
		phase: rnd() * 2 * Math.PI
	}));
	const total = terms.reduce((s, t) => s + t.amp, 0);
	return (c) => {
		const s = terms.reduce(
			(s, t) => s + t.amp * Math.sin((t.cycles * 2 * Math.PI * c) / cols + t.phase),
			0
		);
		// Normalised to -1..1, then pushed to the ends so most of the strip is clearly locked or
		// clearly not, rather than lingering near the threshold.
		return PARAMS.K_MAX * Math.min(1, Math.max(0, 0.5 + (1.4 * s) / total));
	};
}

/** Phase of every oscillator at every column, row-major, `rows × cols`. Exported for the tests. */
export function phases(cols: number, seed: number, rows = PARAMS.ROWS): Float64Array {
	const rnd = rng(seed);
	const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
	const omega = Array.from({ length: rows }, () => PARAMS.OMEGA + PARAMS.SPREAD * gauss()).sort(
		(a, b) => a - b
	);
	const theta = omega.map(() => rnd() * 2 * Math.PI);
	const K = coupling(cols, rnd);

	const advance = (k: number) => {
		for (let s = 0; s < SUBSTEPS; s++) {
			let re = 0;
			let im = 0;
			for (const t of theta) {
				re += Math.cos(t);
				im += Math.sin(t);
			}
			const r = Math.hypot(re, im) / rows;
			const psi = Math.atan2(im, re);
			for (let i = 0; i < rows; i++)
				theta[i] += (omega[i] + k * r * Math.sin(psi - theta[i])) / SUBSTEPS;
		}
	};

	// Settle under the starting coupling, so column 0 is a state the system would actually be in.
	for (let w = 0; w < WARMUP; w++) advance(K(0));

	const out = new Float64Array(rows * cols);
	const start = theta.slice();
	for (let c = 0; c < cols; c++) {
		for (let i = 0; i < rows; i++) out[i * cols + c] = theta[i];
		advance(K(c));
	}
	// `theta` is now the column after the last, which should equal column 0 modulo 2π.
	for (let i = 0; i < rows; i++) {
		const gap = theta[i] - start[i];
		const miss = gap - 2 * Math.PI * Math.round(gap / (2 * Math.PI));
		for (let c = 0; c < cols; c++) out[i * cols + c] -= (miss * c) / cols;
	}
	return out;
}

export default function kuramoto(p: P5, { width: W, height: H, density, seed }: SketchArgs) {
	const colW = PARAMS.COLUMN * density;
	const cols = Math.round(W / colW);
	const rows = PARAMS.ROWS;
	const th = phases(cols, seed);

	const accent =
		getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || ACCENT;
	const ar = parseInt(accent.slice(1, 3), 16);
	const ag = parseInt(accent.slice(3, 5), 16);
	const ab = parseInt(accent.slice(5, 7), 16);

	const img = p.drawingContext.createImageData(W, H);
	const px = img.data;
	for (let y = 0; y < H; y++) {
		const row = Math.min(rows - 1, Math.floor((y * rows) / H)) * cols;
		for (let x = 0; x < W; x++) {
			// Interpolated between columns, wrapping, so a stripe's edge is soft rather than stepped.
			const f = x / colW - 0.5;
			const c0 = Math.floor(f);
			const t = f - c0;
			const a = Math.cos(th[row + ((c0 + cols) % cols)]);
			const b = Math.cos(th[row + ((c0 + 1) % cols)]);
			const v = 0.5 + 0.5 * (a + (b - a) * t);
			const o = (y * W + x) * 4;
			px[o] = ar;
			px[o + 1] = ag;
			px[o + 2] = ab;
			px[o + 3] = v * v * 0.85 * 255;
		}
	}
	p.drawingContext.putImageData(img, 0, 0);
}
