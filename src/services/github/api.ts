import type { GithubStats, GithubRepo } from './types';
import githubData from '../../../data/github-stats.json';

export function fetchGithubStats(): GithubStats {
	// Calculate stats from static data
	const totalStars = githubData.repos.reduce(
		(sum: number, repo: GithubRepo) => sum + (repo.stargazers_count ?? 0),
		0
	);

	// Aggregate language bytes
	const languages: Record<string, number> = {};
	Object.entries(githubData.languages).forEach(([_repo, repoLanguages]) => {
		Object.entries(repoLanguages).forEach(([lang, bytes]) => {
			languages[lang] = (languages[lang] || 0) + bytes;
		});
	});

	// Convert to percentages and sort
	const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
	// Get sorted language entries
	const sortedLanguages = Object.entries(languages)
		.map(([lang, bytes]) => [lang, Number((bytes / totalBytes) * 100)])
		.sort((a, b) => Number(b[1]) - Number(a[1]));

	// Take top 4 languages and sum the rest into "Other"
	const topLanguages = sortedLanguages.slice(0, 5);
	const otherPercentage = sortedLanguages
		.slice(5)
		.reduce((sum: number, [_, percent]) => sum + Number(percent), 0);

	const languagePercentages = Object.fromEntries([
		...topLanguages,
		...(otherPercentage > 0 ? [['Other', otherPercentage]] : [])
	]);

	return {
		publicRepos: githubData.user.public_repos,
		followers: githubData.user.followers,
		totalStars,
		languages: languagePercentages
	};
}
