<script lang="ts" module>
	import { writable } from 'svelte/store';

	// Initialize with system preference, defaulting to false if running on server
	const prefersDark =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
			: false;

	export const darkMode = writable(prefersDark);

	// Listen for system preference changes if in browser
	if (typeof window !== 'undefined') {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', (e) => darkMode.set(e.matches));
	}
</script>

<script lang="ts">
	import '../app.css';
	import '@fontsource/instrument-sans/400.css'; // Regular
	import '@fontsource/instrument-sans/500.css'; // Medium
	import '@fontsource/instrument-sans/700.css'; // Bold

	let { children } = $props();

	// Apply initial dark mode class to html and body
	if (typeof window !== 'undefined' && $darkMode) {
		document.documentElement.classList.add('dark');
		document.body.classList.add('dark');
	}
</script>

<div class:dark={$darkMode}>
	{@render children()}
</div>

<style>
	:global(html.dark),
	:global(html.dark body) {
		@apply bg-gray-900 text-white;
	}

	:global(body) {
		@apply m-0 font-sans;
	}

	:global(a) {
		@apply text-blue-600 no-underline transition-colors;
	}

	:global(a:hover) {
		@apply text-blue-800 underline;
	}

	:global(.dark a) {
		@apply text-blue-400;
	}

	:global(.dark a:hover) {
		@apply text-blue-300;
	}
</style>
