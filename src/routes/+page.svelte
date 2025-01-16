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

<div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 py-16 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<div class="bg-black/40 backdrop-blur-lg rounded-2xl shadow-[0_0_15px_rgba(0,149,255,0.1)] p-8 mb-16 border border-blue-500/20">
			<div class="text-center">
				<h1 class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6 tracking-tight leading-tight">
					Nathan Arthur
				</h1>
				<p class="text-2xl text-cyan-200/80 font-light tracking-wide">
					Full-stack web developer building tools for productivity
				</p>
			</div>
		</div>

		<div class="space-y-16">
			<section>
				<h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-8 text-center">
					Find Me Around the Web
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each profileLinks as link}
						<a
							href={link.url}
							class="group block p-6 bg-black/40 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(0,149,255,0.15)] hover:scale-[1.02] transition-all duration-200 text-center border border-blue-500/20 hover:border-blue-500/40"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span
								class="text-lg font-medium text-cyan-200/90 group-hover:text-cyan-300 transition-colors duration-200"
							>
								{link.name}
							</span>
						</a>
					{/each}
				</div>
			</section>

			<section>
				<h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-8 text-center">
					Projects I've Built
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each projectLinks as link}
						<a
							href={link.url}
							class="group block p-6 bg-black/40 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(0,149,255,0.15)] hover:scale-[1.02] transition-all duration-200 text-center border border-blue-500/20 hover:border-blue-500/40"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span
								class="text-lg font-medium text-cyan-200/90 group-hover:text-cyan-300 transition-colors duration-200"
							>
								{link.name}
							</span>
						</a>
					{/each}
				</div>
			</section>
		</div>
	</div>
</div>
