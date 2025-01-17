<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade, slide } from 'svelte/transition';
	import { darkMode } from './+layout.svelte';

	const toggleDarkMode = () => {
		darkMode.update((d) => !d);
		document.documentElement.classList.toggle('dark', $darkMode);
		document.body.classList.toggle('dark', $darkMode);
	};

	let searchQuery = '';

	const filterProjects = (project: (typeof projectLinks)[0]) => {
		const searchTerms = searchQuery.toLowerCase();
		return (
			project.name.toLowerCase().includes(searchTerms) ||
			project.description.toLowerCase().includes(searchTerms) ||
			project.tags.some((tag) => tag.toLowerCase().includes(searchTerms))
		);
	};

	const profileLinks = [
		{ name: 'Ko-fi', url: 'https://ko-fi.com/narthur' },
		{ name: 'Pine Peak Digital', url: 'https://pinepeakdigital.com/' },
		{ name: 'GitHub', url: 'https://github.com/narthur' },
		{ name: 'StackOverflow', url: 'https://stackoverflow.com/users/937377/nathan-arthur' },
		{ name: 'Blog Posts', url: 'https://blog.beeminder.com/authors/Nathan%20Arthur' },
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/nathanarthur/' }
	];

	const projectLinks = [
		{
			name: 'TaskRatchet',
			url: 'https://taskratchet.com/',
			description:
				'Deadline-driven task management platform that charges real money if you miss your deadlines, helping you stay accountable to your goals',
			icon: 'mdi:checkbox-marked-circle-outline',
			tags: ['SaaS', 'Productivity']
		},
		{
			name: 'Autodialer',
			url: 'https://autodial.taskratchet.com/',
			description:
				'Automated system that adjusts Beeminder goal rates based on historical performance data to maintain optimal challenge levels',
			icon: 'mdi:phone-sync',
			tags: ['Automation', 'Integration']
		},
		{
			name: 'Beeminder Dashboard',
			url: 'https://bm.taskratchet.com/',
			description:
				'Customizable dashboard providing enhanced visualization and management tools for Beeminder goals and data',
			icon: 'mdi:view-dashboard',
			tags: ['Dashboard', 'Integration']
		},
		{
			name: 'Life',
			url: 'https://life.nathanarthur.com/',
			description:
				"Interactive implementation of Conway's Game of Life cellular automaton, featuring custom pattern creation and simulation controls",
			icon: 'mdi:gamepad-variant',
			tags: ['Game', 'Simulation']
		},
		{
			name: 'Maze Gen',
			url: 'https://maze.nathanarthur.com/',
			description:
				'Interactive maze generation tool demonstrating various procedural generation algorithms with visual step-by-step creation',
			icon: 'mdi:map-marker-path',
			tags: ['Algorithm', 'Visualization']
		},
		{
			name: 'Codebuff Wizard',
			url: 'https://codebuff.nathanarthur.com/',
			description:
				'Step-by-step tutorial wizard that guides developers through setting up and configuring web projects with Codebuff formatting tools',
			icon: 'mdi:wizard-hat',
			tags: ['Tutorial', 'Developer Tool']
		}
	];
</script>

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
		<h1 class="mb-2 text-5xl font-medium tracking-tight">Nathan Arthur</h1>
		<p class="mb-6 text-xl font-light text-gray-600 dark:text-gray-400">Full-stack web developer</p>
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

	<div class="space-y-12">
		<section>
			<h2 class="mb-6 text-center text-3xl font-light tracking-tight text-gray-800 dark:text-white">
				Things I've Built
			</h2>
			<div class="mb-8 flex justify-center">
				<div class="relative w-full max-w-lg">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Filter projects..."
						class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 text-gray-800 placeholder-gray-500 transition-colors focus:border-gray-300 focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-gray-600"
						style="box-shadow: 0 1px 2px rgba(0,0,0,0.03);"
					/>
					<Icon
						icon="mdi:magnify"
						class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
					/>
				</div>
			</div>
			<ul class="grid grid-cols-1 gap-6">
				{#each projectLinks.filter(filterProjects) as link (link.name)}
					<li in:fade={{ duration: 200 }} out:slide={{ duration: 200 }}>
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
							style="box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);"
						>
							<div class="flex items-center gap-4">
								<Icon
									icon={link.icon}
									class="h-10 w-10 flex-shrink-0 text-gray-600 transition-colors group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
								/>
								<div class="flex-grow">
									<div class="flex items-center justify-between">
										<div
											class="text-lg font-medium tracking-tight text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
										>
											{link.name}
										</div>
										<div class="flex gap-2">
											{#each link.tags as tag}
												<span
													class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
												>
													{tag}
												</span>
											{/each}
										</div>
									</div>
									<div class="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
										{link.description}
									</div>
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>
