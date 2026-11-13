// The list of Preview images for scripts/cards.mjs to render: one per post page, with the Band it
// sits over. Built from the same collections and filters as the pages themselves, so the script
// never has to re-derive which Slop is published or which file a Band was written to. The script
// deletes this from dist once it has rendered the cards, so it never ships.
import { getCollection } from 'astro:content';
import { bandExtension } from '../bands';
import { publishedSlop } from '../slop';

export async function GET() {
	const posts = (await getCollection('posts')).map(({ id, data: { title, band } }) => ({
		path: `/writing/${id}.png`,
		title,
		kind: 'writing',
		band: band ? `/writing/${id}/band.${bandExtension(band.sketch)}` : undefined
	}));
	const slop = (await publishedSlop()).map(({ id, data: { title } }) => ({
		path: `/slop/${id}.png`,
		title,
		kind: 'slop'
	}));
	return new Response(JSON.stringify([...posts, ...slop]));
}
