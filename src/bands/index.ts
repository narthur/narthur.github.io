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
 * Consumers pick the track by asking which map holds the name, so there is no flag to keep in sync
 * and no way to register a Sketch as both.
 */
export const sketches: Record<string, Sketch> = { trails };

export const vectors: Record<string, VectorSketch> = { hopfield };

/** The file extension a rendered Band gets, which the post page needs in order to link it. */
export function bandExtension(sketch: string): 'svg' | 'webp' {
	return sketch in vectors ? 'svg' : 'webp';
}

export type { Sketch, SketchArgs, P5, VectorSketch, BandGeometry, BandPath } from './types.ts';
