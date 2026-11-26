import { BACKGROUND } from '../theme.ts';
import type { VectorSketch } from './types.ts';
import { rng, toPathData, type Point } from './vector.ts';

/**
 * Wheat bent by one wind, for "Happy Thanksgiving!". Stalks lean by a sum of sines with whole
 * cycles across the Band, and each one is also drawn a Band-width either side, so it tiles.
 */
export const geometry: VectorSketch = ({ width: W, height: H, seed, accent }) => {
	const k = H / 240;
	const rnd = rng(seed);
	const terms = [1, 2, 3].map((i) => ({
		cycles: i * 2 + Math.floor(rnd() * 3),
		amp: 34 / i,
		phase: rnd() * 2 * Math.PI
	}));
	const wind = (x: number) =>
		terms.reduce((s, t) => s + t.amp * Math.sin((t.cycles * 2 * Math.PI * x) / W + t.phase), 0);

	const n = Math.round(W / k / 13);
	const stalks: Point[][] = [];
	const grain: Point[][] = [];
	for (let i = 0; i < n; i++) {
		const base = ((i + (rnd() - 0.5) * 0.7) * W) / n;
		const h = (120 + rnd() * 100) * k;
		const lean = (wind(base) + (rnd() - 0.5) * 14) * k;
		const at = (t: number): Point => [base + lean * t * t, H + 2 - h * t];
		for (const dx of [-W, 0, W]) {
			if (base + dx < -80 * k || base + dx > W + 80 * k) continue;
			const shift = ([x, y]: Point): Point => [x + dx, y];
			stalks.push(Array.from({ length: 11 }, (_, s) => shift(at(s / 10))));
			// Grain: paired barbs up the last quarter of the stalk, splayed ±0.5 rad either
			// side of the stalk's heading toward its tip.
			for (let g = 0; g < 7; g++) {
				const t = 0.76 + g * 0.035;
				const [x, y] = at(t);
				const [x2, y2] = at(t + 0.01);
				const len = Math.hypot(x2 - x, y2 - y);
				const ux = (x2 - x) / len;
				const uy = (y2 - y) / len;
				for (const side of [-1, 1]) {
					const a = side * 0.5;
					const bx = ux * Math.cos(a) - uy * Math.sin(a);
					const by = ux * Math.sin(a) + uy * Math.cos(a);
					grain.push([shift([x, y]), shift([x + bx * 9 * k, y + by * 9 * k])]);
				}
			}
		}
	}
	return {
		width: W,
		height: H,
		background: BACKGROUND,
		strokeWidth: 1.4,
		paths: [
			{ d: stalks.map(toPathData).join(''), stroke: accent, opacity: 0.45 },
			{ d: grain.map(toPathData).join(''), stroke: accent, opacity: 0.95 }
		]
	};
};
