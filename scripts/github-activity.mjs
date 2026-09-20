// Writes src/work/activity.json: monthly commit, PR, review, and everything-else counts from
// GitHub, through the last complete month.
// Run with `pnpm activity`; needs the `gh` CLI logged in as narthur.
// Set ACTIVITY_REBUILD=1 to ignore the committed file's floor — see RATCHET below.
// ponytail: refreshed by hand and committed, since the deploy has no GitHub token.
// Move it into the deploy workflow if keeping it current by hand becomes a chore.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// Both accounts are charted. The 2016-2019 work went to su-narthur, a SimpleUpdates account
// whose email is long gone, so it can't be logged into; its contribution calendar is public even
// so, which is the only reason those years are counted at all.
const ME = 'narthur';
const ACCOUNTS = [ME, 'su-narthur'];
// Repositories whose commits are machine-written and shouldn't read as work. tw-todo is a
// taskwarrior-to-git sync: 4,509 commits in five months of 2019, which swamped every real thing
// done that year. They arrive inside the private remainder, which has no repository breakdown,
// so subtracting the repository's own history is the only way to take them out.
const EXCLUDE = [{ owner: 'narthur', name: 'tw-todo' }];
const FIRST_YEAR = 2014;
const now = new Date();
const CURRENT_MONTH = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

function ghToken() {
	try {
		return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw new Error('The GitHub CLI (gh) is not installed: https://cli.github.com/');
		}
		throw err; // Carries gh's own stderr, e.g. "no oauth token found" when logged out.
	}
}

const token = ghToken();

async function graphql(query) {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ query })
	});
	const json = await res.json();
	if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? json));
	return json.data;
}

const months = new Map(); // YYYY-MM → { month, commits, prs, reviews, private }
const row = (month) => {
	if (!months.has(month)) months.set(month, { month, commits: 0, prs: 0, reviews: 0, private: 0 });
	return months.get(month);
};
const totals = new Map(); // YYYY-MM → every contribution, of every kind, both accounts

// Every month from FIRST_YEAR whose end has passed. A month still in progress reads as a slump
// at the chart's end, so it waits.
function* eachMonth() {
	for (let year = FIRST_YEAR; year <= now.getUTCFullYear(); year++) {
		for (let m = 0; m < 12; m++) {
			const to = new Date(Date.UTC(year, m + 1, 1) - 1000);
			if (to > now) return;
			yield { year, m, from: new Date(Date.UTC(year, m, 1)), to };
		}
	}
}
const byYear = Object.groupBy([...eachMonth()], ({ year }) => year);
const key = (year, m) => `${year}-${String(m + 1).padStart(2, '0')}`;

// TOTAL: the contribution calendar, which counts every kind and includes private work. It is
// public for any account, which is what makes su-narthur reachable without a token for it.
for (const account of ACCOUNTS) {
	for (const year of Object.keys(byYear)) {
		const from = new Date(Date.UTC(Number(year), 0, 1));
		const to = new Date(Date.UTC(Number(year) + 1, 0, 1) - 1000);
		const data = await graphql(`{
			user(login: "${account}") {
				contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
					contributionCalendar { weeks { contributionDays { date contributionCount } } }
				}
			}
		}`);
		for (const week of data.user.contributionsCollection.contributionCalendar.weeks) {
			for (const day of week.contributionDays) {
				const month = day.date.slice(0, 7);
				if (month >= CURRENT_MONTH) continue;
				row(month); // Keep every charted month present even when nothing else touches it.
				totals.set(month, (totals.get(month) ?? 0) + day.contributionCount);
			}
		}
	}
}

// SPLIT: the kinds GitHub will name, which it does only for public repositories. Everything
// else stays in the remainder below — including public issues, which is why they aren't queried
// here: a bucket they'd have to share with private work anyway.
for (const [year, group] of Object.entries(byYear)) {
	// One request per year, one aliased collection per month.
	const fields = group.map(
		({
			m,
			from,
			to
		}) => `m${m}: contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
			totalCommitContributions totalPullRequestContributions totalPullRequestReviewContributions
		}`
	);
	const data = await graphql(`{ user(login: "${ME}") { ${fields.join('\n')} } }`);
	for (const { m } of group) {
		const c = data.user[`m${m}`];
		const month = row(key(year, m));
		month.commits += c.totalCommitContributions;
		month.prs += c.totalPullRequestContributions;
		month.reviews += c.totalPullRequestReviewContributions;
	}
}

