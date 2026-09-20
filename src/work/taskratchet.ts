// TaskRatchet's public aggregate counters, the same ones taskratchet.com shows. The API caches
// them for six hours and allows any origin, so the page fetches them at build time and again in
// the browser.
const STATS_URL = 'https://api.taskratchet.com/api2/stats';

export interface Stats {
	totalTasks: number;
	activeStakes: number;
	percentageCompletion: number;
}

/** Whether a decoded response carries every counter, so a changed API can't break the build. */
export const isStats = (value: unknown): value is Stats =>
	typeof value === 'object' &&
	value !== null &&
	['totalTasks', 'activeStakes', 'percentageCompletion'].every(
		(key) => typeof (value as Record<string, unknown>)[key] === 'number'
	);

/** The counters, or undefined on any failure: network, timeout, status, or response shape. */
export async function fetchStats(): Promise<Stats | undefined> {
	try {
		const response = await fetch(STATS_URL, { signal: AbortSignal.timeout(5000) });
		const body: unknown = response.ok ? await response.json() : undefined;
		return isStats(body) ? body : undefined;
	} catch {
		return undefined;
	}
}

/** Display strings for each counter, keyed as the page's `data-stat` attributes are. */
export const format = (stats: Stats) => ({
	tasks: stats.totalTasks.toLocaleString('en-US'),
	stakes: `$${stats.activeStakes.toLocaleString('en-US')}`,
	completion: `${(stats.percentageCompletion * 100).toFixed(1)}%`
});
