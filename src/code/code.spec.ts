import { describe, expect, it } from 'vitest';
import { dayLabel, isShown, shownByYear, type CodeItem } from './code';

const now = new Date('2026-09-22T00:00:00Z');

const item = (overrides: Partial<CodeItem>): CodeItem => ({
	owner: 'narthur',
	name: 'thing',
	url: '',
	description: '',
	stars: 0,
	pushed: '2026-09-01',
	language: '',
	...overrides
});

describe('isShown', () => {
	it('keeps anything pushed inside the freshness window', () => {
		expect(isShown(item({ pushed: '2025-10-01' }), now)).toBe(true);
	});

	it('drops an unstarred repository once it falls outside it', () => {
		expect(isShown(item({ pushed: '2025-09-21' }), now)).toBe(false);
	});

	it('keeps a stale repository that earned a star', () => {
		expect(isShown(item({ pushed: '2019-01-01', stars: 1 }), now)).toBe(true);
	});

	it('counts back across a year boundary', () => {
		const newYear = new Date('2026-02-10T00:00:00Z');
		expect(isShown(item({ pushed: '2025-02-11' }), newYear)).toBe(true);
		expect(isShown(item({ pushed: '2025-02-09' }), newYear)).toBe(false);
	});
});

describe('shownByYear', () => {
	it('groups the shown items newest first, within and between years', () => {
		const years = shownByYear(
			[
				item({ name: 'old', pushed: '2019-01-01' }),
				item({ name: 'starred', pushed: '2019-06-01', stars: 3 }),
				item({ name: 'b', pushed: '2026-01-05' }),
				item({ name: 'a', pushed: '2026-09-16' })
			],
			now
		);
		expect(years.map((year) => [year.year, year.items.map((item) => item.name)])).toEqual([
			['2026', ['a', 'b']],
			['2019', ['starred']]
		]);
	});
});

describe('dayLabel', () => {
	it('reads as a month and a day', () => {
		expect(dayLabel('2026-09-16')).toBe('sep 16');
	});
});
