import type { P5, SketchArgs } from './types';

/**
 * Associative recall — a Hopfield network remembering one pattern out of noise, repeatedly.
 *
 * Six patterns are stored in one weight matrix by Hebbian learning. A run starts from one of them
 * with 40% of its cells randomised, falls into a basin with a few cold sweeps, and is then sampled
 * at finite temperature. That is recall: the memory is not stored anywhere a single cell can see,
 * and it comes back from a fragment.
 *
 * The Band draws the net's UNCERTAINTY, accumulated over every sweep of every run — not the state
 * it ended in, and not how confidently it recalled. A cell deep inside the memory is on in nearly
 * every sweep and a cell outside it in nearly none; both are drawn dark. What lights up is the
 * contested boundary, where the net spent half its sweeps either way. Painting confidence instead
 * fills half the canvas with solid accent, which is the camouflage an earlier version was.
 *
 * That is also the better claim for this post. The subject is material that is only partly
 * consolidated, so the interesting line is the edge of what repeated listening has actually fixed.
 *
 * Temperature is what makes that an image at all, and it was the whole difficulty here. A
 * zero-temperature net converges to a fixed point and sits on it, so every run returns the same
 * state, the accumulator saturates at 0 or MAX, and the Band is two flat slabs with hard edges —
 * which is exactly what the first version drew. Crowding the net past capacity does not fix it:
 * recall just collapses into one spurious state that every run reaches identically. The variation
 * has to come from sampling a basin rather than from failing to find one.
 *
 * Six patterns rather than one because a net storing a single memory is a threshold filter with
 * extra steps — there has to be something else it could have fallen into for settling to mean
 * anything. Six is inside the ~0.138n capacity limit, so the basin is a real memory.
 */

/** ±1 cell states. Int8Array because the weight loop is the cost and this keeps it cache-friendly. */
export type State = Int8Array;

/**
 * `count` patterns on a gw×gh lattice, each periodic in x.
 *
 * Periodic is the hard requirement: the Band is rendered once wide and `repeat-x`'d over any
 * viewport (docs/adr/0001), so a pattern that doesn't close on itself shows a seam. Sinusoids with
 * integer frequencies across gw close exactly, where p5's `noise()` would not — which is why this
 * builds patterns out of harmonics instead of sampling noise.
 */
export function makePatterns(
	gw: number,
	gh: number,
	count: number,
	rnd: () => number,
	freq: [number, number] = [6, 20]
): State[] {
	const out: State[] = [];
	for (let k = 0; k < count; k++) {
		const terms = [0, 1, 2, 3].map(() => ({
			// Integer, so the term completes a whole number of cycles across the width — which is
			// what lets the Band repeat-x seamlessly.
			fx: freq[0] + Math.floor(rnd() * (freq[1] - freq[0] + 1)),
			phase: rnd() * Math.PI * 2,
			// y is walled, not wrapped, so it takes a half-cycle shape and needs no integer
			// constraint. It has to be in the same league as fx or every feature runs straight
			// top-to-bottom and the Band reads as a barcode.
			fy: 1 + rnd() * 2.5,
			yPhase: rnd() * Math.PI,
			amp: 0.4 + rnd() * 0.6
		}));
		const pattern = new Int8Array(gw * gh);
		for (let y = 0; y < gh; y++) {
			for (let x = 0; x < gw; x++) {
				let v = 0;
				for (const t of terms) {
					v +=
						t.amp *
						Math.sin((2 * Math.PI * t.fx * x) / gw + t.phase) *
						Math.cos((Math.PI * t.fy * y) / Math.max(1, gh - 1) + t.yPhase);
				}
				pattern[y * gw + x] = v >= 0 ? 1 : -1;
			}
		}
		out.push(pattern);
	}
	return out;
}

/**
 * Hebbian weights: w_ij = Σ_p s_i s_j, zero on the diagonal.
 *
 * Symmetric with no self-connection is what guarantees the energy below can only fall, and so that
 * a run terminates instead of oscillating. Stored as one flat Float32Array of n² — dense is the
 * whole idea, since a memory held only in local neighbourhoods would be a cellular automaton.
 */
export function train(patterns: State[], n: number): Float32Array {
	const w = new Float32Array(n * n);
	for (const pattern of patterns) {
		for (let i = 0; i < n; i++) {
			const si = pattern[i];
			if (!si) continue;
			for (let j = i + 1; j < n; j++) {
				const v = si * pattern[j];
				w[i * n + j] += v;
				w[j * n + i] += v;
			}
		}
	}
	return w;
}

