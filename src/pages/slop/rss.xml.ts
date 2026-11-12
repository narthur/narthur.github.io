import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { DISCLOSURE, SLOP_FEED, publishedSlop } from '../../slop';

// Its own feed, separate from /rss.xml: the rss-to-email Worker reads only that one, so nothing
// here is ever emailed to newsletter subscribers.
export async function GET(context: APIContext) {
	const site = context.site!;
	const posts = await publishedSlop();
	return rss({
		title: SLOP_FEED.title,
		description: 'One useful link, tool, or technique at a time. AI-written, human-reviewed.',
		site,
		trailingSlash: false,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			link: `/slop/${post.id}`,
			content:
				`<p><em>${DISCLOSURE} <a href="${site.origin}/slop/about">About Slop</a></em></p>` +
				(post.rendered?.html.replace(/(src|href)="\/(?!\/)/g, `$1="${site.origin}/`) ?? '')
		}))
	});
}
