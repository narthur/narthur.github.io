import type { APIContext } from 'astro';
import { feed } from '../feed';

// Read by rss-to-email-worker, which emails each new item; not linked for feed readers. The
// worker adds the per-subscriber unsubscribe link below this footer.
export const GET = ({ site }: APIContext) =>
	feed(
		site!,
		(url) =>
			`<p><em>Know someone who'd like this? Forward it along. It's also <a href="${url}">on the web</a> and in an <a href="${site!.origin}/rss.xml">RSS feed</a>, for anyone who'd rather skip the inbox. <a href="https://ko-fi.com/narthur">Ko-fi</a> keeps these coming.</em></p>`
	);
