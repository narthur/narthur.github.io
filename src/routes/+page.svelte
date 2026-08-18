<script lang="ts">
	const positioning = 'Full-stack web developer building in React and TypeScript';

	const contact = [
		{ name: 'GitHub', url: 'https://github.com/narthur' },
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/nathanarthur/' },
		{ name: 'Writing', url: '/writing' },
		{ name: 'Email', url: 'mailto:nathan@pinepeakdigital.com' }
	];

	const featured = [
		{
			name: 'TaskRatchet',
			url: 'https://taskratchet.com/',
			years: '2019—now',
			meta: 'solo · typescript · react · cloudflare d1 · stripe',
			description:
				'A todo app that lets users pledge money on completing their tasks on time. I built it in 2019 and have continued maintaining and developing it since.'
		},
		{
			name: 'AudioVerse',
			url: '/audioverse',
			years: '2019—2025',
			meta: 'technology director · next.js · graphql',
			description:
				'Non-profit media platform hosting a large library of audio and video recordings. I led the rebuild of its public frontend on Next.js and directed development of the GraphQL backend and admin dashboard behind it.'
		},
		{
			name: 'Pa11y Ratchet',
			url: 'https://github.com/marketplace/actions/pa11y-ratchet',
			years: '2024',
			meta: 'solo · typescript · github actions',
			description:
				'A GitHub Action that fails a build only when accessibility issues increase against the base branch, so a team can whittle down an existing backlog without blocking every merge. Published on the GitHub Marketplace.'
		}
	];

	const alsoBuilt = [
		{ name: 'buzz', url: 'https://github.com/PinePeakDigital/buzz' },
		{ name: 'Autodialer', url: 'https://autodial.taskratchet.com/' },
		{ name: 'Beeminder Dashboard', url: 'https://bm.taskratchet.com/' },
		{ name: 'Later', url: 'https://later.nathanarthur.com/' },
		{ name: 'Bayes', url: 'https://bayes.nathanarthur.com/' },
		{ name: 'The Guide', url: 'https://guide.nathanarthur.com/' },
		{ name: 'Maze Gen', url: 'https://maze.nathanarthur.com/' },
		{ name: 'Life', url: 'https://life.nathanarthur.com/' }
	];
</script>

<svelte:head>
	<title>Nathan Arthur</title>
	<!-- Derived from `positioning` so the tab, the search result, and the page can't drift apart. -->
	<meta name="description" content={positioning} />
</svelte:head>

<h1 class="text-4xl font-medium tracking-tight sm:text-5xl">Nathan Arthur</h1>

<p class="mt-5 max-w-prose text-lg leading-relaxed text-mute sm:text-xl">
	{positioning}
</p>

<ul class="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-widest">
	{#each contact as link}
		<li>
			<a href={link.url}>{link.name}</a>
		</li>
	{/each}
</ul>

<section class="mt-20">
	<h2 class="font-mono text-xs uppercase tracking-[0.2em] text-faint">Selected work</h2>

	{#each featured as project}
		<article class="mt-8 border-t border-rule pt-8">
			<div class="flex items-baseline justify-between gap-4">
				<h3 class="text-lg font-medium tracking-tight">
					<a href={project.url}>{project.name}</a>
				</h3>
				<span class="whitespace-nowrap font-mono text-xs text-faint">{project.years}</span>
			</div>
			<p class="mt-1 font-mono text-xs text-faint">{project.meta}</p>
			<p class="mt-3 max-w-prose text-sm leading-relaxed text-mute">{project.description}</p>
		</article>
	{/each}
</section>

<section class="mt-20">
	<h2 class="font-mono text-xs uppercase tracking-[0.2em] text-faint">Also built</h2>
	<ul class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-mute">
		{#each alsoBuilt as project}
			<li>
				<a href={project.url}>{project.name}</a>
			</li>
		{/each}
	</ul>
</section>
