<script lang="ts">
	import '../app.css';
	import '@fontsource/instrument-sans/400.css'; // Regular
	import '@fontsource/instrument-sans/500.css'; // Medium
	import Footer from '../components/Footer.svelte';

	let { children } = $props();
</script>

<div class="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16 sm:px-8 sm:py-24">
	<main class="flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	:global(body) {
		margin: 0;
		background: #0a0c10;
		color: #e8e9ec;
		font-family: 'Instrument Sans', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(a:hover) {
		text-decoration: underline;
		text-decoration-color: #d9a05b;
		text-underline-offset: 0.25em;
	}

	/* The palette is fully custom, so don't rely on the browser's default focus ring
	   being legible against it. */
	:global(a:focus-visible),
	:global(button:focus-visible),
	:global(summary:focus-visible) {
		outline: 2px solid #d9a05b;
		outline-offset: 3px;
		border-radius: 1px;
	}
</style>
