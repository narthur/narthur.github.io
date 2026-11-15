---
title: 'Add a sitemap to an Astro site'
date: 2026-11-19
link: https://docs.astro.build/en/guides/integrations-guide/sitemap/
---

Astro's official sitemap integration builds `sitemap-index.xml`, which links to the numbered sitemap files. Crawlers use them to find every page. The integration needs a `site` URL in the config and runs only at build time.

Install it with `pnpm astro add sitemap`, then point crawlers at the index from `public/robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://nathanarthur.com/sitemap-index.xml
```

Every page is in the sitemap by default. A `filter` function removes the pages that should stay out:

```js
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://nathanarthur.com',
	integrations: [sitemap({ filter: (page) => !/\/(404|band-render|card-render)$/.test(page) })]
});
```

That is a trimmed copy of this site's config, which Nathan wrote. It leaves out `/404`, because the host serves it at every missing URL. It also leaves out `/band-render` and `/card-render`, build-only pages that the build scripts delete from the output afterward. A new page that should not be indexed needs adding to that filter.

One caveat: this site is hosted on Cloudflare, which adds its own block to the served `robots.txt`. So the file in `public/` holds only the site's own lines.

Check the config for a `site` value, add the integration, and run a build. Then look for the sitemap files in the output folder.
