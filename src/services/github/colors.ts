// Common GitHub language colors
export const languageColors: Record<string, string> = {
	TypeScript: '#3178c6',
	JavaScript: '#f1e05a',
	HTML: '#e34c26',
	CSS: '#563d7c',
	Python: '#3572A5',
	PHP: '#4F5D95',
	Ruby: '#701516',
	Java: '#b07219',
	Swift: '#ffac45',
	Go: '#00ADD8',
	Rust: '#dea584',
	Shell: '#89e051',
	Vue: '#41b883',
	'C++': '#f34b7d',
	C: '#555555'
};

export function getLanguageColor(language: string): string {
	return languageColors[language] || '#8b949e';
}