// Commits on the default branch, which is what a contribution counts: same query shape as above,
// one aliased month per field. The two don't agree exactly — tw-todo has 4,325 commits in March
// 2019 against roughly 4,039 counted contributions, GitHub having credited only the ones authored
// by a linked email — so this comes off the month's total and the remainder floors at zero rather
// than going negative. The cost is that a month the excluded repository dominates loses whatever
// real private work shared it: February and March 2019 both floor out here.
for (const { owner, name } of EXCLUDE) {
	for (const [year, group] of Object.entries(byYear)) {
		const fields = group.map(
			({ m, from, to }) =>
				`m${m}: history(since: "${from.toISOString()}", until: "${to.toISOString()}") { totalCount }`
		);
		const data = await graphql(`{
			repository(owner: "${owner}", name: "${name}") {
				defaultBranchRef { target { ... on Commit { ${fields.join('\n')} } } }
			}
		}`);
		const history = data.repository.defaultBranchRef.target;
		for (const { m } of group) {
			const month = key(year, m);
			totals.set(month, (totals.get(month) ?? 0) - history[`m${m}`].totalCount);
		}
	}
}

// The fourth band is defined as the remainder, not fetched: whatever the calendar counted that
// the three named kinds don't account for. Private work dominates it, but it also absorbs public
// issues and new repositories, and any contribution type GitHub adds later. Defining it this way
// is what makes the four bands exhaustive — a fetched bucket would silently drop the rest.
for (const month of months.values()) {
	const total = totals.get(month.month) ?? 0;
	month.private = Math.max(0, total - month.commits - month.prs - month.reviews);
}

const out = [...months.values()].sort((a, b) => a.month.localeCompare(b.month));
const path = new URL('../src/work/activity.json', import.meta.url);

// RATCHET: the committed file is a floor, so a finished month can never fall. GitHub stops
// counting work when a repository is deleted or goes private (archiving is safe — an archived
// repository still counts), and this file is the only record once that happens. Holding the
// larger number keeps a decade of history from eroding one deleted client repository at a time.
// ACTIVITY_REBUILD=1 drops the floor, for when a field legitimately means something new.
const rebuild = process.env.ACTIVITY_REBUILD === '1';
let before = [];
try {
	if (existsSync(path)) before = JSON.parse(readFileSync(path, 'utf8'));
	if (!Array.isArray(before)) throw new Error('not an array');
} catch (err) {
	// A corrupt or conflicted file must not cost a full refetch: warn and treat it as absent.
	console.warn(`Ignoring the existing activity.json (${err.message}); writing without a floor.`);
	before = [];
}

const previous = new Map(before.map((month) => [month.month, month]));
const held = [];
for (const month of out) {
	const was = previous.get(month.month);
	if (!was) continue;
	for (const field of ['commits', 'prs', 'reviews', 'private']) {
		if (was[field] === undefined || month[field] >= was[field]) continue;
		held.push(`  ${month.month} ${field}: ${was[field]} → ${month[field]}`);
		if (!rebuild) month[field] = was[field];
	}
}

writeFileSync(path, JSON.stringify(out, null, '\t') + '\n');
console.log(`Wrote ${out.length} months through ${out.at(-1).month}.`);
if (held.length) {
	console.warn(
		`\n${held.length} count(s) came back lower than the committed file:\n${held.join('\n')}\n\n` +
			(rebuild
				? 'ACTIVITY_REBUILD=1, so the lower numbers were written. Check the diff.'
				: 'Held at the committed values. A past month falling means GitHub dropped work it used\n' +
					'to count — a repository deleted or turned private. Re-run with ACTIVITY_REBUILD=1 only\n' +
					'if the drop is intended.')
	);
}
