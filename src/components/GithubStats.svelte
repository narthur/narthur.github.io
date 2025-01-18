<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fetchGithubStats } from '../services/github/api';
	import { getLanguageColor } from '../services/github/colors';

	const githubStats = fetchGithubStats();
</script>

<section>
	<h2 class="mb-6 text-center text-3xl font-light tracking-tight text-gray-800 dark:text-white">
		GitHub Stats
	</h2>
	<div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
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
			<div class="mt-6 flex flex-col items-center">
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
</section>
