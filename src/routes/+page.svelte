<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import { darkMode } from './+layout.svelte';
	import { fetchGithubStats } from '../services/github/api';
	import { getLanguageColor } from '../services/github/colors';
	import ProjectList from '../components/ProjectList.svelte';

	const githubStats = fetchGithubStats();
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

		<div class="mb-12 space-y-8">
			<!-- GitHub Stats -->
			<div class="space-y-6">
				<div class="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
					<div class="flex items-center gap-2">
						<Icon icon="mdi:source-repository" class="h-5 w-5" />
						<span>{githubStats.publicRepos} repos</span>
					</div>
					<div class="flex items-center gap-2">
						<Icon icon="mdi:star" class="h-5 w-5" />
						<span>{githubStats.totalStars} stars</span>
					</div>
					<div class="flex items-center gap-2">
						<Icon icon="mdi:account-group" class="h-5 w-5" />
						<span>{githubStats.followers} followers</span>
					</div>
				</div>

				{#if Object.keys(githubStats.languages).length > 0}
					<div class="flex flex-col items-center">
						<div class="flex h-3 w-full max-w-sm overflow-hidden rounded-full">
							{#each Object.entries(githubStats.languages) as [lang, percentage]}
								<div
									class="h-full"
									style="width: {percentage}%; background-color: {getLanguageColor(lang)};"
									title="{lang}: {percentage.toFixed(1)}%"
								></div>
							{/each}
						</div>
						<div
							class="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400"
						>
							{#each Object.entries(githubStats.languages) as [lang, percentage]}
								<div class="flex items-center gap-2">
									<div
										class="h-3 w-3 rounded-full"
										style="background-color: {getLanguageColor(lang)};"
									></div>
									<span>{lang} {percentage.toFixed(1)}%</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Profile Links -->
			<div
				class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400"
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
	</div>

	<div class="space-y-12">
		<ProjectList />
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
