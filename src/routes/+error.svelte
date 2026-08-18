<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Nathan Arthur</title>
	<meta name="description" content="That page doesn't exist." />
</svelte:head>

<h1 class="text-4xl font-medium tracking-tight">{page.status}</h1>
<p class="mt-5 max-w-prose leading-relaxed text-mute">
	{page.error?.message ?? "That page doesn't exist."}
</p>
<p class="mt-8 font-mono text-xs uppercase tracking-widest text-faint">
	<a href="/">&larr; Nathan Arthur</a>
</p>
