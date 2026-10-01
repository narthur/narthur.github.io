/** A p5 instance. p5 ships no types and isn't an npm dependency here — it's a CDN global. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type P5 = any;

export type SketchArgs = {
	/**
	 * Canvas size in DEVICE pixels. The harness resets the canvas transform to identity, so this
	 * is the only coordinate space a Sketch ever works in: drawing primitives and direct
	 * putImageData writes land on the same grid. Scale stroke weights and mark sizes by `density`
	 * if you want them to look the same on a 1x and a 2x screen.
	 */
	width: number;
	height: number;
	/** Device pixels per CSS pixel. Already applied to `width`/`height`. */
	density: number;
	/** Fixes the arrangement. The harness has already seeded p5's random() and noise() with it. */
	seed: number;
};

/** Draws one Band. Return a promise if it needs more than one frame to settle. */
export type Sketch = (p: P5, args: SketchArgs) => void | Promise<void>;