/** E = -½ Σ w_ij s_i s_j. Asynchronous updates never raise it; the test leans on that. */
export function energy(state: State, w: Float32Array, n: number): number {
	let e = 0;
	for (let i = 0; i < n; i++) {
		const si = state[i];
		for (let j = i + 1; j < n; j++) e -= w[i * n + j] * si * state[j];
	}
	return e;
}

/**
 * One asynchronous sweep: every cell updated once, in `order`, each seeing the others' current
 * values. Mutates `state` and reports how many cells changed, so a caller can stop once settled.
 *
 * Asynchronous and in a shuffled order on purpose. Updating every cell from one shared snapshot
 * lets the whole lattice flip in step and sit there oscillating, which never converges and does
 * not describe memory.
 */
export function sweep(state: State, w: Float32Array, n: number, order: Int32Array): number {
	let changed = 0;
	for (let k = 0; k < n; k++) {
		const i = order[k];
		const row = i * n;
		let sum = 0;
		for (let j = 0; j < n; j++) sum += w[row + j] * state[j];
		// Ties hold their value rather than picking a side, which keeps a settled state settled.
		const next = sum > 0 ? 1 : sum < 0 ? -1 : state[i];
		if (next !== state[i]) {
			state[i] = next as -1 | 1;
			changed++;
		}
	}
	return changed;
}

/**
 * One sweep at temperature `t`: each cell takes +1 with probability σ(2·field/t) instead of simply
 * following the sign of its field. Returns the RMS field, which is what the caller scales `t` by.
 *
 * This is the step that makes the Band an image rather than a two-tone slab. A zero-temperature
 * net converges to a fixed point and sits there, so every run returns the same state and
 * accumulating them can only produce 0 or MAX. At finite temperature the state keeps moving:
 * cells the stored memory holds firmly almost never flip, marginal ones flicker constantly, and
 * the proportion of sweeps a cell spends "on" is a continuous measure of how well it is held.
 *
 * It is also the better claim. The post is about material that is only partly consolidated and
 * what repeated exposure does to it — not about a memory that is either perfect or absent.
 */
export function sweepAt(
	state: State,
	w: Float32Array,
	n: number,
	order: Int32Array,
	t: number,
	rnd: () => number
): number {
	let sumSq = 0;
	for (let k = 0; k < n; k++) {
		const i = order[k];
		const row = i * n;
		let field = 0;
		for (let j = 0; j < n; j++) field += w[row + j] * state[j];
		sumSq += field * field;
		// Guarding t: at t→0 the exponent overflows to ±Infinity and the probability goes NaN,
		// which silently blanks the canvas rather than giving a cold, sharp net.
		const pUp = 1 / (1 + Math.exp((-2 * field) / Math.max(1e-6, t)));
		state[i] = rnd() < pUp ? 1 : -1;
	}
	return Math.sqrt(sumSq / n);
}

/** Mean agreement with a pattern, in [-1, 1]. 1 is exact recall, -1 its inverse. */
export function overlap(state: State, pattern: State, n: number): number {
	let dot = 0;
	for (let i = 0; i < n; i++) dot += state[i] * pattern[i];
	return dot / n;
}

/** Fisher–Yates, on a caller-supplied RNG so a Sketch stays deterministic for its Seed. */
function shuffled(n: number, rnd: () => number): Int32Array {
	const order = new Int32Array(n);
	for (let i = 0; i < n; i++) order[i] = i;
	for (let i = n - 1; i > 0; i--) {
		const j = Math.floor(rnd() * (i + 1));
		[order[i], order[j]] = [order[j], order[i]];
	}
	return order;
}

/**
 * Every knob the image has, and `simulate`/`paint` are split apart, so this Sketch can be rendered
 * to a PNG outside the browser (feed `paint`'s buffer to sharp) and looked at. Tuning it by
 * reloading a page and squinting produced two bad versions before that; every value below was then
 * chosen by rendering it.
 */
