<script lang="ts">
	import '../app.css';
	import '@fontsource/instrument-sans/400.css'; // Regular
	import '@fontsource/instrument-sans/500.css'; // Medium
	import '@fontsource/instrument-sans/700.css'; // Bold

	let { children } = $props();
</script>

<div class="dark">
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
