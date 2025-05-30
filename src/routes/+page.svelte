<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import ProjectList from '../components/ProjectList.svelte';
	import GithubStats from '../components/GithubStats.svelte';
	import SubscribeForm from '../components/SubscribeForm.svelte';

	let showBackToTop = false;

	function handleScroll() {
		showBackToTop = window.scrollY > 500;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const profileLinks = [
		{ name: 'Uses', url: '/uses' },
		{ name: 'Substack', url: 'https://narthur.substack.com/' },
		{ name: 'Ko-fi', url: 'https://ko-fi.com/narthur' },
		{ name: 'Pine Peak Digital', url: 'https://pinepeakdigital.com/' },
		{ name: 'GitHub', url: 'https://github.com/narthur' },
		{ name: 'StackOverflow', url: 'https://stackoverflow.com/users/937377/nathan-arthur' },
		{ name: 'Blog Posts', url: 'https://blog.beeminder.com/authors/Nathan%20Arthur' },
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/nathanarthur/' }
	];
</script>

<svelte:window on:scroll={handleScroll} />

<div class="mx-auto max-w-3xl px-8 py-16">
	<div class="mb-12 text-center">
		<h1 class="mb-1 text-5xl font-medium tracking-tight">Nathan Arthur</h1>
		<p class="mb-4 text-xl font-light text-gray-600 dark:text-gray-400">Full-stack web developer</p>

		<!-- Profile Links -->
		<div
			class="mb-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400"
		>
			{#each profileLinks as link, i}
				<a
					href={link.url}
					rel="noopener noreferrer"
					class="hover:text-blue-600 dark:hover:text-blue-400"
				>
					{link.name}
				</a>
				{#if i < profileLinks.length - 1}
					<span class="text-gray-300 dark:text-gray-600">•</span>
				{/if}
			{/each}
		</div>
	</div>

	<div class="space-y-12">
		<SubscribeForm />
		<ProjectList />
		<GithubStats />
	</div>
</div>

{#if showBackToTop}
	<button
		on:click={scrollToTop}
		class="fixed bottom-8 right-8 rounded-full bg-white p-3 text-gray-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
		aria-label="Back to top"
		transition:fade={{ duration: 200 }}
	>
		<Icon icon="mdi:arrow-up" class="h-6 w-6" />
	</button>
{/if}
