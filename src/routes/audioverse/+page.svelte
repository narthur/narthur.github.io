<script lang="ts">
	// ponytail: screenshots, not the live site — audioverse.org has since diverged from what I built.
	const shots = [
		{
			src: '/audioverse/home.jpg',
			alt: 'AudioVerse home page: sidebar navigation, "Sound Doctrine" hero, latest content grid, blog posts, testimonials, and donation sections',
			caption: 'Home',
			width: 1400,
			height: 4958
		},
		{
			src: '/audioverse/discover.jpg',
			alt: 'AudioVerse Discover page: recent, trending, and featured teachings in card grids, plus blog posts, stories, and conferences',
			caption: 'Discover',
			width: 1400,
			height: 3806
		},
		{
			src: '/audioverse/sermon.jpg',
			alt: 'AudioVerse recording page: video player with speed and download controls, description, series metadata, and a persistent bottom playback bar',
			caption: 'Recording',
			width: 1400,
			height: 2104
		}
	];
</script>

<svelte:head>
	<title>AudioVerse — Nathan Arthur</title>
	<meta
		name="description"
		content="Screenshots of the AudioVerse frontend rebuild, led and built by Nathan Arthur."
	/>
</svelte:head>

<p class="mb-10 font-mono text-xs uppercase tracking-widest text-faint">
	<a href="/">&larr; Nathan Arthur</a>
</p>

<h1 class="text-4xl font-medium tracking-tight">AudioVerse</h1>
<p class="mt-2 font-mono text-xs text-faint">technology director · 2019—2025 · next.js · graphql</p>

<div class="mt-8 max-w-prose space-y-4 leading-relaxed text-mute">
	<p>
		AudioVerse is a non-profit media platform hosting a large library of audio and video recordings.
		I led the rebuild of its public frontend on Next.js, working from designs by an outside design
		firm, and directed the work on the GraphQL backend and admin dashboard behind it.
	</p>
	<p>
		The rebuild shipped with an accessibility backlog too large to clear in one pass, which is why I
		built <a
			href="https://github.com/marketplace/actions/pa11y-ratchet"
			class="text-ink underline decoration-rule underline-offset-4">Pa11y Ratchet</a
		>. The CI action only fails on an increase in number of accessibility issues, allowing a team to
		whittle an existing backlog down over time.
	</p>
	<p class="text-sm text-faint">
		These are captures from 2024. The live <a
			href="https://audioverse.org"
			class="underline decoration-rule underline-offset-4">audioverse.org</a
		> has changed since, and no longer represents my work.
	</p>
</div>

<div class="mt-16 space-y-16">
	{#each shots as shot, i}
		<figure>
			<figcaption class="mb-3 font-mono text-xs uppercase tracking-widest text-faint">
				{shot.caption}
			</figcaption>
			<img
				src={shot.src}
				alt={shot.alt}
				width={shot.width}
				height={shot.height}
				loading={i === 0 ? 'eager' : 'lazy'}
				class="w-full border border-rule"
			/>
		</figure>
	{/each}
</div>