export const PARAMS = {
	/**
	 * Cells across the width. This is resolution, NOT zoom — raising it draws the same features
	 * with finer edges and costs N² per sweep, so 192 looked identical to 128 and took three times
	 * as long. `FREQ` is the zoom control.
	 */
	GW: 192,
	/**
	 * Rows. Fixed, NOT derived from the render width by keeping cells square — that is what the
	 * first version did, and because the lattice then shrinks as the canvas widens it gave 24 rows
	 * in a 1280 preview, 8 in a dev browser at 2x, and 9 in the 3440×2 render that actually ships.
	 * Three different pictures from one Sketch. Cells are wider than tall at every real size, which
	 * is correct for a band fourteen times wider than it is high.
	 */
	GH: 16,
	/**
	 * Cycles across the band, low and high. This sets how many features there are, which is what
	 * "denser" means here. At 2–8 the patterns were a handful of continents.
	 */
	FREQ: [12, 36] as [number, number],
	STORED: 6,
	RUNS: 4, // "listens" — each a fresh corruption of the same memory
	SETTLE: 3, // cold sweeps, to fall into a basin before sampling it
	SWEEPS: 16, // warm sweeps, each one accumulated
	CORRUPT: 0.4,
	// As a fraction of the RMS local field, so it scales with net size and load. This is the knob
	// the whole image hangs on and it was chosen by measurement, not taste: below ~0.5 almost every
	// cell pins to 0 or 1 and the Band is a two-tone slab again; above ~0.8 recall is lost and it
	// is fog.
	TEMP: 0.7
};

/** Runs the net and returns how many sweeps each cell spent "on". */
export function simulate(GW: number, GH: number, rnd: () => number): Float32Array {
	const { STORED, RUNS, SETTLE, SWEEPS, CORRUPT, TEMP } = PARAMS;
	const N = GW * GH;
	const patterns = makePatterns(GW, GH, STORED, rnd, PARAMS.FREQ);
	const w = train(patterns, N);
	// One memory is recalled every run. Repetition revealing the same thing is the subject; runs
	// chasing different memories would average to mush.
	const target = patterns[Math.floor(rnd() * STORED)];

	const ink = new Float32Array(N);
	const state = new Int8Array(N);

	for (let run = 0; run < RUNS; run++) {
		for (let i = 0; i < N; i++) {
			state[i] = rnd() < CORRUPT ? (rnd() < 0.5 ? -1 : 1) : target[i];
		}
		// Cold first: find the basin deterministically, so the warm sampling that follows is of
		// this memory rather than of the noise the run started in.
		let rms = 1;
		for (let s = 0; s < SETTLE; s++) {
			sweep(state, w, N, shuffled(N, rnd));
			rms = sweepAt(state, w, N, shuffled(N, rnd), 1e-6, rnd);
		}
		for (let s = 0; s < SWEEPS; s++) {
			sweepAt(state, w, N, shuffled(N, rnd), TEMP * rms, rnd);
			// A stored pattern and its inverse are the same memory to the net, so a run that settles
			// into the negative is a correct recall drawn upside down. Normalising the sign before
			// accumulating stops two such runs cancelling each other into flat grey.
			const sign = overlap(state, target, N) < 0 ? -1 : 1;
			for (let i = 0; i < N; i++) if (state[i] * sign > 0) ink[i] += 1;
		}
	}
	return ink;
}

