<script lang="ts">
	import '../app.css';
	import '@fontsource/instrument-sans/400.css';  // Regular
	import '@fontsource/instrument-sans/500.css';  // Medium
	import '@fontsource/instrument-sans/700.css';  // Bold
	let { children } = $props();
</script>

<div>
	{@render children()}
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Instrument Sans', sans-serif;
		background: white;
		color: #333;
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
</style>
