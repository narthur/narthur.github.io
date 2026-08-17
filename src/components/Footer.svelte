<script lang="ts">
	const links = [
		{ name: 'Uses', url: '/uses' },
		{ name: 'Substack', url: 'https://narthur.substack.com/' },
		{ name: 'Pine Peak Digital', url: 'https://pinepeakdigital.com/' },
		{ name: 'Stack Overflow', url: 'https://stackoverflow.com/users/937377/nathan-arthur' },
		{ name: 'Ko-fi', url: 'https://ko-fi.com/narthur' }
	];
</script>

<footer class="mt-24 border-t border-rule pt-8 text-sm text-mute">
	<p class="max-w-prose">
		I write a mostly-weekly newsletter — productivity tips and tools, AI news, and the random
		thoughts of a self-employed web developer with ADHD.
	</p>
	<div class="mt-4" data-supascribe-embed-id="128744500344" data-supascribe-subscribe></div>

	<ul class="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-faint">
		{#each links as link}
			<li>
				<a href={link.url} rel="noopener noreferrer">{link.name}</a>
			</li>
		{/each}
	</ul>
</footer>

<style>
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
