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

/** One stroked polyline. `d` is an SVG path `d` attribute in the Band's own coordinate space. */
export type BandPath = { d: string; stroke: string; opacity: number };

/** Everything needed to write a Band as SVG, and nothing about how it was computed. */
export type BandGeometry = {
	width: number;
	height: number;
	/** Painted as a rect, so the file stands alone when opened to judge it. */
	background: string;
	strokeWidth: number;
	paths: BandPath[];
};

/**
 * A Band that ships as geometry rather than pixels.
 *
 * Takes no p5 and no canvas: it is a pure function of size and Seed, which is what lets it run in
 * plain Node with no browser at all — see `docs/adr/0001`. Coordinates are in the units of
 * `width`/`height`, and the SVG is scaled by CSS from there, so there is no device-pixel notion
 * here and nothing to multiply by a density.
 *
 * The accent is passed in rather than read off the document, for the same reason the raster track
 * reads `--accent` from the page: a Sketch that hard-codes it keeps shipping the old colour after
 * a re-theme, with no error to notice it by.
 */
export type VectorSketch = (args: {
	width: number;
	height: number;
	seed: number;
	accent: string;
}) => BandGeometry;
