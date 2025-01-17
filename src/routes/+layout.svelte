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

	// Apply initial dark mode class to body
	if (typeof window !== 'undefined' && $darkMode) {
		document.body.classList.add('dark');
	}
</script>

<div class:dark={$darkMode}>
	{@render children()}
</div>

<style>
	:global(html.dark),
	:global(html.dark body) {
		background: #1a1a1a;
		color: #fff;
		--separator-color: #333;
		--border-color: #444;
		--border-hover-color: #555;
	}

	:global(body) {
		margin: 0;
		font-family: 'Instrument Sans', sans-serif;
		--separator-color: #eee;
		--border-color: #ddd;
		--border-hover-color: #bbb;
	}

	:global(body.dark) {
		background: #1a1a1a;
		color: #fff;
		--separator-color: #333;
		--border-color: #444;
		--border-hover-color: #555;
	}

	:global(a) {
		color: #0066cc;
		text-decoration: none;
		transition: color 0.2s;
	}

	:global(a:hover) {
		color: #004999;
		text-decoration: underline;
	}

	:global(.dark a) {
		color: #66b3ff;
	}

	:global(.dark a:hover) {
		color: #99ccff;
	}
</style>
