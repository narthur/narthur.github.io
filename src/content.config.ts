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

// Project detail pages, served at /<file name>. The page's name, years, and role line come
// from the work.yaml entry whose url is /<file name>; the body's ## headings are its sections.
// `lanes` groups the repositories in src/work/commits/<file name>.json into the rows its
// commit charts draw.
const projects = defineCollection({
	loader: glob({ pattern: '*.mdx', base: './src/content/projects' }),
	schema: z.object({
		note: z.string().optional(),
		lanes: z.array(z.object({ name: z.string(), repos: z.array(z.string()).min(1) })).optional()
	})
});

export const collections = { posts, projects };
