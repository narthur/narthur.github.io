<script lang="ts">
	import { onMount } from 'svelte';
	import * as yaml from 'js-yaml';

	// Interface definitions for our data
	interface UsesItem {
		name: string;
		description: string;
		url: string;
		category?: string;
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
	let categories: string[] = [];
	let allTags: string[] = [];
	let selectedTags: Set<string> = new Set();

	const UNCATEGORIZED = 'Other';

	// Items in a category that pass the current tag filter, sorted by name
	function itemsForCategory(category: string): UsesItem[] {
		return items
			.filter((item) => (item.category ?? UNCATEGORIZED) === category && shouldDisplayItem(item))
			.sort((a, b) => a.name.localeCompare(b.name));
	}
	let meta: UsesMeta | null = null;
	let isLoading = true;
	let loadError = false;

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

			items = data.items;

			// Build the category list in first-seen order from the YAML
			const categoryOrder: string[] = [];
			items.forEach((item) => {
				const category = item.category ?? UNCATEGORIZED;
				if (!categoryOrder.includes(category)) categoryOrder.push(category);
			});
			categories = categoryOrder;

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

<svelte:head>
	<title>Uses — Nathan Arthur</title>
	<meta
		name="description"
		content="The hardware, software, and tools Nathan Arthur uses day to day."
	/>
</svelte:head>

<p class="mb-10 font-mono text-xs uppercase tracking-widest text-faint">
	<a href="/">&larr; Nathan Arthur</a>
</p>

<h1 class="text-4xl font-medium tracking-tight">Uses</h1>
<p class="mt-5 max-w-prose leading-relaxed text-mute">
	Hardware, software, and tools I use day to day for work and personal projects. Inspired by
	<a
		href="https://uses.tech/"
		target="_blank"
		rel="noopener noreferrer"
		class="text-ink underline decoration-rule underline-offset-4">uses.tech</a
	>.
</p>

{#if isLoading}
	<p class="mt-16 font-mono text-xs uppercase tracking-widest text-faint">Loading…</p>
{:else if loadError}
	<p class="mt-16 max-w-prose leading-relaxed text-mute">
		Something went wrong loading the list. Please try again later.
	</p>
{:else}
	<details class="mt-12">
		<summary
			class="flex cursor-pointer select-none list-none items-center gap-2 font-mono text-xs uppercase tracking-widest text-faint hover:text-ink [&::-webkit-details-marker]:hidden"
		>
			<span>Filter by tag</span>
			{#if selectedTags.size > 0}
				<span class="text-accent">({selectedTags.size})</span>
			{/if}
		</summary>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each allTags as tag}
				<button
					onclick={() => toggleTag(tag)}
					class="border px-2 py-0.5 text-xs transition-colors {selectedTags.has(tag)
						? 'border-accent text-accent'
						: 'border-rule text-mute hover:border-faint'}"
				>
					{tag}
				</button>
			{/each}
		</div>
		{#if selectedTags.size > 0}
			<button
				onclick={() => (selectedTags = new Set())}
				class="mt-3 font-mono text-xs uppercase tracking-widest text-faint hover:text-ink"
			>
				Clear filters
			</button>
		{/if}
	</details>

	{#if items.filter((item) => shouldDisplayItem(item)).length === 0}
		<p class="mt-16 max-w-prose leading-relaxed text-mute">
			Nothing matches those tags.
			<button onclick={() => (selectedTags = new Set())} class="text-accent underline"
				>Clear filters</button
			>.
		</p>
	{:else}
		{#each categories as category}
			{@const categoryItems = itemsForCategory(category)}
			{#if categoryItems.length > 0}
				<section class="mt-16">
					<h2 class="font-mono text-xs uppercase tracking-[0.2em] text-faint">{category}</h2>
					<ul>
						{#each categoryItems as item}
							<li class="mt-6 border-t border-rule pt-6">
								<h3 class="font-medium tracking-tight">
									<a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
								</h3>
								<p class="mt-2 max-w-prose text-sm leading-relaxed text-mute">{item.description}</p>
								{#if item.tags?.length}
									<div class="mt-3 flex flex-wrap gap-3">
										{#each item.tags as tag}
											<button
												onclick={() => toggleTag(tag)}
												class="font-mono text-xs transition-colors {selectedTags.has(tag)
													? 'text-accent'
													: 'text-faint hover:text-mute'}"
											>
												{tag}
											</button>
										{/each}
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		{/each}
	{/if}

	<div class="mt-16 space-y-1 border-t border-rule pt-6 text-xs text-faint">
		<p>Last updated: {meta?.lastUpdated}</p>
		{#if meta?.affiliateDisclaimer}
			<p class="max-w-prose">{meta.affiliateDisclaimer}</p>
		{/if}
	</div>
{/if}
