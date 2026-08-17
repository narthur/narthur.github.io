<script lang="ts">
	import '../app.css';
	import '@fontsource/instrument-sans/400.css'; // Regular
	import '@fontsource/instrument-sans/500.css'; // Medium

	let { children } = $props();

	const footerLinks = [
		{ name: 'Uses', url: '/uses' },
		{ name: 'Substack', url: 'https://narthur.substack.com/' },
		{ name: 'Pine Peak Digital', url: 'https://pinepeakdigital.com/' },
		{ name: 'Stack Overflow', url: 'https://stackoverflow.com/users/937377/nathan-arthur' },
		{ name: 'Ko-fi', url: 'https://ko-fi.com/narthur' }
	];
</script>

<div class="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16 sm:px-8 sm:py-24">
	<main class="flex-grow">
		{@render children()}
	</main>

	<footer class="mt-24 border-t border-rule pt-8 text-sm text-mute">
		<p class="max-w-prose">
			I write a mostly-weekly newsletter — productivity tips and tools, AI news, and the random
			thoughts of a self-employed web developer with ADHD.
		</p>
		<div class="mt-4" data-supascribe-embed-id="128744500344" data-supascribe-subscribe></div>

		<ul class="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-faint">
			{#each footerLinks as link}
				<li>
					<a href={link.url} rel="noopener noreferrer">{link.name}</a>
				</li>
			{/each}
		</ul>
	</footer>
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

	/* Supascribe's theme ships a blue button, the only saturated thing on the page. It
	   exposes its palette as CSS variables but sets them from a runtime-injected stylesheet,
	   hence !important. ponytail: setting these colors in the Supascribe dashboard instead
	   would let this whole block be deleted. */
	:global([data-supascribe-subscribe] .custom-substack-widget) {
		--csw-primary-color: #d9a05b !important;
		--csw-text-color: #0a0c10 !important;
		--csw-input-color: transparent !important;
		--csw-input-text-color: #e8e9ec !important;
	}
</style>
