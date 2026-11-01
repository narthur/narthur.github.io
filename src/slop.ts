import { getCollection } from 'astro:content';

// Slop posts are committed with future dates and go live one per day. A post counts as published
// once its date has passed at build time; the scheduled deploy in deploy.yml rebuilds daily at
// 12:00 UTC, so a post dated 2026-11-03 appears that day at the first rebuild.
export async function publishedSlop(now = new Date()) {
	return (await getCollection('slop', (post) => post.data.date <= now)).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime()
	);
}

export const SLOP_FEED = { title: 'Narthur Slop', href: '/slop/rss.xml' };

// Carried on every post page and at the top of every feed item, so the label travels with the
// post wherever it is read.
export const DISCLOSURE =
	'Written by AI from Nathan’s notes and reviewed by him before publishing.';
