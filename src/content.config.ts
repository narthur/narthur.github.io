import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Newsletter posts, served at /writing/<file name>. Posts imported from Substack keep their
// Substack slug as the file name and their original URL in `substack`; new posts omit it.
const posts = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		date: z.coerce.date(),
		substack: z.url().optional()
	})
});

export const collections = { posts };
