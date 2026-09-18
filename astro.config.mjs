import { defineConfig } from 'astro/config';

// Tailwind runs through postcss.config.js, which Vite picks up on its own — no integration needed.
export default defineConfig({
	site: 'https://nathanarthur.com',
	// Emit /uses.html, not /uses/index.html, as the SvelteKit build did. Cloudflare serves the
	// latter at /uses/ and redirects /uses to it; this keeps every existing URL as-is.
	build: { format: 'file' },
	// Shiki paints code blocks with its own theme colours, outside the site's six-token palette.
	markdown: { syntaxHighlight: false }
});
