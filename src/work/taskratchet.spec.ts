import { describe, expect, it } from 'vitest';
import { format, isStats } from './taskratchet';

describe('format', () => {
	it('groups thousands, prefixes dollars, and shows the rate as a percentage', () => {
		expect(
			format({ totalTasks: 48254, activeStakes: 1469, percentageCompletion: 0.8891358999397477 })
		).toEqual({ tasks: '48,254', stakes: '$1,469', completion: '88.9%' });
	});

	it('shows a perfect rate as 100.0%', () => {
		expect(format({ totalTasks: 1, activeStakes: 0, percentageCompletion: 1 }).completion).toBe(
			'100.0%'
		);
	});
});

describe('isStats', () => {
	it('accepts the live shape, extra fields included', () => {
		expect(
			isStats({ totalTasks: 1, activeStakes: 2, percentageCompletion: 0.5, totalActiveTasks: 3 })
		).toBe(true);
	});

	it('rejects a missing or non-numeric counter', () => {
		expect(isStats({ totalTasks: 1, activeStakes: 2 })).toBe(false);
		expect(isStats({ totalTasks: '1', activeStakes: 2, percentageCompletion: 0.5 })).toBe(false);
		expect(isStats({ error: 'nope' })).toBe(false);
		expect(isStats(null)).toBe(false);
	});
});
