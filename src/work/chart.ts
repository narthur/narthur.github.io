// Geometry for the /work charts. Everything here runs at build time; the page ships static
// markup with percentages baked in, so the charts stretch with the column and need no JS.

export interface Month {
	month: string; // YYYY-MM
	commits: number;
	prs: number;
	reviews: number;
}

/** A run of years, as written in work.yaml. */
export interface Span {
	start: number;
	end?: number | 'now'; // last year, inclusive; 'now' = still going; missing = the start year only
}

/** The span's last year, with an ongoing one counting as later than any real year. */
const lastYear = (s: Span) => (s.end === 'now' ? Infinity : (s.end ?? s.start));

/** How the span reads in text: "2019", "2019—2025", or "2019—now". */
export const rangeLabel = (s: Span) =>
	s.end === undefined || s.end === s.start ? String(s.start) : `${s.start}—${s.end}`;

/** Sort comparator: latest start first, and of those the one that ran longest first. */
export const newestFirst = (a: Span, b: Span) => b.start - a.start || lastYear(b) - lastYear(a);

/** Sort comparator: earliest start first, and of those the one that ran longest first. */
export const oldestFirst = (a: Span, b: Span) => a.start - b.start || lastYear(b) - lastYear(a);

/** A time axis from January of `firstYear` to the end of the month `last` (YYYY-MM). */
export function timeScale(firstYear: number, last: string) {
	const [y, m] = last.split('-').map(Number);
	const endT = y + m / 12;
	const span = endT - firstYear;
	return {
		firstYear,
		endT,
		/** Percent across the axis for a fractional year. */
		x: (t: number) => ((t - firstYear) / span) * 100
	};
}

export type TimeScale = ReturnType<typeof timeScale>;

/**
 * Gridline positions and tick labels, every two years from the first, plus `endLabel` at the
 * end: "now" for an axis that runs to the present, a year for one that closes in the past.
 * The first and last labels sit inside the axis instead of centring past its ends, and a year
 * close enough to "now" to collide with it on a phone is hidden there.
 */
export function axis(scale: TimeScale, endLabel = 'now') {
	const years = Array.from(
		{ length: Math.ceil((scale.endT - scale.firstYear) / 2) },
		(_, i) => scale.firstYear + i * 2
	);
	return {
		grid: years.map((y) => scale.x(y)),
		ticks: [
			...years.map((y) => ({
				label: String(y),
				left: scale.x(y),
				shift:
					y === scale.firstYear
						? ''
						: scale.x(y) > 90
							? 'hidden sm:inline -translate-x-1/2'
							: '-translate-x-1/2'
			})),
			{ label: endLabel, left: 100, shift: '-translate-x-full' }
		]
	};
}

/** Where a span's bar sits, as percentages of the axis. */
export function bar(span: Span, scale: TimeScale) {
	const ongoing = span.end === 'now';
	const endT = ongoing ? scale.endT : Math.min(lastYear(span) + 1, scale.endT);
	// Spans that began before the axis start at its left edge; their labels keep the real year.
	const left = scale.x(Math.max(span.start, scale.firstYear));
	return {
		left,
		width: scale.x(endT) - left,
		ongoing,
		// Began before the axis, so the bar is cut off at the left edge.
		clippedStart: span.start < scale.firstYear,
		// Where the label hangs: from the bar's start, or from the axis's right edge when it would
		// otherwise run past it. A phone column fits less, so it switches over sooner.
		// ponytail: fixed cutoffs, not measured label widths; measure if a long name still clips.
		labelAnchor: left > 80 ? 'right' : left > 50 ? 'right-on-narrow' : 'left'
	} as const;
}

/** Gaussian-smooths a series over `sigma` months, keeping its units. */
export function blur(values: number[], sigma: number): number[] {
	if (sigma <= 0) return values;
	const r = Math.ceil(sigma * 3);
	return values.map((_, i) => {
		let sum = 0;
		let weights = 0;
		for (let d = -r; d <= r; d++) {
			const j = i + d;
			if (j < 0 || j >= values.length) continue;
			const w = Math.exp(-(d * d) / (2 * sigma * sigma));
			sum += values[j] * w;
			weights += w;
		}
		return sum / weights;
	});
}

/** Gaussian-smooths a series over `sigma` months, then scales it so its peak is 1. */
export function smooth(values: number[], sigma: number): number[] {
	const out = blur(values, sigma);
	const max = Math.max(...out);
	return max > 0 ? out.map((v) => v / max) : out;
}

/**
 * An SVG path, in a 1000×100 viewBox, for a series drawn mirrored about the horizontal centre
 * line: time runs left to right and each month's value sets the shape's thickness.
 * Values are expected in 0–1, one per month, each sitting at the middle of its month.
 */
export function mirroredPath(values: number[]): string {
	const n = values.length;
	const at = (i: number) => values[Math.max(0, Math.min(n - 1, i))];
	// Catmull-Rom through the month midpoints, so the outline is a curve, not a staircase.
	const sample = (t: number) => {
		const u = t - 0.5;
		const i = Math.floor(u);
		const f = u - i;
		const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
		const v =
			0.5 *
			(2 * p1 +
				(-p0 + p2) * f +
				(2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f +
				(-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f);
		return Math.max(0, Math.min(1, v));
	};
	const steps = n * 4;
	const top: string[] = [];
	const bottom: string[] = [];
	for (let k = 0; k <= steps; k++) {
		const t = (k / steps) * n;
		const x = ((k / steps) * 1000).toFixed(1);
		const h = sample(t) * 48;
		top.push(`${x},${(50 - h).toFixed(2)}`);
		bottom.unshift(`${x},${(50 + h).toFixed(2)}`);
	}
	return `M${top.join('L')}L${bottom.join('L')}Z`;
}
