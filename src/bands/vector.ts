import type { BandGeometry } from './types';

/**
 * Turning a scalar field into SVG: trace an iso-contour, join the pieces, drop the points that
 * carry no shape, serialise.
 *
 * A Band drawn this way ships as geometry instead of pixels, which is what `docs/adr/0001` calls
 * the vector track. The reason is not file size, though it is smaller — it is that a contour one
 * pixel wide cannot survive a raster pipeline. The shipped WebP was rendered at 2x and resized
 * down, which halved the line's width to below a pixel and so halved its amplitude, and then WebP
 * q70 treated what was left as noise: the median lit pixel came out at 5/255 against the 158 the
 * Sketch drew. A path has no such problem — the browser antialiases it at the device's real
 * resolution, at any DPI, with nothing resampled and nothing quantised.
 */

export type Point = [number, number];

/** A field sampled in render-pixel coordinates. */
export type Field = (x: number, y: number) => number;

/**
 * Marching squares: every place `field` crosses `level`, as unordered segments.
 *
 * Sampled on its own grid rather than on the field's underlying lattice, because the field between
 * lattice cells is not a straight line — `hopfield` smoothsteps it, deliberately, so that contours
 * curve instead of turning a right angle at every cell boundary. Sampling one point per cell would
 * throw that away and reintroduce the staircase.
 *
 * `nx` and `ny` are sample counts across the full width and height. The grid includes both edges,
 * so x runs 0..width inclusive: for a field that wraps in x, the first and last columns hold the
 * same value and the contour meets itself across the seam.
 */
export function contour(
	field: Field,
	width: number,
	height: number,
	nx: number,
	ny: number,
	level = 0.5
): Point[][] {
	const sx = width / nx;
	const sy = height / ny;
	const f = new Float64Array((nx + 1) * (ny + 1));
	for (let j = 0; j <= ny; j++) {
		for (let i = 0; i <= nx; i++) f[j * (nx + 1) + i] = field(i * sx, j * sy);
	}

	const segs: Point[][] = [];
	// Where along an edge the crossing sits. The guard is for a flat edge, which cannot be crossed
	// at all — it is only reachable through floating-point equality, and any value in range is as
	// wrong as any other, so it returns the midpoint rather than a division by zero.
	const cut = (a: number, b: number) => (a === b ? 0.5 : (level - a) / (b - a));

	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const tl = f[j * (nx + 1) + i];
			const tr = f[j * (nx + 1) + i + 1];
			const bl = f[(j + 1) * (nx + 1) + i];
			const br = f[(j + 1) * (nx + 1) + i + 1];
			// Corners above the level, clockwise from top-left. 0 and 15 are wholly in or wholly out.
			const key =
				(tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
			if (key === 0 || key === 15) continue;

			const x0 = i * sx;
			const y0 = j * sy;
			const T: Point = [x0 + cut(tl, tr) * sx, y0];
			const B: Point = [x0 + cut(bl, br) * sx, y0 + sy];
			const L: Point = [x0, y0 + cut(tl, bl) * sy];
			const R: Point = [x0 + sx, y0 + cut(tr, br) * sy];

			// Cases pair up as k and 15-k: the same crossing with inside and outside swapped, which is
			// the same segment. The two saddles (5, 10) have two crossings and are split arbitrarily —
			// resolving them by the cell's mean would be correct, but at this sample density the two
			// readings differ by less than the line is wide.
			if (key === 1 || key === 14) segs.push([L, B]);
			else if (key === 2 || key === 13) segs.push([B, R]);
			else if (key === 3 || key === 12) segs.push([L, R]);
			else if (key === 4 || key === 11) segs.push([T, R]);
			else if (key === 6 || key === 9) segs.push([T, B]);
			else if (key === 7 || key === 8) segs.push([L, T]);
			else if (key === 5) segs.push([L, T], [B, R]);
			else segs.push([T, R], [L, B]);
		}
	}
	return segs;
}

/**
 * Joins segments end-to-end into polylines.
 *
 * Worth doing for its own sake: 2,600 loose segments serialise as 2,600 `M`-commands and 5,200
 * coordinate pairs, where the same contour as ~76 joined polylines is 2,676 pairs and compresses
 * far better. It is also what makes `simplify` possible at all, since a two-point segment has no
 * interior point to drop.
 *
 * Endpoints are matched by their rounded coordinates. Marching squares emits each shared crossing
 * from both neighbouring cells by the same arithmetic on the same two corner values, so the two
 * are bit-identical in practice; rounding is belt-and-braces against a field that returns a
 * different value for the same point on two calls.
 */
