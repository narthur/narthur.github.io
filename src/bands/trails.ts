// The `.ts` extension is required, not stylistic: scripts/band-preview.mjs imports this Sketch
// into plain Node, which strips types but will not resolve an extensionless specifier. Dropping it
// typechecks and builds fine and breaks only the preview tool, silently.
import { ACCENT } from '../theme.ts';
import type { P5, SketchArgs } from './types';

/**
 * Stigmergy — how ants actually find paths.
 *
 * Each ant smells the pheromone just ahead of it to the left, centre and right, turns toward the
 * strongest, moves, and drops a little where it lands. The field diffuses and evaporates every
 * tick, so a route only survives if ants keep choosing it. Nothing plans the network that emerges
 * and no single ant can perceive it.
 *
 * That is the point, for this post. "Small Treasures" asks whether a thing is worth wonder if
 * nobody laboured over it; ant trails are the standard case of real structure arising from agents
 * too simple to deserve the credit.
 *
 * Two buffers, because they want opposite things. `smell` is blurred and decaying: that is what
 * makes the ants steer, and blurring it is not optional. `ink` records where ants actually walked
 * and is never blurred, so the drawn trails stay sharp. Rendering the smell field directly is
 * what made the first version look like fog.
 */
export default function trails(p: P5, { width: W, height: H, density }: SketchArgs) {
	const CELL = 2 * density;
	const gw = Math.ceil(W / CELL);
	const gh = Math.ceil(H / CELL);
	const smell = new Float32Array(gw * gh);
	const next = new Float32Array(gw * gh);
	const ink = new Float32Array(W * H);

	const SENSE = 9 * density; // how far ahead an ant can smell; longer makes straighter routes
	const SPREAD = 0.45; // angle out to its left and right sensors
	const TURN = 0.55;
	const SPEED = 1.0 * density;
	const EVAP = 0.88; // lower evaporates faster, which sharpens trails into distinct routes
	const STEPS = 320; // long enough for routes to consolidate; at 80 it is still a search

	const accent =
		getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || ACCENT;

	// The field is a cylinder: it wraps in x and is walled in y. Ants wrap, and so must the
	// pheromone — sampling and diffusion included. Wrapping only the ants leaves the seam with no
	// scent continuity, so trails die where they cross it; that is the bug this fixes, and it is
	// what lets one wide render be cropped into every narrower size.
	const wrapX = (gx: number) => ((gx % gw) + gw) % gw;

	const sniff = (x: number, y: number) => {
		const gy = Math.floor(y / CELL);
		if (gy < 0 || gy >= gh) return -1;
		return smell[gy * gw + wrapX(Math.floor(x / CELL))];
	};

	const ants: { x: number; y: number; a: number }[] = [];
	for (let i = 0; i < (W * H) / (90 * density * density); i++) {
		ants.push({ x: p.random(W), y: p.random(H), a: p.random(Math.PI * 2) });
	}

	for (let s = 0; s < STEPS; s++) {
		for (const ant of ants) {
			const ahead = sniff(ant.x + Math.cos(ant.a) * SENSE, ant.y + Math.sin(ant.a) * SENSE);
			const left = sniff(
				ant.x + Math.cos(ant.a - SPREAD) * SENSE,
				ant.y + Math.sin(ant.a - SPREAD) * SENSE
			);
			const right = sniff(
				ant.x + Math.cos(ant.a + SPREAD) * SENSE,
				ant.y + Math.sin(ant.a + SPREAD) * SENSE
			);
			if (ahead >= left && ahead >= right) {
				// already pointed at the strongest smell; hold the line
			} else if (left > right) ant.a -= TURN * p.random();
			else if (right > left) ant.a += TURN * p.random();
			else ant.a += (p.random() - 0.5) * TURN;

			ant.x += Math.cos(ant.a) * SPEED;
			ant.y += Math.sin(ant.a) * SPEED;
			if (ant.x < 0) ant.x += W;
			if (ant.x >= W) ant.x -= W;
			// Top and bottom are real edges; ants reflect off them. The trails that run parallel to
			// them are that reflection, and they are why a Band is never cropped in y.
			if (ant.y < 0 || ant.y >= H) {
				ant.a = -ant.a;
				ant.y = Math.min(Math.max(ant.y, 0), H - 0.01);
			}

			smell[Math.floor(ant.y / CELL) * gw + wrapX(Math.floor(ant.x / CELL))] += 1;
			// Steps are about a pixel apart, so stamping the one pixel draws a continuous line
			// without interpolating between them.
			ink[Math.floor(ant.y) * W + Math.floor(ant.x)] += 1;
		}

		// Diffuse and evaporate. Weighted toward the centre rather than a flat box blur: a flat
		// average smears a trail outward as fast as the ants lay it down.
		for (let y = 0; y < gh; y++) {
			for (let x = 0; x < gw; x++) {
				const i = y * gw + x;
				let sum = smell[i] * 4;
				let n = 4;
				sum += smell[y * gw + wrapX(x - 1)];
				sum += smell[y * gw + wrapX(x + 1)];
				n += 2;
				if (y > 0) {
					sum += smell[i - gw];
					n++;
				}
				if (y < gh - 1) {
					sum += smell[i + gw];
					n++;
				}
				next[i] = (sum / n) * EVAP;
			}
		}
		smell.set(next);
	}

	// Scale to a high percentile rather than the maximum: one freak cell where ants piled up would
	// otherwise set the ceiling and push every real trail down into the dark. Taken from a sample,
	// because sorting every inked pixel is a few million floats on a wide retina canvas and the
	// percentile of a sample is the same number to the eye.
	const sample: number[] = [];
	for (let i = 0; i < ink.length; i += 11) if (ink[i]) sample.push(ink[i]);
	sample.sort((a, b) => a - b);
	const hi = sample[Math.floor(sample.length * 0.995)] || 1;

	const ar = parseInt(accent.slice(1, 3), 16);
	const ag = parseInt(accent.slice(3, 5), 16);
	const ab = parseInt(accent.slice(5, 7), 16);

	const img = p.drawingContext.createImageData(W, H);
	const px = img.data;
	for (let i = 0; i < ink.length; i++) {
		if (!ink[i]) continue;
		// Square root compresses the top so the busiest routes do not blow out, and lifts the faint
		// ones so a single pass still registers.
		const v = Math.min(1, Math.sqrt(ink[i] / hi));
		// The busiest routes take the accent; everything else stays off-white.
		const t = Math.max(0, (v - 0.45) / 0.55);
		const o = i * 4;
		px[o] = 232 + (ar - 232) * t;
		px[o + 1] = 233 + (ag - 233) * t;
		px[o + 2] = 236 + (ab - 236) * t;
		px[o + 3] = Math.min(255, v * 255);
	}
	p.drawingContext.putImageData(img, 0, 0);
}
