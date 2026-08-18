<script lang="ts">
	import { itemsInCategory } from './filter';

	let { data } = $props();

	let selectedTags = $state(new Set<string>());

	function toggleTag(tag: string) {
		const next = new Set(selectedTags);
		if (!next.delete(tag)) next.add(tag);
		selectedTags = next;
	}

	const visible = $derived(
		data.categories
			.map((category: string) => ({
				category,
				items: itemsInCategory(data.items, category, selectedTags)
			}))
			.filter((group: { items: unknown[] }) => group.items.length > 0)
	);
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
	<a href="https://uses.tech/" class="text-ink underline decoration-rule underline-offset-4"
		>uses.tech</a
	>.
</p>

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
		{#each data.tags as tag}
			<button
				onclick={() => toggleTag(tag)}
				aria-pressed={selectedTags.has(tag)}
				aria-label="Filter by {tag}"
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

{#if visible.length === 0}
	<p class="mt-16 max-w-prose leading-relaxed text-mute">
		Nothing matches those tags.
		<button onclick={() => (selectedTags = new Set())} class="text-accent underline"
			>Clear filters</button
		>.
	</p>
{:else}
	{#each visible as group (group.category)}
		<section class="mt-16">
			<h2 class="font-mono text-xs uppercase tracking-[0.2em] text-faint">{group.category}</h2>
			<ul>
				{#each group.items as item (item.name)}
					<li class="mt-6 border-t border-rule pt-6">
						<h3 class="font-medium tracking-tight">
							<a href={item.url}>{item.name}</a>
						</h3>
						<p class="mt-2 max-w-prose text-sm leading-relaxed text-mute">{item.description}</p>
						{#if item.tags?.length}
							<div class="mt-3 flex flex-wrap gap-3">
								{#each item.tags as tag}
									<button
										onclick={() => toggleTag(tag)}
										aria-pressed={selectedTags.has(tag)}
										aria-label="Filter by {tag}"
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
	{/each}
{/if}

<div class="mt-16 space-y-1 border-t border-rule pt-6 text-xs text-faint">
	<p>Last updated: {data.meta.lastUpdated}</p>
	{#if data.meta.affiliateDisclaimer}
		<p class="max-w-prose">{data.meta.affiliateDisclaimer}</p>
	{/if}
</div>