export function chain(segs: Point[][]): Point[][] {
	const key = (p: Point) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
	const at = new Map<string, Point[][]>();
	for (const s of segs) {
		for (const p of s) {
			const k = key(p);
			const bucket = at.get(k);
			if (bucket) bucket.push(s);
			else at.set(k, [s]);
		}
	}

	const used = new Set<Point[]>();
	const lines: Point[][] = [];
	for (const seed of segs) {
		if (used.has(seed)) continue;
		used.add(seed);
		const line = [seed[0], seed[1]];
		// Grow from the tail, then from the head, so an open contour is walked to both of its ends
		// rather than stopping at whichever one the starting segment happened to face.
		for (const fromHead of [false, true]) {
			for (;;) {
				const tip = fromHead ? line[0] : line[line.length - 1];
				const next = at.get(key(tip))?.find((c) => !used.has(c));
				if (!next) break;
				used.add(next);
				const far = key(next[0]) === key(tip) ? next[1] : next[0];
				if (fromHead) line.unshift(far);
				else line.push(far);
			}
		}
		lines.push(line);
	}
	return lines;
}

/**
 * Douglas-Peucker: drops every point that sits within `tol` pixels of the line it would otherwise
 * interpolate.
 *
 * At 0.5px — half the stroke width — this removes about 40% of the points with nothing visible
 * lost, because a deviation smaller than the line is wide cannot be seen. Iterative rather than
 * recursive: a contour that runs the full width of the band is a few thousand points, and the
 * recursive form is depth-unbounded on exactly the long smooth runs this is for.
 */
export function simplify(points: Point[], tol: number): Point[] {
	if (points.length < 3 || tol <= 0) return points;

	const sqDist = (p: Point, a: Point, b: Point) => {
		const vx = b[0] - a[0];
		const vy = b[1] - a[1];
		const len = vx * vx + vy * vy;
		// A degenerate span (a closed contour's two ends coincide) has no direction to project onto,
		// so fall back to distance from the point itself.
		const t = len ? Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / len)) : 0;
		const dx = p[0] - (a[0] + t * vx);
		const dy = p[1] - (a[1] + t * vy);
		return dx * dx + dy * dy;
	};

	const keep = new Uint8Array(points.length);
	keep[0] = keep[points.length - 1] = 1;
	const stack: [number, number][] = [[0, points.length - 1]];
	while (stack.length) {
		const [a, b] = stack.pop()!;
		let worst = -1;
		let at = -1;
		for (let i = a + 1; i < b; i++) {
			const d = sqDist(points[i], points[a], points[b]);
			if (d > worst) {
				worst = d;
				at = i;
			}
		}
		if (worst > tol * tol) {
			keep[at] = 1;
			stack.push([a, at], [at, b]);
		}
	}
	return points.filter((_, i) => keep[i]);
}

/**
 * One decimal place, with the trailing `.0` dropped.
 *
 * The band is rendered at its natural size and scaled by CSS, so a tenth of a pixel is already
 * finer than anything that can be seen; full float precision would roughly double the file for no
 * visible difference.
 */
export function num(n: number): string {
	return (Math.round(n * 10) / 10).toString();
}

/** A polyline as an SVG path `d`. */
export function toPathData(points: Point[]): string {
	return `M${points.map((p) => `${num(p[0])} ${num(p[1])}`).join('L')}`;
}

/**
 * Serialises geometry to a standalone SVG document.
 *
 * `shape-rendering="geometricPrecision"` because the default, `auto`, lets a browser disable
 * antialiasing on thin strokes — which would reintroduce exactly the hard-edged line this track
 * exists to avoid. The background is painted as a `rect` rather than left to the page so the file
 * is self-contained and can be opened on its own to judge it.
 */
export function toSvg(g: BandGeometry): string {
	const body = g.paths
		.map(
			(p) =>
				`<path d="${p.d}" stroke="${p.stroke}"${p.opacity < 1 ? ` stroke-opacity="${p.opacity.toFixed(2)}"` : ''}/>`
		)
		.join('');
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" width="${g.width}" height="${g.height}" ` +
		`viewBox="0 0 ${g.width} ${g.height}" shape-rendering="geometricPrecision">` +
		`<rect width="${g.width}" height="${g.height}" fill="${g.background}"/>` +
		`<g fill="none" stroke-width="${g.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">` +
		`${body}</g></svg>`
	);
}

/** mulberry32. Deterministic, which is what lets a Band be cached on its Sketch and Seed. */
export function rng(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
