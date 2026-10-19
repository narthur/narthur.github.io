import type { APIContext } from 'astro';
import { feed } from '../feed';

// The public feed, for feed readers. newsletter.xml is the same feed with an email footer.
export const GET = ({ site }: APIContext) =>
	feed(
		site!,
		() =>
			`<p><em>You're reading this in a feed reader, which puts you among the web's finest: no algorithm, no inbox, just the posts you chose. Know someone who'd like this one? Send them the link. New posts also go out <a href="${site!.origin}/#subscribe-email">by email</a>, and <a href="https://ko-fi.com/narthur">Ko-fi</a> keeps them coming.</em></p>`
	);
