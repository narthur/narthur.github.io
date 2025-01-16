<script lang="ts">
	const links = [
		{ name: 'Ko-fi', url: 'https://ko-fi.com/narthur' },
		{ name: 'Pine Peak Digital', url: 'https://pinepeakdigital.com/' },
		{ name: 'TaskRatchet', url: 'http://taskratchet.com/' },
		{ name: 'Autodialer', url: 'https://autodial.taskratchet.com/' },
		{ name: 'GitHub', url: 'https://github.com/narthur' },
		{ name: 'StackOverflow', url: 'https://stackoverflow.com/users/937377/nathan-arthur' },
		{ name: 'Beeminder Dashboard', url: 'https://bm.taskratchet.com/' },
		{ name: 'Blog Posts', url: 'https://blog.beeminder.com/authors/Nathan%20Arthur' },
		{ name: 'Life', url: 'https://life.nathanarthur.com/' },
		{ name: 'Maze Gen', url: 'https://maze.nathanarthur.com/' },
		{ name: 'Bayes', url: 'https://bayes.nathanarthur.com/' },
		{ name: 'Codebuff Wizard', url: 'https://codebuff.nathanarthur.com/' }
	];
</script>

<div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl mx-auto">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">Nathan Arthur</h1>
			<p class="text-xl text-gray-600 mb-12">
				Full-stack web developer building tools for productivity
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each links as link}
				<a
					href={link.url}
					class="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200">
						{link.name}
					</span>
				</a>
			{/each}
		</div>
	</div>
</div>