/** Paints an ink field into RGBA at W×H. Separate from `simulate` so the preview can call both. */
export function paint(
	ink: Float32Array,
	GW: number,
	GH: number,
	W: number,
	H: number,
	CELLX: number,
	CELLY: number,
	accent: string,
	px: Uint8ClampedArray
) {
	const ar = parseInt(accent.slice(1, 3), 16);
	const ag = parseInt(accent.slice(3, 5), 16);
	const ab = parseInt(accent.slice(5, 7), 16);

	// Stretch to the range the run actually produced rather than to RUNS × SWEEPS. How confidently
	// a crowded net recalls varies with the seed, so a fixed ceiling makes some seeds wash out pale
	// and others clip to a slab. Percentiles rather than min/max so one extreme cell cannot set the
	// scale for the rest.
	const sorted = Float32Array.from(ink).sort();
	const lo = sorted[Math.floor(sorted.length * 0.04)];
	const hi = sorted[Math.floor(sorted.length * 0.99)];
	const span = Math.max(1, hi - lo);

	// Bilinear sample of the lattice, wrapping in x and clamping in y — the same asymmetry the
	// patterns are built with. Sampling nearest-neighbour instead gives hard 30px squares, which
	// reads as a chart rather than something that settled.
	const at = (gx: number, gy: number) => ink[gy * GW + (((gx % GW) + GW) % GW)];
	/** How reliably the memory held this point, 0 to 1, bilinear between lattice cells. */
	const reliability = (x: number, y: number) => {
		const fy = Math.min(GH - 1, Math.max(0, y / CELLY - 0.5));
		const y0 = Math.floor(fy);
		const y1 = Math.min(GH - 1, y0 + 1);
		const fx = x / CELLX - 0.5;
		const x0 = Math.floor(fx);
		// Smoothstep the blend rather than using the raw fraction. Plain bilinear is only
		// C0-continuous, so its gradient jumps at every cell boundary and the contour drawn from it
		// turns a right angle there — a staircase of jogs one cell apart, which is the other half of
		// looking fuzzy. Smoothstep makes the field C1 and the contours curve.
		const s = (f: number) => f * f * (3 - 2 * f);
		const tx = s(fx - x0);
		const ty = s(fy - y0);
		const v =
			(at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx) * (1 - ty) +
			(at(x0, y1) * (1 - tx) + at(x0 + 1, y1) * tx) * ty;
		return Math.min(1, Math.max(0, (v - lo) / span));
	};

	// Draw the net's UNCERTAINTY, not its answer: the boundary where reliability crosses a half,
	// between what the memory holds and what it does not. Painting confidence instead fills half
	// the canvas with solid accent, which is the camouflage an earlier version was.
	//
	// The contour is found analytically rather than by shading every cell near the threshold.
	// Shading gives a line whose width is set by the lattice — about one cell, which is ~28 screen
	// pixels on a wide canvas, and reads as fuzzy however the ramp is tuned. Dividing the distance
	// from the threshold by the local gradient converts it to a distance in PIXELS, so the line
	// holds a fixed weight at any lattice size or render width and the softness is one pixel of
	// antialiasing rather than half a cell of blur.
	const HALF = 0.7; // half the line weight, in pixels
	const FEATHER = 1.1; // antialiasing falloff, in pixels
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const a = reliability(x, y);
			// Central differences, so the gradient belongs to the same interpolated field drawn.
			const gx = (reliability(x + 1, y) - reliability(x - 1, y)) / 2;
			const gy = (reliability(x, y + 1) - reliability(x, y - 1)) / 2;
			const grad = Math.hypot(gx, gy);
			// No contour passes through a flat region at all; without this guard such pixels divide
			// by ~0 and the whole interior lights up.
			if (grad < 1e-7) continue;
			const dist = Math.abs(a - 0.5) / grad;
			if (dist > HALF + FEATHER) continue;
			const cover = 1 - Math.max(0, (dist - HALF) / FEATHER);
			// A steeper boundary is one the memory holds more sharply, so the gradient doubles as a
			// hierarchy: firm edges take the accent, vague ones stay off-white. Without it every
			// line is identical and the Band reads as a uniform mesh rather than a system.
			// Scaled by the cell size so it measures change per LATTICE CELL, not per pixel. Per
			// pixel it is a function of render width, so the same Band would come out all accent at
			// one size and all off-white at another. Cells are not square, so this uses their mean.
			const t = Math.min(1, (grad * ((CELLX + CELLY) / 2)) / 1.4);
			const o = (y * W + x) * 4;
			px[o] = 232 + (ar - 232) * t;
			px[o + 1] = 233 + (ag - 233) * t;
			px[o + 2] = 236 + (ab - 236) * t;
			px[o + 3] = Math.min(255, cover * 245);
		}
	}
}

// `density` is unused: the Harness has already folded it into width/height, and the cell size is
// derived from those, so every mark scales with the canvas without consulting it.
export default function hopfield(p: P5, { width: W, height: H }: SketchArgs) {
	// Fixed cell count across the width, so the pattern's frequency reads the same at any render
	// width; the cell grows instead. GH follows from square-ish cells.
	const CELLX = W / PARAMS.GW;
	const CELLY = H / PARAMS.GH;

	const ink = simulate(PARAMS.GW, PARAMS.GH, () => p.random());
	const accent =
		getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8ded51';
	const img = p.drawingContext.createImageData(W, H);
	paint(ink, PARAMS.GW, PARAMS.GH, W, H, CELLX, CELLY, accent, img.data);
	p.drawingContext.putImageData(img, 0, 0);
}
