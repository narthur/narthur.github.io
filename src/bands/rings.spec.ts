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
});
