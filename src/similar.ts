// Recommended posts: each post's three nearest neighbours by the meaning of its text, from a small
// embedding model run inside the build. No API and no key, so CI and deploy embed whatever posts
// exist and a new post is recommended, and gets its own, on its first deploy.
import { env, pipeline } from '@huggingface/transformers';

env.cacheDir = 'node_modules/.cache/transformers';

const MODEL = 'Xenova/all-MiniLM-L6-v2';
// Pinned so an upstream re-upload can't reshuffle every post's recommendations unannounced.
const REVISION = '751bff37182d3f1213fa05d7196b954e230abad9';
// The model reads 256 tokens at most and drops the rest, so a post is cut into passages this many
// words long and each is embedded on its own; otherwise only a post's opening would count.
const CHUNK_WORDS = 150;
// Two posts score as the mean of their this-many best-matching passage pairs. Many posts are
// digests of unrelated sections, and averaging a whole post blurs those into one vague topic:
// "Are LLMs Conscious?" is half dev tooling, and its follow-up ranked 21st of 73 that way; it
// ranks 1st this way. Measured on five known related pairs, 2026-11-13.
const BEST_PAIRS = 3;

/** A post's prose as plain words: image syntax dropped, links reduced to their text. */
export function chunks(markdown: string): string[] {
	const words = markdown
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.split(/\s+/)
		.filter(Boolean);
	const out: string[] = [];
	for (let i = 0; i < words.length; i += CHUNK_WORDS)
		out.push(words.slice(i, i + CHUNK_WORDS).join(' '));
	return out;
}

const dot = (a: number[], b: number[]) => a.reduce((sum, x, i) => sum + x * b[i], 0);

// Keyed by the text itself, so `pnpm dev` re-embeds only a post that was edited, not all of them
// on every page load.
const memo = new Map<string, Promise<number[][]>>();
let model: ReturnType<typeof pipeline<'feature-extraction'>> | undefined;

/** Per text, one unit vector per passage. */
export function embed(texts: string[]): Promise<number[][][]> {
	model ??= pipeline('feature-extraction', MODEL, { revision: REVISION, dtype: 'q8' });
	return Promise.all(
		texts.map((text) => {
			let passages = memo.get(text);
			if (!passages) {
				passages = (async () => {
					const pieces = chunks(text);
					if (!pieces.length) throw new Error(`similar: nothing to embed in "${text}"`);
					const extract = await model!;
					return (await extract(pieces, { pooling: 'mean', normalize: true })).tolist();
				})();
				memo.set(text, passages);
			}
			return passages;
		})
	);
}

/** How alike two texts' passages are: the mean of their best-matching pairs. */
export function similarity(a: number[][], b: number[][]): number {
	const best = a
		.flatMap((x) => b.map((y) => dot(x, y)))
		.sort((p, q) => q - p)
		.slice(0, BEST_PAIRS);
	return best.reduce((sum, x) => sum + x, 0) / best.length;
}

/** The indices of the `n` texts most like `texts[i]`, most alike first, never `i` itself. */
export function nearest(texts: number[][][], i: number, n: number): number[] {
	return texts
		.map((t, j) => ({ j, score: j === i ? -Infinity : similarity(texts[i], t) }))
		.sort((a, b) => b.score - a.score)
		.slice(0, n)
		.map(({ j }) => j);
}
