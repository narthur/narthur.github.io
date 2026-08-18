<script lang="ts">
	import '../app.css';
	import '@fontsource/instrument-sans/400.css'; // Regular
	import '@fontsource/instrument-sans/500.css'; // Medium
	import { dev } from '$app/environment';

	let { children } = $props();

	// TEMPORARY: accent picker, dev-only — `dev` is false in the build, so none of this
	// ships. Delete this block, the markup below it, and the import once a colour is chosen.
	const ACCENT_DEFAULT = '#8dee00';
	const presets = [
		{ name: 'lime', hex: '#8dee00' },
		{ name: 'teal', hex: '#5ecfc0' },
		{ name: 'periwinkle', hex: '#a5b4fc' },
		{ name: 'green', hex: '#7ee787' },
		{ name: 'sky', hex: '#7fb3ff' },
		{ name: 'coral', hex: '#ff8b7e' },
		{ name: 'gold', hex: '#d9a05b' },
		{ name: 'mono', hex: '#e8e9ec' }
	];
	let accent = $state(ACCENT_DEFAULT);

	$effect(() => {
		document.documentElement.style.setProperty('--accent', accent);
	});

	const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
	function luminance(hex: string) {
		const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
		return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
	}
	const contrast = $derived(
		((luminance(accent) + 0.05) / (luminance('#0a0c10') + 0.05)).toFixed(2)
	);

	const footerLinks = [
		{ name: 'Uses', url: '/uses' },
		{ name: 'Substack', url: 'https://narthur.substack.com/' },
		{ name: 'Pine Peak Digital', url: 'https://pinepeakdigital.com/' },
		{ name: 'Stack Overflow', url: 'https://stackoverflow.com/users/937377/nathan-arthur' },
		{ name: 'Ko-fi', url: 'https://ko-fi.com/narthur' }
	];
</script>

<div class="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16 sm:px-8 sm:py-24">
	<main class="flex-grow">
		{@render children()}
	</main>

	<footer class="mt-24 border-t border-rule pt-8 text-sm text-mute">
		<p class="max-w-prose">
			I write a mostly-weekly newsletter — productivity tips and tools, AI news, and the random
			thoughts of a self-employed web developer with ADHD.
		</p>
		<div class="mt-4" data-supascribe-embed-id="128744500344" data-supascribe-subscribe></div>

		<ul class="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-faint">
			{#each footerLinks as link}
				<li>
					<a href={link.url} rel="noopener noreferrer">{link.name}</a>
				</li>
			{/each}
		</ul>
	</footer>
</div>

{#if dev}
	<!-- TEMPORARY dev-only accent picker. Delete with the script block above. -->
	<aside
		class="fixed bottom-4 right-4 z-50 rounded border border-rule bg-bg/95 p-3 font-mono text-xs text-mute shadow-lg backdrop-blur"
	>
		<div class="flex items-center gap-2">
			<input
				type="color"
				bind:value={accent}
				aria-label="Accent colour"
				class="h-7 w-7 cursor-pointer border border-rule bg-transparent p-0"
			/>
			<span class="text-ink">{accent}</span>
			<span class={Number(contrast) >= 4.5 ? 'text-accent' : 'text-red-400'}>
				{contrast}:1 {Number(contrast) >= 4.5 ? 'AA' : 'FAIL'}
			</span>
		</div>
		<div class="mt-2 flex flex-wrap gap-1">
			{#each presets as preset}
				<button
					onclick={() => (accent = preset.hex)}
					title={`${preset.name} ${preset.hex}`}
					aria-label={`Use ${preset.name}`}
					class="h-5 w-5 border {accent.toLowerCase() === preset.hex.toLowerCase()
						? 'border-ink'
						: 'border-rule'}"
					style="background: {preset.hex}"
				></button>
			{/each}
		</div>
	</aside>
{/if}

<style>
	:global(:root) {
		--accent: #8dee00;
	}

	:global(body) {
		margin: 0;
		background: #0a0c10;
		color: #e8e9ec;
		font-family: 'Instrument Sans', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(a:hover) {
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-underline-offset: 0.25em;
	}

	/* The palette is fully custom, so don't rely on the browser's default focus ring
	   being legible against it. */
	:global(a:focus-visible),
	:global(button:focus-visible),
	:global(summary:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
		border-radius: 1px;
	}

	/* Supascribe's theme ships a blue button, the only saturated thing on the page. It
	   exposes its palette as CSS variables but sets them from a runtime-injected stylesheet,
	   hence !important. ponytail: setting these colors in the Supascribe dashboard instead
	   would let this whole block be deleted. */
	:global([data-supascribe-subscribe] .custom-substack-widget) {
		--csw-primary-color: var(--accent) !important;
		--csw-text-color: #0a0c10 !important;
		--csw-input-color: transparent !important;
		--csw-input-text-color: #e8e9ec !important;
	}
</style>
