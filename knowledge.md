# Nathan Arthur's Personal Website

## Purpose

Personal website for Nathan Arthur, a full-stack web developer.

Its job is **verification, not discovery**: almost everyone who lands here already
has a reason to look him up — a hiring manager holding his application, someone
who read a link. Design for a 30-second skim by that person. Evidence first,
ornament never.

## Technical Stack

- SvelteKit (Svelte 5) with `@sveltejs/adapter-static`
- Tailwind CSS
- Deployed to Cloudflare Workers static assets at nathanarthur.com

## Design Guidelines

- **Typographic, not card-based.** Structure comes from type scale, hairline
  rules, and whitespace. No boxes, no shadows, no rounded corners.
- **Dark only.** There is no light theme and no toggle. The full palette lives in
  `tailwind.config.js` as six tokens: `bg`, `ink`, `mute`, `faint`, `rule`,
  `accent`. Don't introduce colors outside those.
- `accent` resolves to the CSS variable `--accent`, declared once on `:root` in
  `+layout.svelte`. Change the accent there, not in the Tailwind config. Anything
  that needs the accent in plain CSS uses `var(--accent)` so it stays in step.
- Instrument Sans (400, 500) for prose and headings; the system mono stack for
  metadata — stack lists, dates, roles, section labels.
- Section labels are small mono, uppercase, wide tracking.
- Links are body-colored and underline on hover in `accent`. No hover lifts, no
  scroll effects, no entrance animations. Genuine controls (the `/uses` tag
  filter) may take a hover colour change and a `transition-colors`, because a
  control that gives no feedback is an accessibility problem, not restraint.
- **External links open in a new tab; internal ones don't.** Every `http(s)` link
  gets `target="_blank"` and `rel="noopener noreferrer"`; every in-site link gets
  neither. Use the `isExternal` helper rather than hardcoding, and check the
  footer — it is the one place this has drifted before.
- Every interactive element gets a visible `:focus-visible` outline — the palette
  is custom, so the browser default can't be assumed legible against it.
- All text tokens clear WCAG AA (4.5:1) against `bg`. Check any new colour before
  adding it; `faint` shipped at 3.27:1 once and had to be corrected.
- Measure stays readable (`max-w-prose`); the page column is `max-w-2xl`.
- Always set explicit width and height on images to prevent layout shift.

## Content Guidelines

- The positioning line under the name is also the home page's `<meta
name="description">` — `+page.svelte` derives one from the other, so editing
  the constant changes the search result too.
- Featured work is tiered: three entries get a role, a stack, a year range, and
  a real description. Everything else is a one-line "Also built" list.
- No "open to work" banner — current clients read this site.
- No hard-sell CTA. Contact is GitHub, LinkedIn, writing, and email, stated once.

## Structure

```text
src/
├── app.html                    # <head>, Supascribe loader script
└── routes/
    ├── +layout.svelte          # page column, footer, global link/focus styles
    ├── +layout.ts              # prerender: true (required for static build)
    ├── +page.svelte            # home: positioning, selected work, also built
    ├── +error.svelte           # 404; emitted as build/404.html by the adapter
    ├── audioverse/+page.svelte # AudioVerse case study
    ├── writing/+page.svelte    # newsletter + individual Beeminder articles
    └── uses/
        ├── +page.ts            # parses uses.yaml at build time
        ├── +page.svelte        # renders it; owns only the tag-filter state
        ├── filter.ts           # tag/category logic, the only tested code
        ├── filter.spec.ts
        └── uses.yaml           # the list itself
```

There is no nav and no components directory. Subpages carry a "← Nathan Arthur"
link, and the footer lives in the layout — its only consumer.

`+layout.svelte` carries a dev-only accent picker (colour input, presets, and a
live contrast readout). It is deliberate, not leftover scaffolding: `dev` is
false in the build so it tree-shakes away entirely. If you touch it, keep every
part behind `dev` — including effect _bodies_, since an ungated `$effect` is
emitted into the production bundle even when its markup is eliminated.

The favicon is self-hosted: `static/favicon.svg` is the source and
`static/favicon.png` is rendered from it as the fallback for browsers that don't
take SVG icons. Keep them in step. It carries a single letterform, not a
monogram — at the 16px browsers actually draw, two letters turn to mush.

## Newsletter embed

Supascribe, loaded via the script tag in `app.html` and mounted on the
`data-supascribe-subscribe` div in `+layout.svelte`. Its default theme is a blue
button; the layout's style block overrides the `--csw-*` CSS variables to match
the palette. Setting those colors in the Supascribe dashboard would let that
block be deleted.

## Build

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` (svelte-check) and `pnpm lint` (prettier + eslint) both run in CI
- `export const prerender = true` in `src/routes/+layout.ts` is required for the
  static build
- Don't use `@apply` in Svelte `<style>` blocks; use Tailwind classes in markup
  and plain CSS in `<style>` when needed

## Traffic

Zone-level analytics are in the Cloudflare dashboard. There is deliberately no
analytics script on the site.
