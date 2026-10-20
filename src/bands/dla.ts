// The `.ts` extensions are required: scripts/bands.mjs imports this into plain Node. See index.ts.
import { BACKGROUND, hexToRgb } from '../theme.ts';
import type { VectorSketch } from './types.ts';
import { rng, simplify, toPathData, type Point } from './vector.ts';

/**
 * Diffusion-limited aggregation, for "Agent Fieldnotes for Persistent Context".
 *
 * A walker wanders at random until it touches the cluster, then sticks. Its path is thrown away;
 * only where it landed survives, and everything after it grows from there. That is the post's
 * split: a session's context goes when it ends or compacts, what got written down stays, and each
 * new note attaches to what was already there.
 *
 * Two forests, one grown up from the bottom edge and one down from the top, interlocking in the
 * middle. The lattice wraps in x, so the Band tiles.
 */
export const PARAMS = {
	GW: 1146, // lattice columns; fixed so the picture is the same at any render size
	GH: 80, // lattice rows
	// Trees, rooted at jittered even spacing along the ground. With the whole ground sticky the
	// tallest shoots caught every walker (DLA's screening effect) and the strip came out as grass;
	// separate roots grow separate trees instead. Per forest.
	ROOTS: 20,
	// Stop once the median tree's top reaches this fraction of the height. The median, so one
	// runaway tree cannot end the run for the rest.
	CAP: 0.9,
	// Walkers launch in this top fraction of the space below the cluster's top. At 0 (all from
	// above) one tree caught nearly every walker and the rest stayed stubs; at 1 (anywhere) the
	// trees filled in to a flat hedge and lost their branching. Chosen by eye at 0, .25, .45, 1.
	LAUNCH_BAND: 0.25,
	MAX: 60000, // particle ceiling, so a pathological seed still terminates
	JITTER: 0.35 // off-lattice nudge per point, in cells, so branches don't read as a grid
};

/** One stuck particle. `parent` is -1 for a root. `tree` is the index of the root it grew from. */
export type Node = { x: number; y: number; parent: number; tree: number };

/** Runs the aggregation. `y` counts up from the ground row 0. Parents always precede children. */
export function grow(GW: number, GH: number, rnd: () => number, p = PARAMS): Node[] {
	const owner = new Int32Array(GW * GH).fill(-1);
	const nodes: Node[] = [];
	const wrap = (x: number) => ((x % GW) + GW) % GW;
	const treeTop = new Int32Array(p.ROOTS);
	const median = () => Int32Array.from(treeTop).sort()[p.ROOTS >> 1];
	let height = 0;

	const stick = (x: number, y: number, parent: number, tree: number) => {
		owner[y * GW + x] = nodes.length;
		nodes.push({ x, y, parent, tree });
		height = Math.max(height, y);
		treeTop[tree] = Math.max(treeTop[tree], y);
	};
	const offset = rnd() * GW;
	for (let t = 0; t < p.ROOTS; t++) {
		stick(wrap(Math.floor(offset + ((t + 0.5 + (rnd() - 0.5) * 0.6) * GW) / p.ROOTS)), 0, -1, t);
	}

	// The first occupied 8-neighbour, or -1.
	const touching = (x: number, y: number) => {
		for (let dy = -1; dy <= 1; dy++) {
			const ny = y + dy;
			if (ny < 0 || ny >= GH) continue;
			for (let dx = -1; dx <= 1; dx++) {
				const o = owner[ny * GW + wrap(x + dx)];
				if (o >= 0) return o;
			}
		}
		return -1;
	};

	// Also stop the moment any tree nears the top: past that, walkers launch at its tip and creep
	// along the ceiling, which drew a solid line across the Band and ran to MAX particles.
	while (nodes.length < p.MAX && height < GH - 4 && (nodes.length % 256 || median() < GH * p.CAP)) {
		// Launched in a band below the cluster's top (see LAUNCH_BAND). A launch cell already
		// touching the cluster is redrawn, so nothing sticks without having wandered.
		const launch = Math.min(GH - 1, height + 4);
		let x: number, y: number;
		do {
			x = Math.floor(rnd() * GW);
			y = launch - Math.floor(rnd() * (p.LAUNCH_BAND * launch + 1));
		} while (owner[y * GW + x] >= 0 || touching(x, y) >= 0);
		for (;;) {
			const parent = touching(x, y);
			if (parent >= 0) {
				stick(x, y, parent, nodes[parent].tree);
				break;
			}
			const r = rnd();
			if (r < 0.25) x = wrap(x + 1);
			else if (r < 0.5) x = wrap(x - 1);
			else if (r < 0.75) y = y + 1;
			else y = Math.max(0, y - 1); // the ground reflects
			if (y > launch + 8 || y >= GH) y = launch; // too far above: drop it back
		}
	}
	return nodes;
}

