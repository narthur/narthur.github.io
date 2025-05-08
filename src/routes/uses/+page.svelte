<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import * as yaml from 'js-yaml';

	// Interface definitions for our data
	interface UsesItem {
		name: string;
		description: string;
		url: string;
		tags?: string[];
	}

	interface UsesMeta {
		lastUpdated: string;
		affiliateDisclaimer: string;
	}

	interface UsesData {
		items: UsesItem[];
		meta: UsesMeta;
	}

	// State variables
	let items: UsesItem[] = [];
	let allTags: string[] = [];
	let selectedTags: Set<string> = new Set();
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

	// Toggle a tag selection
	function toggleTag(tag: string) {
		if (selectedTags.has(tag)) {
			selectedTags.delete(tag);
		} else {
			selectedTags.add(tag);
		}
		selectedTags = new Set(selectedTags); // Force reactivity
	}

	// Check if an item should be displayed based on selected tags
	function shouldDisplayItem(item: UsesItem): boolean {
		// If no tags are selected, show all items
		if (selectedTags.size === 0) return true;

		// Show the item if it has at least one of the selected tags
		return item.tags?.some((tag) => selectedTags.has(tag)) ?? false;
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

			// Sort items alphabetically by name
			items = [...data.items].sort((a, b) => a.name.localeCompare(b.name));

			// Extract all unique tags and sort them alphabetically
			const tagSet = new Set<string>();
			items.forEach((item) => {
				item.tags?.forEach((tag) => tagSet.add(tag));
			});
			allTags = Array.from(tagSet).sort();

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
			<div class="my-8 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
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
			<div class="mb-8">
				<div class="flex flex-wrap gap-2">
					{#each allTags as tag}
						<button
							onclick={() => toggleTag(tag)}
							class="rounded-full px-3 py-1 text-sm transition-colors {selectedTags.has(tag)
								? 'bg-blue-600 text-white dark:bg-blue-700'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
						>
							{tag}
						</button>
					{/each}
				</div>
				{#if selectedTags.size > 0}
					<div class="mt-4 flex items-center">
						<button
							onclick={() => (selectedTags = new Set())}
							class="text-sm text-blue-600 hover:underline dark:text-blue-400"
						>
							Clear all filters
						</button>
						<span
							class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
						>
							{selectedTags.size}
							{selectedTags.size === 1 ? 'tag' : 'tags'} selected
						</span>
					</div>
				{/if}
			</div>

			{#if items.filter((item) => shouldDisplayItem(item)).length === 0}
				<div class="my-12 rounded-lg bg-gray-100 p-8 text-center dark:bg-gray-800">
					<h3 class="mb-2 text-xl font-medium">No items match your selected tags</h3>
					<p class="mb-4 text-gray-600 dark:text-gray-400">
						Try selecting different tags or clear your filters to see all items.
					</p>
					<button
						onclick={() => (selectedTags = new Set())}
						class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
					>
						Clear all filters
					</button>
				</div>
			{:else}
				<div class="flex flex-wrap gap-6">
					{#each items as item}
						{#if shouldDisplayItem(item)}
							<div
								class="flex-grow rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md dark:border-gray-700"
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
								<p class="mb-2 text-gray-600 dark:text-gray-400">{item.description}</p>
								<div class="flex flex-wrap gap-2">
									{#each item.tags ?? [] as tag}
										<button
											onclick={() => toggleTag(tag)}
											class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 {selectedTags.has(
												tag
											)
												? 'ring-1 ring-blue-400 dark:ring-blue-500'
												: ''}"
										>
											{tag}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}

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
