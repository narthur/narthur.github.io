<script lang="ts" module>
	import { writable } from 'svelte/store';

	// Initialize with localStorage value, falling back to system preference
	const getInitialDarkMode = () => {
		if (typeof window === 'undefined') return false;

		const stored = localStorage.getItem('darkMode');
		if (stored !== null) return stored === 'true';

		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	};

	export const darkMode = writable(getInitialDarkMode());

	// Listen for system preference changes if in browser
	if (typeof window !== 'undefined') {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			darkMode.set(e.matches);
			localStorage.setItem('darkMode', e.matches.toString());
		});

		// Subscribe to store changes to update localStorage
		darkMode.subscribe((value) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem('darkMode', value.toString());
			}
		});
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
	:global(body) {
		margin: 0;
		font-family: 'Instrument Sans', sans-serif;
		background: linear-gradient(150deg, rgb(249, 250, 251) 0%, rgb(243, 244, 246) 100%);
		color: rgb(17, 24, 39);
		min-height: 100vh;
	}

	:global(html.dark),
	:global(html.dark body) {
		background: linear-gradient(150deg, rgb(17, 24, 39) 0%, rgb(12, 17, 27) 100%);
		color: white;
	}
</style>