const STROKE_WIDTH = 1.4;
const FAINT = [232, 233, 236];
const BUCKETS = 8; // colour steps; one <path> each keeps the file small
// Twigs with fewer particles than this are dropped. At 1 the tips read as hair.
const PRUNE = 3;
// Each forest's share of the height. Over half, so the two interlock rather than meet at a line.
const REACH = 0.7;
// Douglas-Peucker tolerance after smoothing, in Band units. Smoothing quadruples the points; this
// takes most back out without a visible change.
const SIMPLIFY_TOL = 0.6;

/** Chaikin corner-cutting, endpoints kept: turns lattice staircases into curves. */
function smooth(line: Point[], passes = 2): Point[] {
	for (let k = 0; k < passes && line.length > 2; k++) {
		const out: Point[] = [line[0]];
		for (let i = 0; i < line.length - 1; i++) {
			const [ax, ay] = line[i];
			const [bx, by] = line[i + 1];
			out.push([0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by]);
			out.push([0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by]);
		}
		out.push(line[line.length - 1]);
		line = out;
	}
	return line;
}

/**
 * One forest as branches: each runs from where it forked along its heaviest child, so a trunk is
 * one line rather than hundreds of segments. Returns each branch with the size of what hangs off
 * its first particle, which sets its colour.
 */
function branches(nodes: Node[], pts: Point[], W: number): { line: Point[]; size: number }[] {
	// How much grew from each particle. Children always follow their parent, so one backward pass.
	const size = new Float64Array(nodes.length).fill(1);
	for (let i = nodes.length - 1; i >= 0; i--)
		if (nodes[i].parent >= 0) size[nodes[i].parent] += size[i];
	const best = new Int32Array(nodes.length).fill(-1);
	for (let i = 0; i < nodes.length; i++) {
		const p = nodes[i].parent;
		if (p >= 0 && size[i] >= PRUNE && (best[p] < 0 || size[i] > size[best[p]])) best[p] = i;
	}
	const out: { line: Point[]; size: number }[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const p = nodes[i].parent;
		if (size[i] < PRUNE || (p >= 0 && best[p] === i)) continue; // pruned, or continues a branch
		const line: Point[] = [];
		let x0 = p >= 0 ? pts[p][0] : pts[i][0];
		if (p >= 0) line.push(pts[p]);
		for (let j = i; j >= 0; j = best[j]) {
			// Unwrapped across the seam, so a branch that crosses it stays one continuous line.
			let x = pts[j][0];
			while (x - x0 > W / 2) x -= W;
			while (x0 - x > W / 2) x += W;
			line.push([x, pts[j][1]]);
			x0 = x;
		}
		out.push({ line: simplify(smooth(line), SIMPLIFY_TOL), size: size[i] });
	}
	return out;
}

export const geometry: VectorSketch = ({ width: W, height: H, seed, accent }) => {
	const { GW, GH, JITTER } = PARAMS;
	const rnd = rng(seed);
	const rows = Math.round(GH * REACH);
	const cx = W / GW;
	const cy = H / GH;

	// Two forests, one grown up from the bottom edge and one down from the top.
	const all = [false, true].flatMap((fromTop) => {
		const nodes = grow(GW, rows, rnd);
		const pts: Point[] = nodes.map((n) => {
			const y = (n.y + 0.5 + (rnd() - 0.5) * 2 * JITTER) * cy;
			return [(n.x + (rnd() - 0.5) * 2 * JITTER) * cx, fromTop ? y : H - y];
		});
		return branches(nodes, pts, W);
	});

	// Trunks — what most later growth hangs from — take the accent; fresh twigs stay off-white.
	const most = Math.log(Math.max(...all.map((b) => b.size)));
	const subpaths: string[][] = Array.from({ length: BUCKETS }, () => []);
	for (const { line, size } of all) {
		const b = Math.min(BUCKETS - 1, Math.floor((Math.log(size) / most) * BUCKETS));
		const lo = Math.min(...line.map((q) => q[0]));
		const hi = Math.max(...line.map((q) => q[0]));
		// The Band tiles, so a branch past either edge is drawn again on the other side.
		for (const shift of [0, ...(lo < 0 ? [W] : []), ...(hi > W ? [-W] : [])])
			subpaths[b].push(toPathData(line.map(([x, y]) => [x + shift, y])));
	}

	const [ar, ag, ab] = hexToRgb(accent);
	return {
		width: W,
		height: H,
		background: BACKGROUND,
		strokeWidth: STROKE_WIDTH,
		paths: subpaths.flatMap((d, b) => {
			if (!d.length) return [];
			const t = b / (BUCKETS - 1);
			const mix = (from: number, to: number) => Math.round(from + (to - from) * t);
			return [
				{
					d: d.join(''),
					stroke: `rgb(${mix(FAINT[0], ar)},${mix(FAINT[1], ag)},${mix(FAINT[2], ab)})`,
					opacity: 0.55 + 0.4 * t
				}
			];
		})
	};
};
