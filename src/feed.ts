import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

/** The newsletter as RSS. `footer` gets the post's absolute URL and returns HTML appended to it. */
export async function feed(site: URL, footer: (url: string) => string) {
	const posts = (await getCollection('posts')).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime()
	);
	return rss({
		title: 'Narthur Online',
		description:
			"Nathan Arthur's mostly-weekly newsletter: tools, things built, and running a one-person software business.",
		site,
		// Pages are /writing/<slug>, not /writing/<slug>/ (build.format 'file'). Links double as
		// guids, so this also keeps guids stable, and identical across both feeds.
		trailingSlash: false,
		items: posts.map((post) => {
			const link = `/writing/${post.id}`;
			// Full post, so readers needn't click through. Root-relative src/href become absolute,
			// since feed readers resolve them against the feed, not the post.
			const html = post.rendered?.html.replace(/(src|href)="\/(?!\/)/g, `$1="${site.origin}/`);
			return {
				title: post.data.title,
				description: post.data.subtitle,
				pubDate: post.data.date,
				link,
				content: `${html ?? ''}<hr>${footer(site.origin + link)}`
			};
		})
	});
}
