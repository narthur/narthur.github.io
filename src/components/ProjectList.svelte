<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade, slide } from 'svelte/transition';

	let searchQuery = '';
	let searchInput: HTMLInputElement;

	function handleKeydown(event: KeyboardEvent) {
		if (
			event.key === '/' &&
			!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
		) {
			event.preventDefault();
			searchInput?.focus();
		}
	}

	const filterProjects = (project: (typeof projectLinks)[0]) => {
		const searchTerms = searchQuery.toLowerCase();
		return (
			project.name.toLowerCase().includes(searchTerms) ||
			project.description.toLowerCase().includes(searchTerms) ||
			project.tags.some((tag) => tag.toLowerCase().includes(searchTerms))
		);
	};

	const projectLinks = [
		{
			name: "Let's Build Something Together",
			url: 'https://pinepeakdigital.com/contact',
			description:
				'Have an idea for a project? Looking for a developer to help bring your vision to life? Get in touch and let\'s discuss how we can work together.',
			icon: 'mdi:handshake',
			tags: ['Available', 'Contact'],
			highlight: true
		},
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
			icon: 'mdi:chart-line',
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
				"Interactive implementation of Conway's Game of Life cellular automaton, featuring wrap-around edges and emoji cells",
			icon: 'mdi:sprout',
			tags: ['Game', 'Simulation']
		},
		{
			name: 'Maze Gen',
			url: 'https://maze.nathanarthur.com/',
			description:
				'Interactive maze generation tool which generates large mazes and then releases two agents to solve them in real-time',
			icon: 'mdi:map-marker-path',
			tags: ['Algorithm', 'Visualization']
		},
		{
			name: 'Codebuff Wizard',
			url: 'https://codebuff.nathanarthur.com/',
			description:
				'Step-by-step tutorial wizard that guides developers through setting up and configuring web projects with Codebuff for AI code generation',
			icon: 'mdi:wizard-hat',
			tags: ['Tutorial', 'Developer Tool']
		},
		{
			name: 'Bayes',
			url: 'https://bayes.nathanarthur.com/',
			description:
				'Journal for tracking hypotheses and observations over time, tracking Bayesian probabilities and updating beliefs',
			icon: 'mdi:function',
			tags: ['Tool', 'Education']
		},
		{
			name: 'Later',
			url: 'https://later.nathanarthur.com/',
			description:
				'Todo list that lets you postpone tasks until tomorrow or any arbitrary date, helping you focus on what needs to be done today',
			icon: 'mdi:calendar-clock',
			tags: ['Productivity', 'Tool']
		}
	];
</script>

<svelte:window on:keydown={handleKeydown} />

<section>
	<h2 class="mb-6 text-center text-3xl font-light tracking-tight text-gray-800 dark:text-white">
		Things I've Built
	</h2>
	<div class="mb-8 flex justify-center">
		<div class="relative w-full max-w-lg">
			<input
				type="text"
				bind:value={searchQuery}
				bind:this={searchInput}
				placeholder="Filter projects... (Press '/' to focus)"
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
					rel="noopener noreferrer"							class={`group block rounded-lg border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
								link.highlight
									? 'border-blue-200 bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:bg-blue-900/30 dark:hover:border-blue-700'
									: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
							}`}
					style="box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);"
				>
					<div class="flex items-center gap-4">
						<Icon
							icon={link.icon}									class={`h-10 w-10 flex-shrink-0 transition-colors ${
										link.highlight
											? 'text-blue-600 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300'
											: 'text-gray-600 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400'
									}`}
						/>
						<div class="flex-grow">
							<div class="flex items-center justify-between">
								<div
									class={`text-lg font-medium tracking-tight transition-colors ${
										link.highlight
											? 'text-blue-800 group-hover:text-blue-900 dark:text-blue-100 dark:group-hover:text-white'
											: 'text-gray-800 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'
									}`}
								>
									{link.name}
								</div>
								<div class="flex gap-2">
									{#each link.tags as tag}
										<span
											class={`rounded px-2 py-1 text-xs ${
										link.highlight
											? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
											: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
									}`}
										>
											{tag}
										</span>
									{/each}
								</div>
							</div>
							<div
								class={`mt-2 text-sm leading-relaxed ${
									link.highlight
										? 'text-blue-700 dark:text-blue-300'
										: 'text-gray-500 dark:text-gray-400'
								}`}
							>
								{link.description}
							</div>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>
