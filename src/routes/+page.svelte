<script lang="ts">
	import Icon from '@iconify/svelte';
	import { darkMode } from './+layout.svelte';

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

	const projectLinks = [
		{
			name: 'TaskRatchet',
			url: 'https://taskratchet.com/',
			description: 'Deadline-driven task management with real money at stake',
			icon: 'mdi:checkbox-marked-circle-outline'
		},
		{
			name: 'Autodialer',
			url: 'https://autodial.taskratchet.com/',
			description: 'Automated Beeminder goal rate dialing based on historical data',
			icon: 'mdi:phone-sync'
		},
		{
			name: 'Beeminder Dashboard',
			url: 'https://bm.taskratchet.com/',
			description: 'Custom dashboard for managing Beeminder goals',
			icon: 'mdi:view-dashboard'
		},
		{
			name: 'Life',
			url: 'https://life.nathanarthur.com/',
			description: "Conway's Game of Life implementation with custom patterns",
			icon: 'mdi:gamepad-variant'
		},
		{
			name: 'Maze Gen',
			url: 'https://maze.nathanarthur.com/',
			description: 'Procedural maze generator',
			icon: 'mdi:map-marker-path'
		},
		{
			name: 'Codebuff Wizard',
			url: 'https://codebuff.nathanarthur.com/',
			description: 'Interactive web project setup tutorial for use with Codebuff',
			icon: 'mdi:wizard-hat'
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
		<h1 class="mb-2 text-5xl font-extralight tracking-tight">Nathan Arthur</h1>
		<p class="mb-6 text-xl font-light text-gray-600 dark:text-gray-400">Full-stack web developer</p>
		<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
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
			<h2 class="mb-6 text-3xl font-light tracking-tight text-gray-800 dark:text-white">Projects I've Built</h2>
			<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each projectLinks as link}
					<li>
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
						>
							<div class="flex flex-col items-center space-y-3">
								<Icon
									icon={link.icon}
									class="h-10 w-10 text-gray-600 transition-colors group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
								/>
								<div
									class="text-center text-lg font-medium tracking-tight text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
								>
									{link.name}
								</div>
							</div>
							<div
								class="mt-4 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400"
							>
								{link.description}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>


	</div>
</div>
