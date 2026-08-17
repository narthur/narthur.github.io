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
- Instrument Sans (400, 500) for prose and headings; the system mono stack for
  metadata — stack lists, dates, roles, section labels.
- Section labels are small mono, uppercase, wide tracking.
- Links are body-colored and underline on hover in `accent`. That is the entire
  interaction vocabulary — no transitions, no hover lifts, no scroll effects.
- Measure stays readable (`max-w-prose`); the page column is `max-w-2xl`.
- Always set explicit width and height on images to prevent layout shift.

## Content Guidelines

- The positioning line under the name does the most work on the page. Keep it
  specific and falsifiable; "full-stack web developer" is not a claim.
- Featured work is tiered: three entries get a role, a stack, a year range, and a
  real description. Everything else is a one-line "Also built" list.
- No "open to work" banner — current clients read this site.
- No hard-sell CTA. Contact is GitHub, LinkedIn, writing, and email, stated once.

## Structure

```
src/
├── app.html                    # <head>, Supascribe loader script
├── routes/
│   ├── +layout.svelte          # page column, global body/link styles
│   ├── +layout.ts              # prerender: true (required for static build)
│   ├── +page.svelte            # home: positioning, selected work, also built
│   ├── uses/+page.svelte       # /uses, reads static/data/uses.yaml at runtime
│   └── audioverse/+page.svelte # AudioVerse case study
└── components/Footer.svelte    # newsletter embed + secondary links
```

There is no nav component. Subpages carry a "← Nathan Arthur" link instead.

## Newsletter embed

Supascribe, loaded via the script tag in `app.html` and mounted on the
`data-supascribe-subscribe` div in `Footer.svelte`. Its default theme is a blue
button; `Footer.svelte` overrides the `--csw-*` CSS variables to match the
palette. Setting those colors in the Supascribe dashboard would let that block be
deleted.

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
