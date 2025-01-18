export interface GithubStats {
	publicRepos: number;
	followers: number;
	totalStars: number;
	languages: Record<string, number>;
}

export interface CachedData<T> {
	data: T;
	timestamp: number;
}
