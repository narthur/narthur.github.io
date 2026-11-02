---
title: 'Check the numbers before picking a framework for your coding agent'
link: https://nolanlawson.com/2026/10/28/the-ai-cost-of-javascript-frameworks/
date: 2026-11-02
---

"Better for agents" has become a common reason to switch frontend frameworks, usually with no data behind it. [The AI cost of JavaScript frameworks](https://nolanlawson.com/2026/10/28/the-ai-cost-of-javascript-frameworks/) supplies some. It had Claude Opus 5.5 build the same small Pokémon app five times in each of 12 frameworks, checked every result against a conformance suite, then measured cost, time, tokens, Lighthouse scores and lines of code.

Hono with htmx, Astro and Nuxt were the cheapest to build, at under $3 a run. SvelteKit, Gracile with Lit, and Angular cost the most. With SvelteKit and Gracile, the agent spent tokens learning a framework version or a framework it didn't know well. Lighthouse performance and accessibility came out near perfect for almost every framework, so the bigger differences were in JavaScript shipped: Astro sent close to none, Next.js about 142 KiB. Plain Vite with no framework did worse than several frameworks.

The results are noisy. The same framework could vary by more than a dollar between runs, and agents often ignored the official MCP servers and skill files installed for them.

To use it:

1. Look up your framework, or the one being pitched, in the cost and JavaScript-size tables.
2. If your app looks nothing like a small, content-heavy site, treat the numbers as a starting point and run the published benchmark against your own spec.
3. If you run it, run each framework several times. One run says little.

Before the next rewrite pitched as "better for agents," ask for numbers like these.
