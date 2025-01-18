<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import { darkMode } from './+layout.svelte';
	import ProjectList from '../components/ProjectList.svelte';
	import GithubStats from '../components/GithubStats.svelte';

	let showBackToTop = false;

	function handleScroll() {
		showBackToTop = window.scrollY > 500;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const toggleDarkMode = () => {
		darkMode.update((d) => !d);
		document.documentElement.classList.toggle('dark', $darkMode);
		document.body.classList.toggle('dark', $darkMode);
	};

	const profileLinks = [
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
		<div class="fixed right-4 top-4 z-10">
			<button
				on:click={toggleDarkMode}
				class="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
				aria-label="Toggle dark mode"
			>
				{#if $darkMode}
					<Icon icon="mdi:weather-sunny" class="h-6 w-6" />
				{:else}
					<Icon icon="mdi:weather-night" class="h-6 w-6" />
				{/if}
			</button>
		</div>
		<h1 class="mb-3 text-5xl font-medium tracking-tight">Nathan Arthur</h1>
		<p class="mb-8 text-xl font-light text-gray-600 dark:text-gray-400">Full-stack web developer</p>

		<!-- Profile Links -->
		<div
			class="mb-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400"
		>
			{#each profileLinks as link, i}
				<a
					href={link.url}
					target="_blank"
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
