// Writes src/work/activity.json: monthly commit, PR, review, and private counts from GitHub,
// through the last complete month.
// Run with `pnpm activity`; needs the `gh` CLI logged in as narthur.
// ponytail: refreshed by hand and committed, since the deploy has no GitHub token.
// Move it into the deploy workflow if keeping it current by hand becomes a chore.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// Work before 2019 went to su-narthur, a SimpleUpdates account whose email is long gone, so it
// can't be logged into. Its contribution calendar is public even so, which is the only reason
// those years are counted at all — see SPLIT and UNSPLIT below.
const ME = 'narthur';
const OTHERS = ['su-narthur'];
// Repositories whose commits are machine-written and shouldn't read as work. tw-todo is a
// taskwarrior-to-git sync: 4,509 commits in five months of 2019, which swamped every real
// thing done that year. Their counts come out of `private` month by month — being private,
// they arrive inside restrictedContributionsCount, which is a single number with no repository
// breakdown, so subtracting them is the only way to take them out.
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

// SPLIT: my own account, where the token can ask what kind of contribution each one was. The
// per-type totals count public repositories only; restrictedContributionsCount is everything
// else, and the two add up exactly to the contribution calendar's total.
const byYear = Object.groupBy([...eachMonth()], ({ year }) => year);
for (const [year, group] of Object.entries(byYear)) {
	// One request per year, one aliased collection per month.
	const fields = group.map(
		({
			m,
			from,
			to
		}) => `m${m}: contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
			totalCommitContributions totalPullRequestContributions totalPullRequestReviewContributions
			restrictedContributionsCount
		}`
	);
	const data = await graphql(`{ user(login: "${ME}") { ${fields.join('\n')} } }`);
	for (const { m } of group) {
		const c = data.user[`m${m}`];
		const month = row(`${year}-${String(m + 1).padStart(2, '0')}`);
		month.commits += c.totalCommitContributions;
		month.prs += c.totalPullRequestContributions;
		month.reviews += c.totalPullRequestReviewContributions;
		month.private += c.restrictedContributionsCount;
	}
}

// UNSPLIT: an account I can't hold a token for. Its per-type totals all read zero and its
// restricted count is hidden, but the calendar is public, so the work lands in `private` whole:
// real, dated, and of an unknowable kind.
for (const account of OTHERS) {
	for (let year = FIRST_YEAR; year <= now.getUTCFullYear(); year++) {
		const from = new Date(Date.UTC(year, 0, 1));
		const to = new Date(Date.UTC(year + 1, 0, 1) - 1000);
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
				row(month).private += day.contributionCount;
			}
		}
	}
}

// Commits on the default branch, which is what a contribution counts: same query shape as
// above, one aliased month per field. The two don't agree exactly — tw-todo has 4,325 commits
// in March 2019 against 4,039 restricted contributions, GitHub having credited only the ones
// authored by a linked email — so the subtraction is clamped at zero rather than digging a
// hole. The cost is that a month the excluded repo dominates loses whatever real private work
// shared it: February and March 2019 both floor out here.
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
			const month = row(`${year}-${String(m + 1).padStart(2, '0')}`);
			month.private = Math.max(0, month.private - history[`m${m}`].totalCount);
		}
	}
}

const out = [...months.values()].sort((a, b) => a.month.localeCompare(b.month));
const path = new URL('../src/work/activity.json', import.meta.url);

// A finished month should never shrink. When one does, GitHub has stopped counting something it
// used to: a repository deleted (archiving is safe — an archived repository still counts), or
// turned private, or an organization gone. None of that announces itself, and the committed file
// is the only copy, so say so loudly enough to be read before the diff is committed.
// Warns rather than fails: changing what a field means shrinks months legitimately, and the run
// still has to write for the new numbers to be reviewable at all.
const before = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : [];
const previous = new Map(before.map((month) => [month.month, month]));
const shrunk = out.flatMap((month) => {
	const was = previous.get(month.month);
	if (!was) return [];
	return ['commits', 'prs', 'reviews', 'private']
		.filter((key) => was[key] !== undefined && month[key] < was[key])
		.map((key) => `  ${month.month} ${key}: ${was[key]} → ${month[key]}`);
});

writeFileSync(path, JSON.stringify(out, null, '\t') + '\n');
console.log(`Wrote ${out.length} months through ${out.at(-1).month}.`);
if (shrunk.length) {
	console.warn(
		`\n${shrunk.length} count(s) lower than the committed file:\n${shrunk.join('\n')}\n\n` +
			'Check before committing: a past month falling means GitHub dropped work it used to count.'
	);
}
