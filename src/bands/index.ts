import type { Sketch } from './types';
import hopfield from './hopfield';
import trails from './trails';

/**
 * Every Sketch, by the name a post's `band.sketch` frontmatter uses.
 *
 * One Sketch per post, written for that post rather than configured from a shared template — so
 * this grows by one entry each time a post opts in, and entries are not meant to be reused unless
 * a later post genuinely wants the same idea.
 */
export const sketches: Record<string, Sketch> = { hopfield, trails };

export type { Sketch, SketchArgs, P5 } from './types';
