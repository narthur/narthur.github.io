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

<div class="digital-rain pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
	{#each Array(100) as _, i}
		<div
			class="rain-line"
			style="--delay: {Math.random() * 4}s; --duration: {2 +
				Math.random() * 2}s; --position: {Math.random() * 300}%;"
		></div>
	{/each}
</div>

<div
	class="relative min-h-screen bg-[#0a0a16] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTExMjIiLz48L3N2Zz4=')] px-4 py-16 selection:bg-cyan-500 selection:text-black sm:px-6 lg:px-8"
>
	<div class="relative z-10 mx-auto max-w-4xl">
		<div
			class="mb-16 animate-[pulse_4s_ease-in-out_infinite] rounded-none border-2 border-cyan-500/50 bg-black/60 p-8 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-sm transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.25)]"
		>
			<div class="text-center">
				<h1
					class="mb-6 animate-[text-flicker_8s_ease-in-out_infinite] bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-6xl font-black leading-tight tracking-tight text-transparent [text-shadow:_0_0_30px_rgb(6_182_212_/_50%)]"
				>
					Nathan Arthur
				</h1>
				<p
					class="typewriter-text relative inline-block font-mono text-2xl tracking-wide text-cyan-400/90 after:animate-[blink_1s_step-end_infinite] after:content-['_']"
				>
					&lt;Full-stack web developer /&gt;
				</p>
			</div>
		</div>

		<div class="space-y-16">
			<section>
				<h2
					class="mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-center text-3xl font-bold text-transparent [text-shadow:_0_0_30px_rgb(6_182_212_/_50%)]"
				>
					[Find Me Around the Web]
				</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each profileLinks as link}
						<a
							href={link.url}
							class="group relative block overflow-hidden rounded-none border-2 border-cyan-500/30 bg-black/60 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div
								class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<span
								class="font-mono text-lg text-cyan-400/90 transition-colors duration-200 group-hover:text-cyan-300"
							>
								&gt; {link.name}
							</span>
						</a>
					{/each}
				</div>
			</section>

			<section>
				<h2
					class="mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-center text-3xl font-bold text-transparent [text-shadow:_0_0_30px_rgb(6_182_212_/_50%)]"
				>
					[Projects I've Built]
				</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each projectLinks as link}
						<a
							href={link.url}
							class="group relative block overflow-hidden rounded-none border-2 border-cyan-500/30 bg-black/60 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div
								class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<span
								class="font-mono text-lg text-cyan-400/90 transition-colors duration-200 group-hover:text-cyan-300"
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
	@keyframes text-flicker {
		0%,
		100% {
			opacity: 1;
		}
		95% {
			opacity: 1;
		}
		95.1% {
			opacity: 0;
		}
		95.2% {
			opacity: 1;
		}
		95.3% {
			opacity: 0;
		}
		95.4% {
			opacity: 1;
		}
		95.5% {
			opacity: 0;
		}
		95.6% {
			opacity: 1;
		}
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	@keyframes rain {
		0% {
			transform: translateY(-100vh) translateX(0) rotate(25deg) scale(2);
			opacity: 0;
		}
		5% {
			opacity: 0.2;
		}
		90% {
			opacity: 0.2;
		}
		100% {
			transform: translateY(200vh) translateX(-140vh) rotate(25deg) scale(2);
			opacity: 0;
		}
	}

	.digital-rain {
		z-index: 1;
		mix-blend-mode: screen;
	}

	.rain-line {
		opacity: 0;
		position: absolute;
		top: 0;
		left: var(--position);
		animation: rain var(--duration) linear infinite;
		animation-delay: var(--delay);
		width: 1px;
		height: 400px;
		background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.5), transparent);
		transform-origin: 0 0;
		box-shadow: 0 0 8px rgba(6, 182, 212, 0.3);
	}

	.typewriter-text {
		border-right: 2px solid transparent;
	}
</style>
