import { describe, expect, it } from 'vitest';
import { geometry, survey } from './digitised';

describe('digitised', () => {
	it('matches itself across the x seam, so the Band tiles', () => {
		const { field, digitised } = survey(3440, 240, 1);
		for (const y of [0, 37, 120, 239]) {
			expect(digitised(0, y)).toBe(digitised(3440, y));
			expect(field(0, y)).toBeCloseTo(field(3440, y), 9);
		}
	});

	it('draws both sides of the seam', () => {
		const g = geometry({ width: 3440, height: 240, seed: 1, accent: '#8ded51' });
		expect(g.paths).toHaveLength(2);
	});

	it('is a pure function of the seed', () => {
		const g = (seed: number) =>
			JSON.stringify(geometry({ width: 3440, height: 240, seed, accent: '#8ded51' }));
		expect(g(3)).toBe(g(3));
		expect(g(3)).not.toBe(g(4));
	});

	it('draws the same picture at any height', () => {
		// Line count, not path data: simplify works in output pixels, so the points differ slightly.
		const lines = (width: number, height: number) =>
			geometry({ width, height, seed: 34268, accent: '#8ded51' })
				.paths.map((p) => p.d.split('M').length - 1)
				.reduce((a, b) => a + b, 0);
		const at240 = lines(3440, 240);
		for (const [w, h] of [
			[1720, 120],
			[6880, 480]
		])
			expect(Math.abs(lines(w, h) - at240)).toBeLessThanOrEqual(at240 * 0.05);
	});
});
