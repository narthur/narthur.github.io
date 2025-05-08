<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import * as yaml from 'js-yaml';

	// Interface definitions for our data
	interface UsesItem {
		name: string;
		description: string;
		url: string;
	}

	interface UsesCategory {
		title: string;
		items: UsesItem[];
	}

	interface UsesMeta {
		lastUpdated: string;
		affiliateDisclaimer: string;
	}

	interface UsesData {
		categories: UsesCategory[];
		meta: UsesMeta;
	}

	// State variables
	let uses: UsesCategory[] = [];
	let meta: UsesMeta | null = null;
	let currentDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	let isLoading = true;
	let loadError = false;

	// Function to handle back navigation
	function goBack() {
		window.history.back();
	}

	// Load the YAML data on mount
	onMount(async () => {
		try {
			const response = await fetch('/data/uses.yaml');
			if (!response.ok) {
				throw new Error(`Failed to fetch YAML data: ${response.status}`);
			}

			const yamlText = await response.text();
			const data = yaml.load(yamlText) as UsesData;

			uses = data.categories;
			meta = data.meta;
			isLoading = false;
		} catch (error) {
			console.error('Error loading uses data:', error);
			loadError = true;
			isLoading = false;
		}
	});
</script>

<div class="mx-auto max-w-3xl px-8 py-16">
	<div class="mb-12">
		<button
			onclick={goBack}
			class="mb-8 flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
		>
			<Icon icon="mdi:arrow-left" class="mr-2 h-5 w-5" />
			<span>Back</span>
		</button>

		<h1 class="mb-6 text-4xl font-medium tracking-tight">Uses</h1>
		<p class="mb-8 text-lg text-gray-600 dark:text-gray-400">
			Here's a list of hardware, software, and tools I use on a daily basis for work and personal
			projects. This page is inspired by <a
				href="https://uses.tech/"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-600 hover:underline dark:text-blue-400">uses.tech</a
			>.
		</p>

		{#if meta && meta.affiliateDisclaimer}
			<div class="my-12 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
				<h2 class="mb-3 text-2xl font-medium">A note about links</h2>
				<p class="text-gray-600 dark:text-gray-400">
					{meta.affiliateDisclaimer}
				</p>
			</div>
		{/if}

		{#if isLoading}
			<div class="flex justify-center py-12">
				<div class="animate-pulse text-xl text-gray-600 dark:text-gray-400">Loading...</div>
			</div>
		{:else if loadError}
			<div class="rounded-lg bg-red-100 p-6 dark:bg-red-900/20">
				<h2 class="mb-2 text-xl font-medium text-red-700 dark:text-red-400">Error Loading Data</h2>
				<p class="text-red-600 dark:text-red-300">
					Sorry, there was a problem loading the tools and equipment data. Please try again later.
				</p>
			</div>
		{:else}
			<div class="space-y-12">
				{#each uses as category}
					<section>
						<h2 class="mb-4 text-2xl font-medium">{category.title}</h2>
						<div class="space-y-6">
							{#each category.items as item}
								<div
									class="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md dark:border-gray-700"
								>
									<h3 class="mb-1 text-xl font-medium">
										<a
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											class="text-blue-600 hover:underline dark:text-blue-400"
										>
											{item.name}
										</a>
									</h3>
									<p class="text-gray-600 dark:text-gray-400">{item.description}</p>
								</div>
							{/each}
						</div>
					</section>
				{/each}
			</div>

			<div class="mt-12">
				<p class="text-gray-600 dark:text-gray-400">
					Last updated: {meta && meta.lastUpdated
						? new Date(meta.lastUpdated).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})
						: currentDate}
				</p>
			</div>
		{/if}
	</div>
</div>
