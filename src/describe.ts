// A page's meta description: the subtitle if there is one, else the first paragraph that opens
// with a letter, a quote or a link (so a leading image, heading or list is skipped), with markdown
// stripped and cut to 160 characters. Code fences go first: a blank line inside one would
// otherwise split it into "paragraphs".
export function describe(body: string | undefined, title: string, subtitle?: string) {
	const opening =
		body
			?.replace(/```[\s\S]*?```/g, '')
			.split('\n\n')
			.find((block) => /^[\p{L}"“‘[]/u.test(block)) ?? title;
	const plain = opening.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '');
	return subtitle ?? (plain.length > 160 ? `${plain.slice(0, 157)}…` : plain);
}
