import { Octokit } from '@octokit/rest';
import type { GithubStats, CachedData } from './types';

const CACHE_KEY = 'githubStats';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const octokit = new Octokit();

type RequestError = Error & {
	status: number;
	response: { headers: Record<string, string>; status: number };
};

function isRequestError(error: unknown): error is RequestError {
	return Boolean((error as RequestError)?.response?.status);
}

function getCachedStats(): GithubStats | null {
	try {
		const cached = localStorage.getItem(CACHE_KEY);
		if (cached) {
			const { data, timestamp } = JSON.parse(cached) as CachedData<GithubStats>;
			if (Date.now() - timestamp < CACHE_DURATION) {
				return data;
			}
		}
	} catch (error) {
		console.error('Error reading from cache:', error);
	}
	return null;
}

function cacheStats(stats: GithubStats): void {
	try {
		localStorage.setItem(
			CACHE_KEY,
			JSON.stringify({
				data: stats,
				timestamp: Date.now()
			})
		);
	} catch (error) {
		console.error('Error writing to cache:', error);
	}
}

export async function fetchGithubStats(): Promise<GithubStats | null> {
	// Check cache first
	const cached = getCachedStats();
	if (cached) {
		return cached;
	}

	try {
		const [userResponse, reposResponse] = await Promise.all([
			octokit.rest.users.getByUsername({ username: 'narthur' }),
			octokit.rest.repos.listForUser({ username: 'narthur', per_page: 100 })
		]);

		const totalStars = reposResponse.data.reduce(
			(sum, repo) => sum + (repo.stargazers_count ?? 0),
			0
		);

		// Fetch languages for each repository
		const languagePromises = reposResponse.data.map((repo) =>
			octokit.rest.repos.listLanguages({
				owner: 'narthur',
				repo: repo.name
			})
		);

		const languageResponses = await Promise.all(languagePromises);
		const languages: Record<string, number> = {};

		// Aggregate language bytes across all repos
		languageResponses.forEach((response) => {
			Object.entries(response.data).forEach(([lang, bytes]) => {
				languages[lang] = (languages[lang] || 0) + bytes;
			});
		});

		// Convert bytes to percentages and sort by usage
		const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
		const languagePercentages = Object.fromEntries(
			Object.entries(languages)
				.map(([lang, bytes]) => [lang, Number((bytes / totalBytes) * 100)])
				.sort((a, b) => Number(b[1]) - Number(a[1]))
				.slice(0, 5) // Keep top 5 languages
		);

		const stats: GithubStats = {
			publicRepos: userResponse.data.public_repos,
			followers: userResponse.data.followers,
			totalStars: totalStars,
			languages: languagePercentages
		};

		// Cache the results
		cacheStats(stats);

		return stats;
	} catch (error: unknown) {
		if (isRequestError(error) && error.response.status === 403) {
			const resetTime = error.response.headers?.['x-ratelimit-reset'];
			if (typeof resetTime === 'number') {
				const resetDate = new Date(resetTime * 1000);
				console.log(`GitHub API rate limit will reset at: ${resetDate.toLocaleString()}`);
			}
		}
		console.error('Error fetching GitHub stats:', error);
		return null;
	}
}
