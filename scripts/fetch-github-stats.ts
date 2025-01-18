import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
	console.error('Please set GITHUB_TOKEN environment variable');
	process.exit(1);
}

const octokit = new Octokit({
	auth: GITHUB_TOKEN
});

async function fetchGithubData() {
	try {
		// Fetch user data
		const userResponse = await octokit.rest.users.getByUsername({ username: 'narthur' });
		const userData = userResponse.data;

		// Fetch repos data
		const reposResponse = await octokit.rest.repos.listForUser({
			username: 'narthur',
			per_page: 100
		});
		const reposData = reposResponse.data;

		// Fetch languages data
		const languagePromises = reposData.map((repo) =>
			octokit.rest.repos.listLanguages({
				owner: 'narthur',
				repo: repo.name
			})
		);
		const languageResponses = await Promise.all(languagePromises);
		const languagesData = languageResponses.reduce(
			(acc, response, index) => {
				acc[reposData[index].name] = response.data;
				return acc;
			},
			{} as Record<string, Record<string, number>>
		);

		const data = {
			user: userData,
			repos: reposData,
			languages: languagesData,
			fetchedAt: new Date().toISOString()
		};

		// Ensure data directory exists
		await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

		// Write data to file
		await fs.writeFile(
			path.join(process.cwd(), 'data', 'github-stats.json'),
			JSON.stringify(data, null, 2)
		);

		console.log('GitHub data fetched and saved successfully');
	} catch (error) {
		console.error('Error fetching GitHub data:', error);
		process.exit(1);
	}
}

fetchGithubData();
