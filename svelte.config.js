import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// fallback emits build/404.html from +error.svelte. Without it adapter-static
		// writes nothing for unmatched paths and the host serves its own generic 404.
		adapter: adapter({ fallback: '404.html' })
	}
};

export default config;
