import { describe, expect, it } from 'vitest';
import { geometry, ringField } from './rings';

describe('rings', () => {
	it('matches itself across the x seam, so the Band tiles', () => {
		const f = ringField(3440, 240, 1);
		for (const y of [0, 37, 120, 239]) expect(f(0, y)).toBeCloseTo(f(3440, y), 9);
	});

	it('is a pure function of the seed', () => {
		const g = (seed: number) =>
			JSON.stringify(geometry({ width: 3440, height: 240, seed, accent: '#8ded51' }));
		expect(g(3)).toBe(g(3));
		expect(g(3)).not.toBe(g(4));
	});

	it('draws the same rings at any height', () => {
		// Ring count, not path data: simplify works in output pixels, so the points differ slightly.
		// With the H/240 scaling removed, 120 high draws 83 rings to 240 high's 157.
		const rings = (width: number, height: number) =>
			geometry({ width, height, seed: 58954, accent: '#8ded51' }).paths[0].d.split('M').length - 1;
		const at240 = rings(3440, 240);
		for (const [w, h] of [
			[1720, 120],
			[6880, 480]
		])
			expect(Math.abs(rings(w, h) - at240)).toBeLessThanOrEqual(at240 * 0.05);
	});
});
