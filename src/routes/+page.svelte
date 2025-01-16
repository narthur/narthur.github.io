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
		{ name: 'Bayes', url: 'https://bayes.nathanarthur.com/' },
		{ name: 'Codebuff Wizard', url: 'https://codebuff.nathanarthur.com/' }
	];
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 border border-gray-700">
			<div class="text-center">
				<h1 class="text-5xl font-bold text-white mb-4 tracking-tight">Nathan Arthur</h1>
				<p class="text-xl text-gray-300 font-light">
					Full-stack web developer building tools for productivity
				</p>
			</div>
		</div>

		<div class="space-y-12">
			<section>
				<h2 class="text-2xl font-semibold text-white mb-6 text-center">Find Me Around the Web</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each profileLinks as link}
						<a
							href={link.url}
							class="group block p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-center border border-gray-700"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span
								class="text-lg font-medium text-gray-200 group-hover:text-blue-400 transition-colors duration-200"
							>
								{link.name}
							</span>
						</a>
					{/each}
				</div>
			</section>

			<section>
				<h2 class="text-2xl font-semibold text-white mb-6 text-center">Projects I've Built</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each projectLinks as link}
						<a
							href={link.url}
							class="group block p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-center border border-gray-700"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span
								class="text-lg font-medium text-gray-200 group-hover:text-blue-400 transition-colors duration-200"
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
