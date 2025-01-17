<script lang="ts">
	import Icon from '@iconify/svelte';

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

<div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
	<div style="margin-bottom: 3rem; text-align: center;">
		<h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Nathan Arthur</h1>
		<p style="font-size: 1.25rem; color: #666;">Full-stack web developer</p>
	</div>

	<div style="display: grid; gap: 3rem;">
		<section>
			<h2 style="font-size: 2rem; margin-bottom: 1.5rem; color: #333;">Projects I've Built</h2>
			<ul
				style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; list-style: none; padding: 0;"
			>
				{#each projectLinks as link}
					<li>
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							style="display: block; padding: 1.5rem; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: all 0.2s ease-in-out;"
							class="project-card"
						>
							<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
								<Icon icon={link.icon} style="color: #666; font-size: 1.25rem;" />
								<div style="font-weight: 500; color: #333; font-size: 1.1rem;">
									{link.name}
								</div>
							</div>
							<div style="color: #666; font-size: 0.9rem; line-height: 1.4;">
								{link.description}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<section style="margin-top: 2rem; border-top: 1px solid #eee; padding-top: 2rem;">
			<h2 style="font-size: 1.25rem; margin-bottom: 1rem; color: #666;">Find Me Around the Web</h2>
			<ul
				style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; list-style: none; padding: 0;"
			>
				{#each profileLinks as link}
					<li>
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							style="display: block; padding: 0.5rem; color: #666; font-size: 0.9rem;"
						>
							{link.name}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>

<style>
	.project-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
</style>
