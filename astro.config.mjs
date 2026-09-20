import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

// Tailwind runs through postcss.config.js, which Vite picks up on its own — no integration needed.
export default defineConfig({
	site: 'https://nathanarthur.com',
	// Project pages are MDX so their charts and screenshots can sit inside the prose.
	integrations: [mdx()],
	// Emit /uses.html, not /uses/index.html, as the SvelteKit build did. Cloudflare serves the
	// latter at /uses/ and redirects /uses to it; this keeps every existing URL as-is.
	build: { format: 'file' },
	// Real highlighting beats a perfect palette match for code, so Shiki uses a preset rather
	// than the site's six tokens. vitesse-dark of the dark presets: its muted greens sit closest
	// to the accent, so code reads as part of the page. Its panel background is dropped in
	// Layout.astro, leaving the hairline border every other framed element here uses.
	markdown: { syntaxHighlight: 'shiki', shikiConfig: { theme: 'vitesse-dark' } }
});
