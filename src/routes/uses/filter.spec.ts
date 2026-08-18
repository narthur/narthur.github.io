import { describe, expect, it } from 'vitest';
import { allTags, categoriesInOrder, itemsInCategory, matchesTags, type UsesItem } from './filter';

const items: UsesItem[] = [
	{ name: 'Zed', description: '', url: '', category: 'Editors', tags: ['terminal', 'ai'] },
	{ name: 'Ghostty', description: '', url: '', category: 'Editors', tags: ['terminal'] },
	{ name: 'Obsidian', description: '', url: '', category: 'Apps', tags: ['notes'] },
	{ name: 'Mystery', description: '', url: '' }
];

describe('categoriesInOrder', () => {
	it('keeps first-seen order rather than sorting', () => {
		expect(categoriesInOrder(items)).toEqual(['Editors', 'Apps', 'Other']);
	});
});

describe('allTags', () => {
	it('dedupes and sorts, tolerating items with no tags', () => {
		expect(allTags(items)).toEqual(['ai', 'notes', 'terminal']);
	});
});

describe('matchesTags', () => {
	it('matches everything when nothing is selected', () => {
		expect(matchesTags(items[3], new Set())).toBe(true);
	});

	it('matches on any selected tag, not all of them', () => {
		expect(matchesTags(items[0], new Set(['ai', 'notes']))).toBe(true);
	});

	it('excludes an untagged item once a filter is active', () => {
		expect(matchesTags(items[3], new Set(['terminal']))).toBe(false);
	});
});

describe('itemsInCategory', () => {
	it('sorts by name within the category', () => {
		expect(itemsInCategory(items, 'Editors', new Set()).map((i) => i.name)).toEqual([
			'Ghostty',
			'Zed'
		]);
	});

	it('applies the tag filter within the category', () => {
		expect(itemsInCategory(items, 'Editors', new Set(['ai'])).map((i) => i.name)).toEqual(['Zed']);
	});

	it('groups uncategorised items under Other', () => {
		expect(itemsInCategory(items, 'Other', new Set()).map((i) => i.name)).toEqual(['Mystery']);
	});
});
