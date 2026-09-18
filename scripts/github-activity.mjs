// Writes src/work/activity.json: monthly commit, PR, and review counts from GitHub, through the
// last complete month.
// Run with `pnpm activity`; needs the `gh` CLI logged in as the account being charted.
// ponytail: refreshed by hand and committed, since the deploy has no GitHub token.
// Move it into the deploy workflow if keeping it current by hand becomes a chore.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const FIRST_YEAR = 2014;
const now = new Date();

function ghToken() {
	try {
		return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw new Error('The GitHub CLI (gh) is not installed: https://cli.github.com/');
		}
		throw err; // gh's own message covers the logged-out case ("run gh auth login").
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

const months = [];
for (let year = FIRST_YEAR; year <= now.getUTCFullYear(); year++) {
	// One request per year, one aliased collection per month.
	const fields = [];
	for (let m = 0; m < 12; m++) {
		const from = new Date(Date.UTC(year, m, 1));
		const to = new Date(Date.UTC(year, m + 1, 1) - 1000);
		// Stop before the month in progress: a partial month reads as a slump at the chart's end.
		if (to > now) break;
		fields.push(`m${m}: contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
			totalCommitContributions totalPullRequestContributions totalPullRequestReviewContributions
		}`);
	}
	const data = await graphql(`{ viewer { ${fields.join('\n')} } }`);
	fields.forEach((_, m) => {
		const c = data.viewer[`m${m}`];
		months.push({
			month: `${year}-${String(m + 1).padStart(2, '0')}`,
			commits: c.totalCommitContributions,
			prs: c.totalPullRequestContributions,
			reviews: c.totalPullRequestReviewContributions
		});
	});
}

writeFileSync(
	new URL('../src/work/activity.json', import.meta.url),
	JSON.stringify(months, null, '\t') + '\n'
);
console.log(`Wrote ${months.length} months through ${months.at(-1).month}.`);
