import { Octokit } from '@octokit/rest';
import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';
import open from 'open';

const clientId = process.env.GITHUB_OAUTH_CLIENT_ID as string;
const scopes = ['public_repo', 'read:user'];

async function getAccessToken() {
	const auth = createOAuthDeviceAuth({
		clientType: 'oauth-app',
		clientId,
		scopes,
		onVerification: async (verification) => {
			await open(verification.verification_uri);
			console.log('Please enter the following code at %s', verification.verification_uri);
			console.log('\n%s\n', verification.user_code);
		}
	});

	const { token } = await auth({
		type: 'oauth'
	});

	return token;
}

async function fetchGithubData() {
	try {
		const token = await getAccessToken();
		const octokit = new Octokit({ auth: token });

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
