# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Nathan Arthur's personal website: a small static SvelteKit site — a home page, a
`/uses` page, and one case study — deployed to Cloudflare Workers static assets
at nathanarthur.com. See `knowledge.md` for the design and content rules; they
are load-bearing, not decoration.

## Development Commands

```bash
pnpm install       # project uses pnpm
pnpm dev           # dev server (avoid in WARP to prevent blocking)
pnpm build         # static build into ./build
pnpm preview       # preview the production build
pnpm check         # svelte-check
pnpm check:watch
pnpm test          # vitest, single run
pnpm lint          # prettier --check + eslint
pnpm format        # prettier --write
```

## Architecture

### Static site generation

- **SvelteKit 5** with `@sveltejs/adapter-static`
- Pre-rendering enabled via `export const prerender = true` in `src/routes/+layout.ts`
- **No runtime data fetching at all.** `/uses` reads `src/routes/uses/uses.yaml`
  at build time in `+page.ts` (Vite `?raw` import, parsed with js-yaml), so it
  prerenders to static HTML and renders with JS disabled

### Technology stack

- SvelteKit 5, TypeScript, Tailwind CSS (no plugins), Vite, Vitest, ESLint + Prettier

### Project structure

```text
src/
├── app.html                    # <head> and the Supascribe loader script
├── app.css                     # Tailwind entry point
└── routes/
    ├── +layout.svelte          # page column, footer, global link/focus styles
    ├── +layout.ts              # prerender: true
    ├── +page.svelte            # home page (content lives in this file)
    ├── audioverse/+page.svelte
    └── uses/
        ├── +page.ts            # parses uses.yaml at build time
        ├── +page.svelte        # renders it; owns only the tag-filter state
        ├── filter.ts           # tag/category logic — the only tested code
        ├── filter.spec.ts
        └── uses.yaml
```

There is no `src/components/`. The footer lives in the layout, its only consumer.

Home page content — the positioning line, featured work, "also built" — is plain
data at the top of `src/routes/+page.svelte`. Editing the site's content means
editing those arrays; there is no CMS.

## Development patterns

### SvelteKit conventions

- `+page.svelte` for pages, `+layout.svelte` for layouts
- PascalCase for `.svelte` component filenames

### Styling

- **Tailwind first** — utility classes directly in markup
- **Dark only.** There is no light theme, no `dark:` variants, and no toggle.
  The palette is six tokens in `tailwind.config.js`: `bg`, `ink`, `mute`,
  `faint`, `rule`, `accent`. Don't add colors outside them.
- **No `@apply`** in Svelte `<style>` blocks; use plain CSS there when a utility
  won't do
- Mono is the system stack (`font-mono`), used for metadata and section labels

## Build configuration

- `svelte.config.js`: `@sveltejs/adapter-static` with `fallback: '404.html'`, so
  `+error.svelte` is emitted as `build/404.html`. `wrangler.jsonc` sets
  `not_found_handling: "404-page"` so Cloudflare serves it for unmatched paths.
  The fallback is a client-rendered shell: it has no title until JS runs, which
  is an accepted trade for a page that should never be indexed.
- `vite.config.ts`: the SvelteKit plugin and the Vitest include pattern
- `tailwind.config.js`: content paths, color tokens, font families. No plugins.

## Deployment

Deployed via GitHub Actions (`.github/workflows/deploy.yml`) on push to `master`.
`wrangler.jsonc` serves `./build` as static assets with `nathanarthur.com` /
`www.nathanarthur.com` as custom domains. Requires repo secrets
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

Pre-deployment: `pnpm build`, then verify `./build/`.

## Testing

- Vitest configured in `vite.config.ts`. The only tested code is
  `src/routes/uses/filter.ts` — pure tag/category functions with no Svelte
  involved. Everything else on this site is markup, and there is deliberately no
  component-test or e2e harness.
- Use `pnpm test` (single run) rather than watch mode

## Common gotchas

1. **Static prerendering**: `export const prerender = true` must stay in the root
   layout
2. **Dev server**: avoid starting dev servers in WARP to prevent execution blocking
3. **Package manager**: always `pnpm`, never `npm` or `yarn`
4. **`pnpm preview` does not reproduce production 404s.** SvelteKit replaces
   Vite's preview middleware with its own, so preview applies SvelteKit routing
   and server-renders `+error.svelte` for unknown paths. Verified: with `build/`
   containing no `404.html` at all, `pnpm preview` still returned a fully
   rendered "404 — Nathan Arthur" page. A static host has no such fallback. To
   check what production will actually serve, build and serve `build/` with a
   plain static file server.
5. **Supascribe**: the newsletter widget themes itself via `--csw-*` CSS variables,
   overridden in `+layout.svelte`. If the button turns blue, that override broke.
