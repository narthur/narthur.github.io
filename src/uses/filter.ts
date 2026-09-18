export interface UsesItem {
	name: string;
	description: string;
	url: string;
	category?: string;
	tags?: string[];
}

export interface UsesMeta {
	lastUpdated: string;
	affiliateDisclaimer: string;
}

export interface UsesData {
	items: UsesItem[];
	meta: UsesMeta;
}

export const UNCATEGORIZED = 'Other';

export const categoryOf = (item: UsesItem) => item.category ?? UNCATEGORIZED;

/** Categories in the order they first appear in the YAML — the file is the running order. */
export function categoriesInOrder(items: UsesItem[]): string[] {
	return [...new Set(items.map(categoryOf))];
}

export function allTags(items: UsesItem[]): string[] {
	return [...new Set(items.flatMap((item) => item.tags ?? []))].sort();
}

/** An empty selection matches everything; otherwise an item needs at least one selected tag. */
export function matchesTags(item: Pick<UsesItem, 'tags'>, selected: Set<string>): boolean {
	return selected.size === 0 || (item.tags?.some((tag) => selected.has(tag)) ?? false);
}

/** A copy of `selected` with `tag` flipped: added if absent, removed if present. */
export function toggleTag(selected: Set<string>, tag: string): Set<string> {
	const next = new Set(selected);
	if (!next.delete(tag)) next.add(tag);
	return next;
}

export function itemsInCategory(
	items: UsesItem[],
	category: string,
	selected: Set<string>
): UsesItem[] {
	return items
		.filter((item) => categoryOf(item) === category && matchesTags(item, selected))
		.sort((a, b) => a.name.localeCompare(b.name));
}
