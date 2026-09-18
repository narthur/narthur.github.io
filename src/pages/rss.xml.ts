import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
	const site = context.site!;
	const posts = (await getCollection('posts')).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime()
	);
	return rss({
		title: 'Narthur Online',
		description:
			"Nathan Arthur's mostly-weekly newsletter: tools, things built, and running a one-person software business.",
		site,
		// Pages are /writing/<slug>, not /writing/<slug>/ (build.format 'file'). Links double as
		// guids, so this also keeps guids stable.
		trailingSlash: false,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.subtitle,
			pubDate: post.data.date,
			link: `/writing/${post.id}`,
			// Full post, so readers needn't click through. Root-relative src/href become absolute,
			// since feed readers resolve them against the feed, not the post.
			content: post.rendered?.html.replace(/(src|href)="\//g, `$1="${site.origin}/`)
		}))
	});
}
