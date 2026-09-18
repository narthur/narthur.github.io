# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Nathan Arthur's personal website: a small static Astro site — a home page,
`/writing` plus the newsletter posts under it, `/uses`, and one case study —
deployed to Cloudflare Workers assets at nathanarthur.com. See `knowledge.md`
for the design and content rules and the file layout; they are load-bearing,
not decoration.

## Development Commands

```bash
pnpm install       # project uses pnpm
pnpm dev           # dev server (avoid in WARP to prevent blocking)
pnpm build         # static build into ./dist
pnpm preview       # preview the production build
pnpm check         # astro check
pnpm test          # vitest, single run
pnpm lint          # prettier --check + eslint
pnpm format        # prettier --write
```

Astro needs Node >= 22.19.

## Architecture

- **Astro**, static output, no UI framework. TypeScript, Tailwind CSS (no
  plugins, run through `postcss.config.js`), Vitest, ESLint + Prettier.
- **No first-party runtime fetching.** `/uses` reads `src/uses/uses.yaml` at
  build time (Vite `?raw` import, parsed with js-yaml), so the whole list is in
  the HTML. The tag filter is the site's only first-party client JS: a
  `<script>` in `uses.astro` that hides what the build rendered. The one
  third-party script is the Supascribe newsletter loader in `Layout.astro`.
- Page content — the positioning line, featured work, "also built" — is plain
  data in each page's frontmatter. There is no CMS.
- The newsletter lives here. Posts are Markdown in `src/content/posts/`, an
  Astro content collection (`src/content.config.ts`) rendered by
  `src/pages/writing/[slug].astro` and fed by `src/pages/rss.xml.ts` (feed readers) and `newsletter.xml.ts` (email), both built by `src/feed.ts`. To
  publish, add a file; see `knowledge.md`.

## Styling

- **Tailwind first** — utility classes directly in markup.
- **Dark only.** No light theme, no `dark:` variants, no toggle. The palette is
  six tokens in `tailwind.config.js`: `bg`, `ink`, `mute`, `faint`, `rule`,
  `accent`. `accent` resolves to `--accent`, declared on `:root` in
  `Layout.astro` — change the accent there, not in the Tailwind config.
- Global element styles live in the layout's `<style is:global>` block.

## Build and deployment

- `src/pages/404.astro` builds to `dist/404.html`; `wrangler.jsonc` sets
  `not_found_handling: "404-page"` so Cloudflare serves it for unmatched paths.
- Deployed via GitHub Actions (`.github/workflows/deploy.yml`) on push to
  `master`. Requires repo secrets `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID`.

## Testing

The only tested code is `src/uses/filter.ts` — pure tag/category functions.
Everything else is markup, and there is deliberately no component-test or e2e
harness. Use `pnpm test` (single run) rather than watch mode.

## Common gotchas

1. **Package manager**: always `pnpm`, never `npm` or `yarn`.
2. **Supascribe**: the newsletter widget themes itself via `--csw-*` CSS
   variables, overridden in `Layout.astro`. If the button turns blue, that
   override broke.
3. **`tailwind.config.js` edits do not hot-reload.** Vite keeps the previously
   generated CSS, so utility classes keep the old value while plain-CSS rules
   pick up the new one. Restart `pnpm dev`.
4. **Dropped spaces before links**: see the Build section of `knowledge.md`.
5. **`pnpm preview` does not reproduce production 404s.** For an unknown path it
   serves Astro's generic "404: Not Found" page, not `dist/404.html`, and a plain
   static file server won't serve `404.html` either. To check what Cloudflare
   will actually serve, run `npx wrangler dev` after a build — it applies
   `wrangler.jsonc`'s `not_found_handling` — or check the deployed site.
