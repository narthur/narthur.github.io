<script lang="ts">
	const profileLinks = [
		{ name: 'Ko-fi', url: 'https://ko-fi.com/narthur' },
		{ name: 'Pine Peak Digital', url: 'https://pinepeakdigital.com/' },
		{ name: 'GitHub', url: 'https://github.com/narthur' },
		{ name: 'StackOverflow', url: 'https://stackoverflow.com/users/937377/nathan-arthur' },
		{ name: 'Blog Posts', url: 'https://blog.beeminder.com/authors/Nathan%20Arthur' }
	];

	const projectLinks = [
		{ name: 'TaskRatchet', url: 'http://taskratchet.com/' },
		{ name: 'Autodialer', url: 'https://autodial.taskratchet.com/' },
		{ name: 'Beeminder Dashboard', url: 'https://bm.taskratchet.com/' },
		{ name: 'Life', url: 'https://life.nathanarthur.com/' },
		{ name: 'Maze Gen', url: 'https://maze.nathanarthur.com/' },
		{ name: 'Codebuff Wizard', url: 'https://codebuff.nathanarthur.com/' }
	];
</script>

<div class="min-h-screen bg-[#0a0a16] py-16 px-4 sm:px-6 lg:px-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTExMjIiLz48L3N2Zz4=')] selection:bg-cyan-500 selection:text-black">
	<div class="max-w-4xl mx-auto">
		<div class="bg-black/60 backdrop-blur-sm rounded-none border-2 border-cyan-500/50 p-8 mb-16 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_50px_rgba(6,182,212,0.25)] transition-shadow duration-500">
			<div class="text-center">
				<h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 mb-6 tracking-tight leading-tight [text-shadow:_0_0_30px_rgb(6_182_212_/_50%)]">
					Nathan Arthur
				</h1>
				<p class="text-2xl text-cyan-400/90 font-mono tracking-wide">
					&lt;Full-stack web developer /&gt;
				</p>
			</div>
		</div>

		<div class="space-y-16">
			<section>
				<h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 text-center [text-shadow:_0_0_30px_rgb(6_182_212_/_50%)]">
					[Find Me Around the Web]
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each profileLinks as link}
						<a
							href={link.url}
							class="group block p-6 bg-black/60 backdrop-blur-sm rounded-none border-2 border-cyan-500/30 hover:border-cyan-400/70 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:scale-[1.02] transition-all duration-200 text-center"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span class="font-mono text-lg text-cyan-400/90 group-hover:text-cyan-300 transition-colors duration-200">
								&gt; {link.name}
							</span>
						</a>
					{/each}
				</div>
			</section>

			<section>
				<h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 text-center [text-shadow:_0_0_30px_rgb(6_182_212_/_50%)]">
					[Projects I've Built]
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each projectLinks as link}
						<a
							href={link.url}
							class="group block p-6 bg-black/60 backdrop-blur-sm rounded-none border-2 border-cyan-500/30 hover:border-cyan-400/70 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:scale-[1.02] transition-all duration-200 text-center"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span class="font-mono text-lg text-cyan-400/90 group-hover:text-cyan-300 transition-colors duration-200">
								&gt; {link.name}
							</span>
						</a>
					{/each}
				</div>
			</section>
		</div>
	</div>
</div>
