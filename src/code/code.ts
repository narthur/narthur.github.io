export interface CodeItem {
	owner: string;
	name: string;
	url: string;
	description: string;
	stars: number;
	/** YYYY-MM-DD, the last push. */
	pushed: string;
	language: string;
	gist?: boolean;
}

/** A repository nobody has starred and nobody has touched in this long has stopped being evidence. */
export const FRESH_MONTHS = 12;

/**
 * The whole editorial rule, in one place: it earned a star, or it is still being worked on.
 * Nothing is picked or hidden by hand, so the page can say so.
 */
export function isShown(item: CodeItem, now: Date): boolean {
	if (item.stars > 0) return true;
	const cutoff = new Date(now);
	cutoff.setUTCMonth(cutoff.getUTCMonth() - FRESH_MONTHS);
	return item.pushed >= cutoff.toISOString().slice(0, 10);
}

export interface CodeYear {
	year: string;
	items: CodeItem[];
}

/** What the page renders: newest push first, grouped under the year of that push. */
export function shownByYear(items: CodeItem[], now: Date): CodeYear[] {
	const years = new Map<string, CodeItem[]>();
	for (const item of items
		.filter((item) => isShown(item, now))
		.sort((a, b) => b.pushed.localeCompare(a.pushed))) {
		const year = item.pushed.slice(0, 4);
		if (!years.has(year)) years.set(year, []);
		years.get(year)!.push(item);
	}
	return [...years].map(([year, items]) => ({ year, items }));
}

const MONTHS = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');

/** `2026-09-16` → `sep 16`. The year is already the group heading. */
export function dayLabel(pushed: string): string {
	const [, month, day] = pushed.split('-');
	return `${MONTHS[Number(month) - 1]} ${day}`;
}
