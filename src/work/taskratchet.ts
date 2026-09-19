// TaskRatchet's public aggregate counters, the same ones taskratchet.com shows. The API caches
// them for six hours and allows any origin, so the page fetches them at build time and again in
// the browser.
const URL = 'https://api.taskratchet.com/api2/stats';

export interface Stats {
	totalTasks: number;
	activeStakes: number;
	percentageCompletion: number;
}

export async function fetchStats(): Promise<Stats | undefined> {
	try {
		const response = await fetch(URL, { signal: AbortSignal.timeout(5000) });
		return response.ok ? await response.json() : undefined;
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
