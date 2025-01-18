import type { GithubData } from '../services/github/types';

declare module '*.json' {
	const value: GithubData;
	export default value;
}
