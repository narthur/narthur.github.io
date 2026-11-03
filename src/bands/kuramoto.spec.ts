import { describe, expect, it } from 'vitest';
import { PARAMS, phases } from './kuramoto';

const COLS = 1720;
const wrapped = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

describe('kuramoto', () => {
	it('steps across the x seam like any other column, so the Band tiles', () => {
		const th = phases(COLS, 1);
		for (let i = 0; i < PARAMS.ROWS; i++) {
			const row = i * COLS;
			const seam = wrapped(th[row] - th[row + COLS - 1]);
			const inside = wrapped(th[row + 1] - th[row]);
			// A step is about OMEGA; a seam that failed to close would be off by up to π.
			expect(Math.abs(seam - inside)).toBeLessThan(0.15);
		}
	});

	it('is a pure function of the seed', () => {
		expect(phases(200, 3)).toEqual(phases(200, 3));
		expect(phases(200, 3)).not.toEqual(phases(200, 4));
	});

	it('both locks and drifts somewhere along the strip', () => {
		// Order parameter per column: 1 when every row is in step, near 0 when they are scattered.
		const th = phases(COLS, 1);
		const r = Array.from({ length: COLS }, (_, c) => {
			let re = 0;
			let im = 0;
			for (let i = 0; i < PARAMS.ROWS; i++) {
				re += Math.cos(th[i * COLS + c]);
				im += Math.sin(th[i * COLS + c]);
			}
			return Math.hypot(re, im) / PARAMS.ROWS;
		});
		expect(Math.max(...r)).toBeGreaterThan(0.8);
		expect(Math.min(...r)).toBeLessThan(0.4);
	});
});
