// Writes src/work/commits/<project>.json: monthly commit counts, mine and everyone else's, for
// each local repository given. Reads git history only, so archived clones of repos that are no
// longer reachable on GitHub work as well as live ones.
//
//   pnpm project-stats audioverse ~/archive/audioverse/*
//
// "Mine" is any author whose name starts with this repo's `git config user.name`; set
// PROJECT_STATS_AUTHOR to override. Paths that aren't git repositories are skipped with a warning.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { tally } from '../src/work/commits.ts';

const [project, ...dirs] = process.argv.slice(2);
if (!project || dirs.length === 0) {
	console.error('Usage: pnpm project-stats <project> <repo dir>...');
	process.exit(1);
}

const git = (args, cwd) =>
	execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: 'pipe' });
const me = process.env.PROJECT_STATS_AUTHOR ?? git(['config', 'user.name']).trim();

// Only a repository's own root counts: git answers ".git" there, "." at the root of a bare
// clone, and the parent's path from a folder inside another repository, which would otherwise
// be charted as that whole repository. Anything else is named on the way past, so a mistyped
// path can't quietly leave a repository out.
const isRepo = (dir) => {
	try {
		if (['.git', '.'].includes(git(['rev-parse', '--git-dir'], dir).trim())) return true;
	} catch {
		// Not inside any repository, or not a directory.
	}
	console.warn(`Skipping ${dir}: not the root of a git repository`);
	return false;
};

// --all, not just the default branch: work on branches that never merged is still work. Rebased
// copies of one change do count twice, but they were 5 of 2,066 in the AudioVerse frontend.
const commits = Object.fromEntries(
	dirs
		.filter(isRepo)
		.map((dir) => [
			basename(dir),
			tally(
				git(['log', '--all', '--no-merges', '--format=%an|%ad', '--date=format:%Y-%m'], dir),
				me
			)
		])
);

const out = new URL(`../src/work/commits/${project}.json`, import.meta.url);
mkdirSync(new URL('.', out), { recursive: true });
writeFileSync(out, JSON.stringify(commits) + '\n');
console.log(
	`Wrote ${Object.keys(commits).length} repositories to src/work/commits/${project}.json.`
);
