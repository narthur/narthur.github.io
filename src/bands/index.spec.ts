import { describe, expect, it } from 'vitest';
import { bandExtension, resolveSketch, sketchNames, sketches, vectors } from './index';

describe('the Sketch registry', () => {
	it('keeps the two tracks disjoint', () => {
		// The module's own doc comment says a name belongs to exactly one track. Nothing in the type
		// system enforces that — they are two plain objects — and a name in both would resolve to
		// vector everywhere (every consumer tests `vectors` first) while leaving the raster entry
		// dead with no error anywhere. This is that guard.
		const both = Object.keys(vectors).filter((name) => name in sketches);
		expect(both).toEqual([]);
	});

	it('gives each registered Sketch the extension its renderer actually writes', () => {
		// A wrong answer here is the one failure the Band pipeline cannot make loud: the page links
		// /writing/<slug>/band.<ext>, scripts/bands.mjs writes the other extension, and the reader
		// gets a 404 with nothing in the build log. Cheap to pin, so it is pinned.
		for (const name of Object.keys(vectors)) expect(bandExtension(name)).toBe('svg');
		for (const name of Object.keys(sketches)) expect(bandExtension(name)).toBe('webp');
	});

	it('falls back to the raster extension for a name it does not know', () => {
		// Not an endorsement of the fallback — an unregistered name is a build error long before
		// this matters. It is pinned so the behaviour is a decision rather than an accident.
		expect(bandExtension('no-such-sketch')).toBe('webp');
	});

	it('does not resolve an inherited Object property as a Sketch', () => {
		// `'constructor' in vectors` is true and `vectors.constructor` is the Object constructor:
		// callable, truthy, and enough to pass a naive registered-name check. A post written with
		// `sketch: constructor` would then be "resolved" to Object and fail somewhere downstream
		// with the confusing error the name check exists to replace.
		//
		// Mutation-checked: swapping resolveSketch's `Object.hasOwn` back to `in` fails this.
		for (const inherited of ['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__']) {
			expect(resolveSketch(inherited)).toBeNull();
			expect(sketchNames()).not.toContain(inherited);
		}
	});

	it('resolves every registered name to the track that renders it', () => {
		for (const name of Object.keys(vectors)) expect(resolveSketch(name)?.track).toBe('vector');
		for (const name of Object.keys(sketches)) expect(resolveSketch(name)?.track).toBe('raster');
		expect(sketchNames().sort()).toEqual(
			[...Object.keys(vectors), ...Object.keys(sketches)].sort()
		);
	});
});
