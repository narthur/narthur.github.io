import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import type { HmrContext } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), YamlHmr()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		fs: {
			allow: ['./data']
		}
	}
});

// SOURCE: https://www.reddit.com/r/sveltejs/comments/15i61h1/comment/jusdljf/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
function YamlHmr() {
	return {
		name: 'yaml-hmr',
		enforce: 'post' as const,
		handleHotUpdate({ file, server }: HmrContext) {
			if (file.endsWith('.yaml')) {
				server.ws.send({
					type: 'full-reload',
					path: '*'
				});
			}
		}
	};
}
