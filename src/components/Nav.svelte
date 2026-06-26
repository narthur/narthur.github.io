<script lang="ts">
	const links = [
		{ name: 'Uses', url: '/uses' },
		{ name: 'GitHub', url: 'https://github.com/narthur' },
		{ name: 'Substack', url: 'https://narthur.substack.com/' }
	];
</script>

<nav class="mx-auto flex max-w-3xl items-center justify-between gap-4 px-8 py-5 text-sm">
	<a href="/" class="font-medium tracking-tight hover:text-blue-600 dark:hover:text-blue-400">
		Nathan Arthur
	</a>
	<div class="flex items-center gap-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
		{#each links as link}
			<a
				href={link.url}
				rel="noopener noreferrer"
				class="hover:text-blue-600 dark:hover:text-blue-400"
			>
				{link.name}
			</a>
		{/each}
	</div>
</nav>
