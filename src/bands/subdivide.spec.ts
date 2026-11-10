import { describe, expect, it } from 'vitest';
import { PARAMS, geometry, layout } from './subdivide';

describe('subdivide', () => {
	const { findings, cells } = layout(3440, 240, 1);

	it('splits every cell holding a finding down to the depth limit', () => {
		for (const [px, py] of findings) {
			const home = cells.find((c) => px >= c.x && px < c.x + c.w && py >= c.y && py < c.y + c.h);
			expect(home?.depth).toBe(PARAMS.MAX_DEPTH);
		}
	});

	it('leaves clean cells whole', () => {
		const dirty = (c: (typeof cells)[number]) =>
			findings.some(([px, py]) => px >= c.x && px < c.x + c.w && py >= c.y && py < c.y + c.h);
		for (const c of cells.filter((c) => c.depth < PARAMS.MAX_DEPTH)) expect(dirty(c)).toBe(false);
	});

	it('splits every column at least once', () => {
		// Seed 1 used to leave the first column whole; check a spread of seeds, not just that one.
		for (let seed = 1; seed <= 50; seed++)
			expect(layout(3440, 240, seed).cells.every((c) => c.depth > 0)).toBe(true);
	});

	it('covers the strip exactly, so nothing crosses the seam or leaves a hole', () => {
		for (const c of cells) {
			expect(c.x).toBeGreaterThanOrEqual(0);
			expect(c.x + c.w).toBeLessThanOrEqual(3440 + 1e-9);
			expect(c.y).toBeGreaterThanOrEqual(0);
			expect(c.y + c.h).toBeLessThanOrEqual(240 + 1e-9);
		}
		// Inside the strip and summing to its area means no gaps and no overlaps.
		expect(cells.reduce((a, c) => a + c.w * c.h, 0)).toBeCloseTo(3440 * 240, 3);
	});

	it('is a pure function of the seed', () => {
		const g = (seed: number) =>
			JSON.stringify(geometry({ width: 3440, height: 240, seed, accent: '#8ded51' }));
		expect(g(3)).toBe(g(3));
		expect(g(3)).not.toBe(g(4));
	});
});
