import { describe, expect, it } from 'vitest';
import { chunks, nearest, similarity } from './similar';

describe('chunks', () => {
	it('drops images, keeps link text, and splits long prose', () => {
		const words = Array.from({ length: 160 }, (_, i) => `w${i}`).join(' ');
		const out = chunks(`![alt](a.png) see [the docs](https://x.y) <b>now</b> ${words}`);
		expect(out[0].startsWith('see the docs now w0')).toBe(true);
		expect(out).toHaveLength(2);
		expect(out[1].split(' ')).toHaveLength(14);
	});
});

describe('similarity', () => {
	it('scores by the best-matching passages, so one shared section counts', () => {
		const digest = [
			[1, 0],
			[0, 1]
		];
		// Matches the digest's first passage exactly and nothing else: mean of the top pairs.
		expect(similarity(digest, [[1, 0]])).toBe(0.5);
		expect(similarity([[1, 0]], [[1, 0]])).toBe(1);
	});
});

describe('nearest', () => {
	it('ranks by similarity and never returns the text itself', () => {
		const t = [[[1, 0]], [[0.9, 0.44]], [[0, 1]], [[0.6, 0.8]]];
		expect(nearest(t, 0, 2)).toEqual([1, 3]);
		expect(nearest(t, 2, 3)).toEqual([3, 1, 0]);
	});
});
