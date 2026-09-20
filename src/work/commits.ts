// Commit counts for a project's detail page, captured from local clones by
// `pnpm project-stats` and committed as src/work/commits/<project>.json. No names or emails
// are kept: each month is just [mine, everyone else's].

/** Repository → month (YYYY-MM) → [my commits, everyone else's]. */
export type Commits = Record<string, Record<string, [number, number]>>;

const BOT = /\[bot\]|renovate/i;

/**
 * Tallies one repository's `git log --format='%an|%ad' --date=format:%Y-%m` output. Commits
 * whose author name starts with `me` count as mine, so suffixed names such as
 * "Nathan Arthur (aider)" do too; bots are dropped.
 */
export function tally(log: string, me: string): Record<string, [number, number]> {
	const months: Record<string, [number, number]> = {};
	for (const line of log.split('\n')) {
		const at = line.lastIndexOf('|');
		if (at < 0) continue;
		const author = line.slice(0, at);
		if (BOT.test(author)) continue;
		const month = line.slice(at + 1);
		months[month] ??= [0, 0];
		months[month][author.startsWith(me) ? 0 : 1]++;
	}
	return months;
}

/** Every month from January of `first` to December of `last`, as YYYY-MM. */
export const monthsBetween = (first: number, last: number) =>
	Array.from(
		{ length: (last - first + 1) * 12 },
		(_, i) => `${first + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`
	);

/** Per month, my commits and everyone else's, summed over `repos` (all of them by default). */
export function perMonth(commits: Commits, months: string[], repos = Object.keys(commits)) {
	const sum = (who: 0 | 1) =>
		months.map((month) => repos.reduce((n, repo) => n + (commits[repo]?.[month]?.[who] ?? 0), 0));
	return { mine: sum(0), others: sum(1) };
}

/** All-time totals over `repos`, plus the first and last month I committed to any of them. */
export function totals(commits: Commits, repos: string[]) {
	let mine = 0;
	let others = 0;
	const myMonths: string[] = [];
	for (const repo of repos) {
		const months = commits[repo];
		if (!months) throw new Error(`No commit data for repository "${repo}"`);
		for (const [month, [m, o]] of Object.entries(months)) {
			mine += m;
			others += o;
			if (m > 0) myMonths.push(month);
		}
	}
	myMonths.sort();
	return { mine, others, first: myMonths[0], last: myMonths[myMonths.length - 1] };
}
