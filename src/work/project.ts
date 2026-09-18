import { getEntry } from 'astro:content';
import { axis, timeScale } from './chart';
import { monthsBetween, type Commits } from './commits';
import { projects } from './work';

const commitFiles = import.meta.glob<{ default: Commits }>('./commits/*.json', { eager: true });

/** Everything a detail page's charts share: its work.yaml entry, commit data, and time axis. */
export async function project(slug: string) {
	const entry = await getEntry('projects', slug);
	const work = projects.find((p) => p.url === `/${slug}`);
	if (!entry || !work) throw new Error(`No project page or work.yaml entry for /${slug}`);
	const commits = commitFiles[`./commits/${slug}.json`]?.default;
	if (!commits) throw new Error(`No commit data for ${slug}; run pnpm project-stats ${slug}`);

	// ponytail: a project still running is charted to the end of this year; switch to the last
	// month in its data if the empty stretch reads as a slump.
	const ongoing = work.end === 'now';
	const lastYear = work.end === 'now' ? new Date().getFullYear() : (work.end ?? work.start);
	const scale = timeScale(work.start, `${lastYear}-12`);
	return {
		work,
		lanes: entry.data.lanes ?? [],
		commits,
		months: monthsBetween(work.start, lastYear),
		scale,
		...axis(scale, ongoing ? 'now' : String(lastYear))
	};
}
