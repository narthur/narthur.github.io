// Writes src/work/commits/<project>.json: monthly commit counts, mine and everyone else's, for
// each local repository given. Reads git history only, so archived clones of repos that are no
// longer reachable on GitHub work as well as live ones.
//
//   pnpm project-stats audioverse ~/archive/audioverse/*
//
// "Mine" is any author whose name starts with this repo's `git config user.name`; set
// PROJECT_STATS_AUTHOR to override. Directories that aren't git repositories are skipped.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { tally } from '../src/work/commits.ts';

const [project, ...dirs] = process.argv.slice(2);
if (!project || dirs.length === 0) {
	console.error('Usage: pnpm project-stats <project> <repo dir>...');
	process.exit(1);
}

const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28 });
const me = process.env.PROJECT_STATS_AUTHOR ?? git(['config', 'user.name']).trim();

const commits = {};
for (const dir of dirs) {
	if (!existsSync(join(dir, '.git'))) continue;
	const log = git(['log', '--all', '--no-merges', '--format=%an|%ad', '--date=format:%Y-%m'], dir);
	commits[basename(dir)] = tally(log, me);
}

const out = new URL(`../src/work/commits/${project}.json`, import.meta.url);
mkdirSync(new URL('.', out), { recursive: true });
writeFileSync(out, JSON.stringify(commits) + '\n');
console.log(
	`Wrote ${Object.keys(commits).length} repositories to src/work/commits/${project}.json.`
);
