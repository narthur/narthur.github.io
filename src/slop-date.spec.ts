import { describe, expect, it } from 'vitest';
import { isPublished } from './slop-date';

// Frontmatter `date: 2026-11-03` coerces to UTC midnight.
const date = new Date('2026-11-03');

describe('isPublished', () => {
	it('hides a post the second before its date', () => {
		expect(isPublished(date, new Date('2026-11-02T23:59:59Z'))).toBe(false);
	});
	it('shows it from 00:00 UTC on its date', () => {
		expect(isPublished(date, new Date('2026-11-03T00:00:00Z'))).toBe(true);
	});
	it('shows it at the 12:00 UTC scheduled rebuild', () => {
		expect(isPublished(date, new Date('2026-11-03T12:00:00Z'))).toBe(true);
	});
});
