<script lang="ts">
	const posts = [
		{
			title: 'Ex WordPress Ad Astro Per Narthurius',
			url: 'https://blog.beeminder.com/astroblog/',
			date: '2023-09-06',
			blurb:
				'How the Beeminder blog moved off WordPress and onto Astro, and what broke on the way. Filed under their "X-Treme Nerd Interlude" heading.'
		},
		{
			title: 'Beeminder vs CBT',
			url: 'https://blog.beeminder.com/cbt/',
			date: '2022-09-15',
			blurb:
				'A response to the critique that Beeminder is a worse version of cognitive behavioural therapy.'
		},
		{
			title: 'Announcing TaskRatchet: Like Beeminder for Your Todo List',
			url: 'https://blog.beeminder.com/taskratchet/',
			date: '2020-06-22',
			blurb:
				'An introduction to TaskRatchet, a todo app I built that lets you pledge money on completing your tasks on time.'
		}
	];
</script>

<svelte:head>
	<title>Writing — Nathan Arthur</title>
	<meta
		name="description"
		content="Articles by Nathan Arthur on the Beeminder blog, plus the Narthur Online newsletter."
	/>
</svelte:head>

<p class="mb-10 font-mono text-xs uppercase tracking-widest text-faint">
	<a href="/">&larr; Nathan Arthur</a>
</p>

<h1 class="text-4xl font-medium tracking-tight">Writing</h1>
<p class="mt-5 max-w-prose leading-relaxed text-mute">
	I write a mostly-weekly newsletter, and I've written for the Beeminder blog.
</p>

<section class="mt-20">
	<h2 class="font-mono text-xs uppercase tracking-[0.2em] text-faint">Newsletter</h2>
	<article class="mt-8 border-t border-rule pt-8">
		<div class="flex items-baseline justify-between gap-4">
			<h3 class="text-lg font-medium tracking-tight">
				<a href="https://narthur.substack.com/"> Narthur Online </a>
			</h3>
			<span class="whitespace-nowrap font-mono text-xs text-faint">weekly-ish</span>
		</div>
		<p class="mt-3 max-w-prose text-sm leading-relaxed text-mute">
			Where most of my writing goes. Tools I'm using, things I've built, and what I'm figuring out
			about running a one-person software business. Sign up at the bottom of any page.
		</p>
	</article>
</section>

<section class="mt-20">
	<h2 class="font-mono text-xs uppercase tracking-[0.2em] text-faint">Beeminder blog</h2>
	{#each posts as post}
		<article class="mt-8 border-t border-rule pt-8">
			<div class="flex items-baseline justify-between gap-4">
				<h3 class="text-lg font-medium tracking-tight">
					<a href={post.url}>{post.title}</a>
				</h3>
				<span class="whitespace-nowrap font-mono text-xs text-faint">{post.date}</span>
			</div>
			<p class="mt-3 max-w-prose text-sm leading-relaxed text-mute">{post.blurb}</p>
		</article>
	{/each}
</section>
