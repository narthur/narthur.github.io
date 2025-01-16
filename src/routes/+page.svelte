<script lang="ts">
	const profileLinks = [
		{ name: 'Ko-fi', url: 'https://ko-fi.com/narthur' },
		{ name: 'Pine Peak Digital', url: 'https://pinepeakdigital.com/' },
		{ name: 'GitHub', url: 'https://github.com/narthur' },
		{ name: 'StackOverflow', url: 'https://stackoverflow.com/users/937377/nathan-arthur' },
		{ name: 'Blog Posts', url: 'https://blog.beeminder.com/authors/Nathan%20Arthur' },
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/nathanarthur/' }
	];

	const projectLinks = [
		{ name: 'TaskRatchet', url: 'https://taskratchet.com/' },
		{ name: 'Autodialer', url: 'https://autodial.taskratchet.com/' },
		{ name: 'Beeminder Dashboard', url: 'https://bm.taskratchet.com/' },
		{ name: 'Life', url: 'https://life.nathanarthur.com/' },
		{ name: 'Maze Gen', url: 'https://maze.nathanarthur.com/' },
		{ name: 'Codebuff Wizard', url: 'https://codebuff.nathanarthur.com/' }
	];
</script>

<div
	class="relative min-h-screen bg-gradient-to-b from-stone-950 to-stone-900 px-4 py-16 selection:bg-stone-800 selection:text-stone-100 sm:px-6 lg:px-8"
>
	<div class="relative z-10 mx-auto max-w-4xl">
		<div
			class="mb-16 rounded-lg border border-stone-800/50 bg-stone-900/40 p-16 shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-stone-700/70 hover:shadow-xl"
		>
			<div class="text-center">
				<h1
					class="mb-8 bg-gradient-to-r from-stone-100 to-stone-300 bg-clip-text text-8xl font-extralight leading-none tracking-tighter text-transparent"
				>
					Nathan Arthur
				</h1>
				<p class="font-mono text-2xl tracking-widest text-stone-400/70">
					&lt;Full-stack web developer /&gt;
				</p>
			</div>
		</div>

		<div class="space-y-16">
			<section>
				<h2 class="mb-12 text-center text-3xl font-extralight tracking-wide text-stone-300/90">
					[Find Me Around the Web]
				</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each profileLinks as link}
						<a
							href={link.url}
							class="group relative block overflow-hidden rounded-md border border-stone-800 bg-stone-900/80 p-6 text-center shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-stone-700 hover:shadow-lg"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div
								class="absolute inset-0 bg-gradient-to-r from-stone-800/20 to-stone-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							></div>
							<span
								class="font-mono text-lg tracking-wide text-stone-400/80 transition-colors duration-300 group-hover:text-stone-200"
							>
								&gt; {link.name}
							</span>
						</a>
					{/each}
				</div>
			</section>

			<section>
				<h2 class="mb-8 text-center text-2xl font-light text-stone-300">[Projects I've Built]</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each projectLinks as link}
						<a
							href={link.url}
							class="group relative block overflow-hidden rounded-md border border-stone-800 bg-stone-900/80 p-6 text-center shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-stone-700 hover:shadow-lg"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div
								class="absolute inset-0 bg-gradient-to-r from-stone-800/50 to-stone-900/50 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<span
								class="font-mono text-lg text-stone-400 transition-colors duration-200 group-hover:text-stone-200"
							>
								&gt; {link.name}
							</span>
						</a>
					{/each}
				</div>
			</section>
		</div>
	</div>
</div>

<style>
</style>
