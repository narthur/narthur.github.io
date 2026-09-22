// Writes src/code/code.json: every public, non-fork repository under the accounts below, plus
// every public gist. The page decides what to show — see src/code/code.ts — so the file stays a
// full record and the "everything else" count on the page is honest.
// Run with `pnpm code`; needs the `gh` CLI logged in as narthur.
// ponytail: refreshed by hand and committed, like activity.json, since the deploy has no GitHub
// token. Move it into the deploy workflow if keeping it current by hand becomes a chore.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

// A user's repositories default to everything they own, collaborate on, or reach through an
// organization — so beeminder/blog and the rest of the collaborator work arrives here too, under
// its real owner. The org is listed separately because org membership alone wouldn't pull in
// repositories nobody added him to.
const USERS = ['narthur'];
const ORGS = ['pinepeakdigital'];

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

async function graphql(query, variables) {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables })
	});
	const json = await res.json();
	if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? json));
	return json.data;
}

const REPO_FIELDS = `
	nodes { name url description stargazerCount pushedAt owner { login } primaryLanguage { name } }
	pageInfo { hasNextPage endCursor }
`;

/** Every page of a connection, since 107 repositories already exceed the 100-node cap. */
async function pages(query, variables, pick) {
	const out = [];
	let cursor = null;
	do {
		const page = pick(await graphql(query, { ...variables, cursor }));
		out.push(...page.nodes);
		cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
	} while (cursor);
	return out;
}

const repo = (node) => ({
	owner: node.owner.login,
	name: node.name,
	url: node.url,
	description: node.description ?? '',
	stars: node.stargazerCount,
	pushed: node.pushedAt.slice(0, 10),
	language: node.primaryLanguage?.name ?? ''
});

const items = [];

for (const login of USERS) {
	const nodes = await pages(
		`query($login: String!, $cursor: String) {
			user(login: $login) {
				repositories(first: 100, after: $cursor, privacy: PUBLIC, isFork: false) { ${REPO_FIELDS} }
			}
		}`,
		{ login },
		(data) => data.user.repositories
	);
	items.push(...nodes.map(repo));
}

for (const login of ORGS) {
	const nodes = await pages(
		`query($login: String!, $cursor: String) {
			organization(login: $login) {
				repositories(first: 100, after: $cursor, privacy: PUBLIC, isFork: false) { ${REPO_FIELDS} }
			}
		}`,
		{ login },
		(data) => data.organization.repositories
	);
	items.push(...nodes.map(repo));
}

// A gist has no name of its own: GitHub titles it by its first file, so the page does too.
// The gists connection takes no isFork argument, unlike repositories, so forks are filtered out
// here instead — a forked gist would otherwise read as his own snippet on the page.
for (const login of USERS) {
	const nodes = await pages(
		`query($login: String!, $cursor: String) {
			user(login: $login) {
				gists(first: 100, after: $cursor, privacy: PUBLIC) {
					nodes {
						name url description stargazerCount pushedAt isFork
						files(limit: 1) { name language { name } }
					}
					pageInfo { hasNextPage endCursor }
				}
			}
		}`,
		{ login },
		(data) => data.user.gists
	);
	items.push(
		...nodes
			.filter((node) => !node.isFork)
			.map((node) => ({
				owner: login,
				gist: true,
				name: node.files?.[0]?.name ?? node.name,
				url: node.url,
				description: node.description ?? '',
				stars: node.stargazerCount,
				pushed: node.pushedAt.slice(0, 10),
				language: node.files?.[0]?.language?.name ?? ''
			}))
	);
}

// The user and org queries overlap wherever he is a member of the org, so the URL decides.
const unique = [...new Map(items.map((item) => [item.url, item])).values()];
unique.sort((a, b) => b.pushed.localeCompare(a.pushed));

const path = new URL('../src/code/code.json', import.meta.url);
writeFileSync(path, JSON.stringify(unique, null, '\t') + '\n');
const gists = unique.filter((item) => item.gist).length;
console.log(`Wrote ${unique.length - gists} repositories and ${gists} gists.`);
