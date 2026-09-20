import { describe, expect, it } from 'vitest';
import { monthsBetween, perMonth, tally, totals, type Commits } from './commits';

describe('tally', () => {
	it('splits mine from everyone else by author name prefix, dropping bots', () => {
		const log = [
			'Nathan Arthur|2020-01',
			'Nathan Arthur (aider)|2020-01',
			'Someone Else|2020-01',
			'dependabot[bot]|2020-01',
			'Someone Else|2020-02',
			''
		].join('\n');
		expect(tally(log, 'Nathan Arthur')).toEqual({ '2020-01': [2, 1], '2020-02': [0, 1] });
	});

	it('keeps a pipe inside an author name', () => {
		expect(tally('A | B|2021-03', 'Nathan Arthur')).toEqual({ '2021-03': [0, 1] });
	});
});

describe('monthsBetween', () => {
	it('runs from January of the first year to December of the last', () => {
		const months = monthsBetween(2018, 2019);
		expect(months).toHaveLength(24);
		expect(months[0]).toBe('2018-01');
		expect(months[23]).toBe('2019-12');
	});
});

const commits: Commits = {
	front: { '2017-06': [1, 4], '2018-01': [3, 1], '2018-02': [0, 2] },
	back: { '2018-01': [1, 0], '2019-05': [2, 2] }
};

describe('perMonth', () => {
	it('sums every repository, month by month, within the range', () => {
		expect(perMonth(commits, ['2018-01', '2018-02'])).toEqual({ mine: [4, 0], others: [1, 2] });
	});

	it('can be limited to some repositories', () => {
		expect(perMonth(commits, ['2018-01'], ['back'])).toEqual({ mine: [1], others: [0] });
	});
});

describe('totals', () => {
	it('counts all of history and spans only the months I committed', () => {
		expect(totals(commits, ['front'])).toEqual({
			mine: 4,
			others: 7,
			first: '2017-06',
			last: '2018-01'
		});
	});

	it('fails loudly on a repository missing from the data', () => {
		expect(() => totals(commits, ['nope'])).toThrow('nope');
	});
});
