import { describe, expect, it } from 'vitest';
import { geometry } from './harvest';

const at = (seed: number, width = 3440, height = 240) =>
	geometry({ width, height, seed, accent: '#8ded51' });

/** Start point of every polyline in a path's `d`. */
const starts = (d: string) =>
	[...d.matchAll(/M(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);

describe('harvest', () => {
	const W = 3440;
	/** Every polyline starting near either edge has a twin a Band-width away. */
	const tiles = (d: string) => {
		const points = starts(d);
		const near = points.filter(([x]) => (x >= 0 && x < 40) || (x > W - 40 && x <= W));
		expect(near.length).toBeGreaterThan(0);
		for (const [x, y] of near) {
			const twin = x < W / 2 ? x + W : x - W;
			expect(points.some(([x2, y2]) => Math.abs(x2 - twin) < 0.2 && y2 === y)).toBe(true);
		}
	};

	it('repeats every stalk near one edge at the other, so the Band tiles', () => {
		tiles(at(57826).paths[0].d);
	});

	it('draws grain, and the grain tiles too', () => {
		tiles(at(57826).paths[1].d);
	});

	it('is a pure function of the seed', () => {
		const g = (seed: number) => JSON.stringify(at(seed));
		expect(g(3)).toBe(g(3));
		expect(g(3)).not.toBe(g(4));
	});

	it('scales with the Band size', () => {
		const count = (w: number, h: number) => starts(at(57826, w, h).paths[0].d).length;
		expect(count(1720, 120)).toBe(count(3440, 240));
	});
});
