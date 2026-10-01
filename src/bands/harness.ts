import type { P5, Sketch } from './types';

/**
 * Owns everything a Band needs that isn't the drawing: the p5 instance, canvas sizing, device
 * pixels, seeding, and the signal that says the canvas is ready to capture.
 *
 * This exists because those four are identical in every Sketch and each has already been got
 * wrong once — a CSS-sized putImageData that filled a quarter of a retina canvas, and a lookup
 * that ran before the element it wanted existed. None of that was about ants.
 */

declare global {
	interface Window {
		p5: P5;
		/** Set once a render settles. The build-time renderer waits on this before capturing. */
		__bandReady?: boolean;
		/** Set when a Band cannot be drawn at all, so the renderer fails instead of shipping a blank. */
		__bandError?: string;
	}
}

export type MountOptions = {
	host: HTMLElement;
	/** Band height in CSS pixels. */
	height: number;
	seed: number;
	/** Overrides the viewport width. The build-time renderer pins this; the page leaves it out. */
	width?: number;
	/** Called after every render with the seed used, so the dev picker can display it. */
	onRender?: (seed: number) => void;
};

export type MountedBand = {
	/** Redraw, optionally with a new seed. */
	render: (seed?: number) => void;
};

export function mountBand(sketch: Sketch, opts: MountOptions): MountedBand {
	let seed = opts.seed;
	let redraw: ((next?: number) => void) | null = null;
	// A render asked for before p5's setup has run. Queued rather than dropped: `render()` returning
	// silently would be indistinguishable from "nothing to redraw", and this Harness exists because
	// ordering bugs here have already cost us twice.
	let pending: { seed?: number } | null = null;
	// Only the newest draw may claim the canvas or set the ready flag. A Sketch is allowed to be
	// async (see types.ts), so a resize or a reseed can start a second draw while the first is still
	// settling; without this the slower one wins and still reports ready.
	let generation = 0;

	new window.p5((p: P5) => {
		const draw = async () => {
			const mine = ++generation;
			window.__bandReady = false;

			// clientWidth on the root element, not 100vw: vw includes the scrollbar, so a vw-wide
			// band on a scrolling page overflows by its width and adds a horizontal scrollbar.
			const cssWidth = opts.width ?? document.documentElement.clientWidth;
			if (!cssWidth) return;

			p.resizeCanvas(cssWidth, opts.height);
			const density = p.pixelDensity();

			// Identity transform, so the Sketch works in device pixels throughout. p5 would
			// otherwise scale drawing commands by the density while putImageData — which writes
			// straight to the backing store — ignored it, and the two would disagree.
			p.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
			p.clear();

			p.randomSeed(seed);
			p.noiseSeed(seed);

			await sketch(p, {
				width: Math.round(cssWidth * density),
				height: Math.round(opts.height * density),
				density,
				seed
			});

			if (mine !== generation) return; // superseded mid-flight; let the newer draw finish
			opts.onRender?.(seed);
			window.__bandReady = true;
		};

		p.setup = () => {
			p.createCanvas(opts.width ?? document.documentElement.clientWidth, opts.height).parent(
				opts.host
			);
			p.noLoop();
			redraw = (next?: number) => {
				if (next !== undefined) seed = next;
				void draw();
			};
			void draw();
			if (pending) {
				const queued = pending;
				pending = null;
				redraw(queued.seed);
			}
		};

		// Only the live page resizes; the renderer pins a width and never does.
		let settle: number;
		p.windowResized = () => {
			if (opts.width !== undefined) return;
			clearTimeout(settle);
			settle = window.setTimeout(() => void draw(), 150);
		};
	});

	return {
		render: (next?: number) => {
			if (redraw) redraw(next);
			else pending = { seed: next };
		}
	};
}
