import { describe, expect, it } from 'vitest';
import { chain, contour, num, rng, simplify, toPathData, toSvg } from './vector';
import type { Point } from './vector';

/**
 * These assert against fields whose contour is known in closed form — a circle, a plane — rather
 * than against a Sketch's output. A Band is noise, so "the picture changed" tells you nothing about
 * whether the geometry is right; a circle either comes out round or it does not.
 */

describe('contour', () => {
	/** `f` crosses 0.5 exactly on the circle of radius r/2 about the centre. */
	const cone = (cx: number, cy: number, r: number) => (x: number, y: number) =>
		1 - Math.hypot(x - cx, y - cy) / r;

	it('traces a circle at the right radius', () => {
		const segs = contour(cone(100, 100, 80), 200, 200, 200, 200);
		expect(segs.length).toBeGreaterThan(0);
		for (const [a, b] of segs) {
			for (const p of [a, b]) {
				// Half of r, because the field falls from 1 at the centre to 0 at r.
				expect(Math.hypot(p[0] - 100, p[1] - 100)).toBeCloseTo(40, 0);
			}
		}
	});

	it('finds nothing in a field that never crosses the level', () => {
		expect(contour(() => 0.9, 100, 100, 50, 50)).toEqual([]);
		expect(contour(() => 0.1, 100, 100, 50, 50)).toEqual([]);
	});

	it('puts the crossing where the field actually crosses, not at the cell edge', () => {
		// A plane crossing 0.5 at x = 30 of 100. Nearest-neighbour or midpoint interpolation would
		// land every point on a sample boundary — a multiple of 10 here — so this is what separates
		// real interpolation from a staircase. Mutation-checked: replacing `cut` with a constant 0.5
		// fails this.
		const segs = contour((x) => x / 60, 100, 40, 10, 4);
		expect(segs.length).toBeGreaterThan(0);
		for (const [a, b] of segs) {
			for (const p of [a, b]) expect(p[0]).toBeCloseTo(30, 5);
		}
	});

	it('closes across a field that wraps in x, leaving no gap at the seam', () => {
		// The Band is one wide image repeated with repeat-x, so a contour that does not meet itself
		// at the seam shows as a nick in every tile. The sampling grid spans 0..width inclusive, so
		// a field periodic in x is sampled identically on its first and last columns and the
		// crossings on the two outer edges must land at the same heights.
		//
		// The crossing is deliberately away from the seam in VALUE — it is at y = 20, where the
		// ramp passes the level — while the x-varying term returns to zero at both ends. A field
		// that instead crossed the level exactly AT x = 0 would be testing floating-point tie-breaks
		// on `> level`, not periodicity.
		const field = (x: number, y: number) => y / 40 + 0.15 * Math.sin((x / 360) * 2 * Math.PI);
		const segs = contour(field, 360, 40, 360, 8);
		const ys = (edge: number) =>
			[
				...new Set(
					segs
						.flat()
						.filter((p) => p[0] === edge)
						.map((p) => p[1].toFixed(3))
				)
			].sort();
		expect(ys(0)).not.toHaveLength(0);
		expect(ys(360)).toEqual(ys(0));
	});
});

describe('chain', () => {
	it('joins touching segments into one polyline and leaves separate runs apart', () => {
		const joined = chain([
			[
				[0, 0],
				[1, 0]
			],
			[
				[2, 0],
				[1, 0]
			], // reversed on purpose: orientation is not guaranteed by marching squares
			[
				[9, 9],
				[10, 9]
			]
		]);
		expect(joined).toHaveLength(2);
		const long = joined.find((l) => l.length === 3)!;
		expect(long.map((p) => p[0]).sort((a, b) => a - b)).toEqual([0, 1, 2]);
	});

	it('walks both ways from the segment it starts on', () => {
		// Starting in the middle and only growing the tail would return a 2-point line plus
		// leftovers. Mutation-checked: dropping the `fromHead` pass fails this.
		const joined = chain([
			[
				[1, 0],
				[2, 0]
			],
			[
				[0, 0],
				[1, 0]
			],
			[
				[2, 0],
				[3, 0]
			]
		]);
		expect(joined).toHaveLength(1);
		expect(joined[0]).toHaveLength(4);
	});
});

describe('simplify', () => {
	it('drops collinear points and keeps the corner', () => {
		const line: Point[] = [
			[0, 0],
			[1, 0],
			[2, 0],
			[3, 0],
			[3, 3]
		];
		expect(simplify(line, 0.5)).toEqual([
			[0, 0],
			[3, 0],
			[3, 3]
		]);
	});

	it('keeps a deviation larger than the tolerance', () => {
		const line: Point[] = [
			[0, 0],
			[5, 4],
			[10, 0]
		];
		expect(simplify(line, 0.5)).toHaveLength(3);
		expect(simplify(line, 10)).toHaveLength(2);
	});

	it('is a no-op below three points or at zero tolerance', () => {
		const two: Point[] = [
			[0, 0],
			[1, 1]
		];
		expect(simplify(two, 5)).toBe(two);
		const three: Point[] = [
			[0, 0],
			[1, 0],
			[2, 0]
		];
		expect(simplify(three, 0)).toBe(three);
	});
});

describe('serialising', () => {
	it('rounds to a tenth and drops a trailing zero', () => {
		expect(num(1.04)).toBe('1');
		expect(num(1.06)).toBe('1.1');
		expect(num(-0.02)).toBe('0');
	});

	it('writes one move and the rest as lines', () => {
		expect(
			toPathData([
				[0, 0],
				[1.25, 2]
			])
		).toBe('M0 0L1.3 2');
	});

	it('emits a document whose paths and background survive a round trip', () => {
		const svg = toSvg({
			width: 100,
			height: 20,
			background: '#0a0c10',
			strokeWidth: 1.4,
			paths: [
				{ d: 'M0 0L10 10', stroke: 'rgb(1,2,3)', opacity: 0.5 },
				{ d: 'M5 5L6 6', stroke: 'rgb(4,5,6)', opacity: 1 }
			]
		});
		expect(svg.startsWith('<svg')).toBe(true);
		expect(svg.endsWith('</svg>')).toBe(true);
		expect(svg).toContain('viewBox="0 0 100 20"');
		expect(svg).toContain('fill="#0a0c10"');
		expect(svg.match(/<path/g) ?? []).toHaveLength(2);
		expect(svg).toContain('stroke-opacity="0.50"');
		// A fully opaque path omits the attribute rather than writing the default. Worth asserting
		// because it is a size decision on a file with hundreds of paths, not a cosmetic one.
		expect(svg).not.toContain('stroke-opacity="1.00"');
	});
});

describe('rng', () => {
	it('is deterministic for a seed and differs between seeds', () => {
		const take = (s: number) => Array.from({ length: 5 }, rng(s));
		expect(take(1)).toEqual(take(1));
		expect(take(1)).not.toEqual(take(2));
	});

	it('stays in [0, 1)', () => {
		const next = rng(42);
		for (let i = 0; i < 1000; i++) {
			const v = next();
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(1);
		}
	});
});
