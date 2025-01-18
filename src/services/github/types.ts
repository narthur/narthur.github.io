export interface GithubStats {
	publicRepos: number;
	followers: number;
	totalStars: number;
	languages: Record<string, number>;
}

export interface GithubUser {
	public_repos: number;
	followers: number;
}

export interface GithubRepo {
	name: string;
	stargazers_count: number;
}

export interface GithubLanguages {
	[repo: string]: {
		[language: string]: number;
	};
}

export interface GithubData {
	user: GithubUser;
	repos: GithubRepo[];
	languages: GithubLanguages;
	fetchedAt: string;
}
