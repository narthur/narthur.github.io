// The `.ts` extensions are load-bearing. scripts/bands.mjs imports this registry into plain Node to
// decide which track a Sketch takes, and Node's resolver does not follow the extensionless
// specifiers TypeScript allows. Dropping one typechecks and builds, and breaks only the build-time
// renderer — which is to say every Band — with a module-not-found at the very end of `pnpm build`.
import type { Sketch, VectorSketch } from './types.ts';
import { geometry as hopfield } from './hopfield.ts';
import trails from './trails.ts';

/**
 * Every Sketch, by the name a post's `band.sketch` frontmatter uses.
 *
 * One Sketch per post, written for that post rather than configured from a shared template — so
 * this grows by one entry each time a post opts in, and entries are not meant to be reused unless
 * a later post genuinely wants the same idea.
 *
 * Two kinds, and a name belongs to exactly one of them. A raster Sketch draws pixels with p5 and
 * so needs a browser to render, which is what `docs/adr/0001` pays Chromium for. A vector Sketch
 * returns geometry, runs in plain Node, and ships as SVG — which is the only way a contour a pixel
 * wide survives to the reader, since resizing and encoding a raster erases it.
 *
 * Consumers pick the track by asking which map holds the name, so there is no flag to keep in
 * sync. The maps are two plain objects, though, so nothing in the type system stops a name being
 * added to both — every consumer checks `vectors` first, which makes the resolution consistent but
 * leaves the raster entry silently dead. `index.spec.ts` asserts the two key sets are disjoint, so
 * that is a failing test rather than a Band nobody can explain.
 */
export const sketches: Record<string, Sketch> = { trails };

export const vectors: Record<string, VectorSketch> = { hopfield };

/** A resolved Sketch: which track it is on, and the thing that draws it. */
export type Resolved = { track: 'vector'; draw: VectorSketch } | { track: 'raster'; draw: Sketch };

/**
 * Resolves a frontmatter `band.sketch` name, or null if nothing is registered under it.
 *
 * `Object.hasOwn`, not `in`, and that is the whole reason this is a function rather than a lookup
 * at each call site. `'constructor' in vectors` is TRUE — it walks the prototype chain — and
 * `vectors['constructor']` is the `Object` constructor, which is callable and truthy. A post
 * written with `sketch: constructor`, `toString` or `valueOf` would therefore pass every
 * registered-name check in the codebase and then fail somewhere further on, with the confusing
 * error the name check exists to replace.
 *
 * Vector wins a tie, which is the documented rule rather than an accident of ordering — though
 * `index.spec.ts` asserts no tie exists.
 */
export function resolveSketch(name: string): Resolved | null {
	if (Object.hasOwn(vectors, name)) return { track: 'vector', draw: vectors[name] };
	if (Object.hasOwn(sketches, name)) return { track: 'raster', draw: sketches[name] };
	return null;
}

/** Every registered name, for an error message that tells you what you could have written. */
export function sketchNames(): string[] {
	return [...Object.keys(vectors), ...Object.keys(sketches)].sort();
}

/**
 * The file extension a rendered Band gets, which the post page needs in order to link it.
 *
 * Defaults to webp for an unregistered name, and the page's render DOES reach that default — the
 * build is `astro build && node scripts/bands.mjs`, so every page is written to dist, complete
 * with a dangling `band.webp` link, before `bandedPosts` ever looks at the name. What stops it
 * reaching a reader is that `bandedPosts` then throws and fails the whole command, so the deploy
 * step never runs and that dist is discarded. A weaker guarantee than unreachable code, and worth
 * stating as the one it is.
 */
export function bandExtension(sketch: string): 'svg' | 'webp' {
	return resolveSketch(sketch)?.track === 'vector' ? 'svg' : 'webp';
}

export type { Sketch, SketchArgs, P5, VectorSketch, BandGeometry, BandPath } from './types.ts';
