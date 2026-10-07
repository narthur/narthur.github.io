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

# Renders a Band Sketch without a browser, for writing one. No `--` before the
# flags: pnpm 10 forwards them as-is and treats `--` as a positional.
#
#   vector Sketch -> .band-preview.svg + .band-preview.html. Open the HTML: it tiles
#     each seed at the size and repeat the post page uses, with a title over it, and
#     is byte-for-byte what ships.
#   raster Sketch -> .band-preview.png, seeds stacked. An approximation — its own
#     PRNG, so tune parameters with it and still pick the Seed in the dev picker.
pnpm band-preview --sketch=hopfield --seeds=1,2,3
```

Astro needs Node >= 22.19.

## Architecture

- **Astro**, static output, no UI framework. TypeScript, Tailwind CSS (no
  plugins, run through `postcss.config.js`), Vitest, ESLint + Prettier.
- **Content is rendered at build time.** `/uses` reads `src/uses/uses.yaml` at
  build time (Vite `?raw` import, parsed with js-yaml), so the whole list is in
  the HTML; its tag filter only hides what the build rendered. The one runtime
  fetch is `/taskratchet`'s live stats: `TaskRatchetStats.astro` renders the
  public TaskRatchet API's counters at build time, then refetches them in the
  browser so they stay current between deploys. Two third-party scripts load:
  Cloudflare Turnstile in `Layout.astro`, guarding the newsletter form, and
  giscus on newsletter posts, which backs comments with this repo's GitHub
  Discussions. Embedded sketches in `public/writing/<slug>/` load p5.js
  from jsDelivr inside their own iframe.
- Page content — the positioning line, featured work, "also built" — is plain
  data in each page's frontmatter. There is no CMS.
- The newsletter lives here. Posts are Markdown in `src/content/posts/`, an
  Astro content collection (`src/content.config.ts`) rendered by
  `src/pages/writing/[slug].astro` and fed by `src/pages/rss.xml.ts`. To
  publish, add a file; see `knowledge.md`.

## Styling

- **Tailwind first** — utility classes directly in markup.
- **Dark only.** No light theme, no `dark:` variants, no toggle. The palette is
  seven tokens in `tailwind.config.js`: `bg`, `ink`, `mute`, `faint`, `rule`,
  `accent`, `warn`. `accent` resolves to `--accent`, declared on `:root` in
  `Layout.astro` — change the accent there, not in the Tailwind config. Code
  blocks are the one exception: they use a Shiki preset, see `knowledge.md`.
- Global element styles live in the layout's `<style is:global>` block.

## Build and deployment

- `src/pages/404.astro` builds to `dist/404.html`; `wrangler.jsonc` sets
  `not_found_handling: "404-page"` so Cloudflare serves it for unmatched paths.
- Deployed via GitHub Actions (`.github/workflows/deploy.yml`) on push to
  `master`. Requires repo secrets `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID`.

## Testing

Pure logic modules are tested; markup is not, and there is deliberately no
component-test or e2e harness. Currently that means `src/uses/filter.ts`
(tag/category functions), `src/work/*` (chart, commits, taskratchet),
`src/bands/hopfield.ts` (the Band simulation and its geometry) and
`src/bands/vector.ts` (contour tracing and SVG). Use `pnpm test` (single run)
rather than watch mode.

A Band Sketch is worth testing despite being a picture: its failures are silent —
a net that never settles still renders a plausible-looking wash — so the suite
asserts the invariants instead of relying on someone glancing at the strip.
`vector.ts` is tested against fields whose contour is known in closed form, a
circle and a plane, because "the picture changed" says nothing about whether the
geometry is right while "the circle came out round" does.

Where a test's comment claims it catches a particular regression, that claim has
been checked by making the regression and watching the test fail. If a test
asserts a contract but does not actually catch the mutation, its comment says so
rather than implying coverage it does not have.

## Common gotchas

1. **Package manager**: always `pnpm`, never `npm` or `yarn`.
2. **`tailwind.config.js` edits do not hot-reload.** Vite keeps the previously
   generated CSS, so utility classes keep the old value while plain-CSS rules
   pick up the new one. Restart `pnpm dev`.
3. **Dropped spaces before links**: see the Build section of `knowledge.md`.
4. **`pnpm preview` does not reproduce production 404s.** For an unknown path it
   serves Astro's generic "404: Not Found" page, not `dist/404.html`, and a plain
   static file server won't serve `404.html` either. To check what Cloudflare
   will actually serve, run `npx wrangler dev` after a build — it applies
   `wrangler.jsonc`'s `not_found_handling` — or check the deployed site.
