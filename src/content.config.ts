import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Newsletter posts, imported from a Substack export. Each file's name is its Substack slug,
// so /writing/<slug> mirrors narthur.substack.com/p/<slug>.
const posts = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		date: z.coerce.date(),
		substack: z.url()
	})
});

export const collections = { posts };
