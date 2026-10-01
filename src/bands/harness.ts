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

	// Draws run one at a time, and a draw already superseded when its turn comes does nothing. A
	// draw that has started is not cancellable — it finishes, it just doesn't report ready.
	//
	// A Sketch may be async and span frames (types.ts says so), so a resize or a reseed can arrive
	// while one is still settling. Guarding only the tail is not enough: the superseded draw would
	// resume after its own yield and keep painting onto the canvas the newer one had already
	// cleared, leaving a blend of two seeds that still reported ready. Serialising means no two
	// draws ever hold the canvas at once; the generation check means a draw that was superseded
	// while it waited its turn skips the work entirely rather than rendering a frame nobody wants.
	let generation = 0;
	let queue: Promise<void> = Promise.resolve();

	new window.p5((p: P5) => {
		const request = () => {
			const mine = ++generation;
			window.__bandReady = false;
			queue = queue.then(async () => {
				if (mine !== generation) return; // a newer request is waiting; let it draw instead

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

				if (mine !== generation) return; // superseded; the newer draw will set the flag
				opts.onRender?.(seed);
				window.__bandReady = true;
			});
			// The catch is what keeps the chain alive. `queue` is the chain, so a rejection left
			// unhandled makes every later `.then` a no-op: one throwing draw would brick the Band
			// until reload, each subsequent reseed adding an unhandled rejection and nothing else.
			// Recording it on `__bandError` also gives a draw failure the same channel an unknown
			// sketch name already uses, so the renderer reports it instead of timing out blind.
			queue = queue.catch((e) => {
				window.__bandError = String(e);
			});
		};

		p.setup = () => {
			p.createCanvas(opts.width ?? document.documentElement.clientWidth, opts.height).parent(
				opts.host
			);
			p.noLoop();
			redraw = (next?: number) => {
				if (next !== undefined) seed = next;
				request();
			};
			// One draw either way: a render queued before setup supplies the seed for it rather than
			// running a second simulation straight over the first.
			const queued = pending;
			pending = null;
			redraw(queued?.seed);
		};

		// Only the live page resizes; the renderer pins a width and never does.
		let settle: number;
		p.windowResized = () => {
			if (opts.width !== undefined) return;
			clearTimeout(settle);
			settle = window.setTimeout(request, 150);
		};
	});

	return {
		render: (next?: number) => {
			if (redraw) redraw(next);
			else pending = { seed: next };
		}
	};
}
