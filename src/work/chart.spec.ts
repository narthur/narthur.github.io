import { describe, expect, it } from 'vitest';
import { bar, mirroredPath, smooth, timeScale } from './chart';

// 2014-01 through 2026-09: 12.75 years.
const scale = timeScale(2014, '2026-09');

describe('timeScale', () => {
	it('runs from January of the first year to the end of the last month', () => {
		expect(scale.x(2014)).toBe(0);
		expect(scale.x(2026.75)).toBeCloseTo(100);
	});
});

describe('bar', () => {
	it('covers whole years, inclusive of the end year', () => {
		const b = bar({ start: 2014, end: 2018 }, scale);
		expect(b.left).toBe(0);
		expect(b.width).toBeCloseTo((5 / 12.75) * 100);
		expect(b.ongoing).toBe(false);
	});

	it('runs an ongoing span to the end of the axis', () => {
		const b = bar({ start: 2023 }, scale);
		expect(b.left + b.width).toBeCloseTo(100);
		expect(b.ongoing).toBe(true);
	});

	it('stops a span ending this year at the axis rather than past it', () => {
		const b = bar({ start: 2025, end: 2026 }, scale);
		expect(b.left + b.width).toBeCloseTo(100);
	});

	it('clamps a span that began before the axis to its left edge', () => {
		const b = bar({ start: 2008 }, scale);
		expect(b.left).toBe(0);
		expect(b.width).toBeCloseTo(100);
	});

	it('hangs labels from the right edge only once they would run past it', () => {
		expect(bar({ start: 2019 }, scale).label).toBe('left');
		expect(bar({ start: 2022 }, scale).label).toBe('right-on-narrow');
		expect(bar({ start: 2025 }, scale).label).toBe('right');
	});
});

describe('smooth', () => {
	it('scales the peak to 1', () => {
		expect(Math.max(...smooth([0, 5, 10, 5, 0], 0))).toBe(1);
		expect(Math.max(...smooth([0, 5, 10, 5, 0], 1))).toBeCloseTo(1);
	});

	it('spreads a spike into its neighbours', () => {
		const s = smooth([0, 0, 10, 0, 0], 1);
		expect(s[1]).toBeGreaterThan(0);
		expect(s[1]).toBeCloseTo(s[3]);
	});

	it('leaves an all-zero series at zero instead of dividing by it', () => {
		expect(smooth([0, 0, 0], 1)).toEqual([0, 0, 0]);
	});
});

describe('mirroredPath', () => {
	it('spans the full width and mirrors about the centre line', () => {
		const d = mirroredPath([0.5, 1, 0.5]);
		const points = d
			.slice(1, -1)
			.split('L')
			.map((p) => p.split(',').map(Number));
		expect(points[0][0]).toBe(0);
		expect(Math.max(...points.map(([x]) => x))).toBe(1000);
		const [x, yTop] = points[0];
		const mirror = points.find(([px, py]) => px === x && py !== yTop);
		expect(mirror && mirror[1] - 50).toBeCloseTo(50 - yTop);
	});

	it('never draws past the viewBox', () => {
		const ys = mirroredPath([0, 1, 0, 1, 0])
			.slice(1, -1)
			.split('L')
			.map((p) => Number(p.split(',')[1]));
		expect(Math.min(...ys)).toBeGreaterThanOrEqual(2);
		expect(Math.max(...ys)).toBeLessThanOrEqual(98);
	});
});
