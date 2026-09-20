import { describe, expect, it } from 'vitest';
import {
	axis,
	bar,
	blur,
	mirroredPath,
	newestFirst,
	oldestFirst,
	rangeLabel,
	smooth,
	timeScale
} from './chart';

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
		const b = bar({ start: 2023, end: 'now' }, scale);
		expect(b.left + b.width).toBeCloseTo(100);
		expect(b.ongoing).toBe(true);
	});

	it('stops a span ending this year at the axis rather than past it', () => {
		const b = bar({ start: 2025, end: 2026 }, scale);
		expect(b.left + b.width).toBeCloseTo(100);
	});

	it('clamps a span that began before the axis to its left edge', () => {
		const b = bar({ start: 2008, end: 'now' }, scale);
		expect(b.left).toBe(0);
		expect(b.width).toBeCloseTo(100);
		expect(b.clippedStart).toBe(true);
		expect(bar({ start: 2014, end: 'now' }, scale).clippedStart).toBe(false);
	});

	it('treats a missing end as the start year alone', () => {
		const b = bar({ start: 2020 }, scale);
		expect(b.width).toBeCloseTo((1 / 12.75) * 100);
		expect(b.ongoing).toBe(false);
	});

	it('hangs labels from the right edge only once they would run past it', () => {
		expect(bar({ start: 2019, end: 'now' }, scale).labelAnchor).toBe('left');
		expect(bar({ start: 2022, end: 'now' }, scale).labelAnchor).toBe('right-on-narrow');
		expect(bar({ start: 2025, end: 'now' }, scale).labelAnchor).toBe('right');
	});
});

describe('rangeLabel', () => {
	it('reads as a single year, a closed range, or an open one', () => {
		expect(rangeLabel({ start: 2024 })).toBe('2024');
		expect(rangeLabel({ start: 2019, end: 2025 })).toBe('2019—2025');
		expect(rangeLabel({ start: 2019, end: 'now' })).toBe('2019—now');
		expect(rangeLabel({ start: 2020, end: 2020 })).toBe('2020');
	});
});

describe('sorting', () => {
	const spans = [
		{ start: 2024, end: 2024 },
		{ start: 2019, end: 2025 },
		{ start: 2024 },
		{ start: 2024, end: 'now' as const },
		{ start: 2019, end: 'now' as const }
	];

	it('puts the latest start first, and the longest-running of a tie first', () => {
		expect(spans.slice().sort(newestFirst)).toEqual([
			{ start: 2024, end: 'now' },
			{ start: 2024, end: 2024 },
			{ start: 2024 },
			{ start: 2019, end: 'now' },
			{ start: 2019, end: 2025 }
		]);
	});

	it('treats a missing end the same as an end in the start year', () => {
		expect(newestFirst({ start: 2024 }, { start: 2024, end: 2024 })).toBe(0);
	});

	it('puts the earliest start first for the waterfall', () => {
		expect(spans.slice().sort(oldestFirst)[0]).toEqual({ start: 2019, end: 'now' });
	});
});

describe('axis', () => {
	it('marks every other year from the first, then "now" at the end', () => {
		const { grid, ticks } = axis(scale);
		expect(ticks.map((t) => t.label)).toEqual([
			'2014',
			'2016',
			'2018',
			'2020',
			'2022',
			'2024',
			'2026',
			'now'
		]);
		expect(grid[0]).toBe(0);
		expect(ticks.at(-1)?.left).toBe(100);
	});

	it('keeps the first label inside the axis and hides one crowding "now" on phones', () => {
		const { ticks } = axis(scale);
		expect(ticks[0].shift).toBe('');
		expect(ticks.find((t) => t.label === '2026')?.shift).toContain('hidden sm:inline');
		expect(ticks.find((t) => t.label === '2024')?.shift).not.toContain('hidden');
	});

	it('never places a tick past the end of a short axis', () => {
		const { ticks } = axis(timeScale(2024, '2025-01'));
		expect(ticks.map((t) => t.label)).toEqual(['2024', 'now']);
	});
});

describe('axis for a finished span', () => {
	it('ends on the closing year instead of "now"', () => {
		const { ticks } = axis(timeScale(2018, '2025-12'), '2025');
		expect(ticks.map((t) => t.label)).toEqual(['2018', '2020', '2022', '2024', '2025']);
	});

	it('labels a closing year once, even when a two-year tick lands on it', () => {
		expect(axis(timeScale(2020, '2020-12'), '2020').ticks.map((t) => t.label)).toEqual(['2020']);
		const { grid, ticks } = axis(timeScale(2018, '2020-12'), '2020');
		expect(ticks.map((t) => t.label)).toEqual(['2018', '2020']);
		expect(grid).toHaveLength(2);
	});
});

describe('blur', () => {
	it('keeps the series in its own units', () => {
		const out = blur([0, 0, 10, 0, 0], 1);
		expect(out[2]).toBeLessThan(10);
		expect(out.reduce((a, b) => a + b)).toBeGreaterThan(5);
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
