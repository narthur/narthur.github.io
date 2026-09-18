# Nathan Arthur's Personal Website

## Purpose

Personal website for Nathan Arthur, a full-stack web developer.

Its job is **verification, not discovery**: almost everyone who lands here already
has a reason to look him up — a hiring manager holding his application, someone
who read a link. Design for a 30-second skim by that person. Evidence first,
ornament never.

## Technical Stack

- Astro, static output, no UI framework
- Tailwind CSS (v3, via PostCSS)
- Deployed to Cloudflare Workers static assets at nathanarthur.com

## Design Guidelines

- **Typographic, not card-based.** Structure comes from type scale, hairline
  rules, and whitespace. No boxes, no shadows, no rounded corners.
- **Dark only.** There is no light theme and no toggle. The full palette lives in
  `tailwind.config.js` as six tokens: `bg`, `ink`, `mute`, `faint`, `rule`,
  `accent`. Don't introduce colors outside those.
- `accent` resolves to the CSS variable `--accent`, declared once on `:root` in
  `Layout.astro`. Change the accent there, not in the Tailwind config. Anything
  that needs the accent in plain CSS uses `var(--accent)` so it stays in step.
- Instrument Sans (400, 500) for prose and headings; the system mono stack for
  metadata — stack lists, dates, roles, section labels.
- Section labels are small mono, uppercase, wide tracking.
- Links are body-colored and underline on hover in `accent`. No hover lifts, no
  scroll effects, no entrance animations. Genuine controls (the `/uses` tag
  filter) may take a hover colour change and a `transition-colors`, because a
  control that gives no feedback is an accessibility problem, not restraint.
- **Every link opens in the same tab.** No `target="_blank"` anywhere, external
  or not, and therefore no `rel="noopener noreferrer"`. "It's external" is not a
  reason to take the tab away from the reader; nothing here is a form, editor, or
  checkout worth protecting, and anyone wanting a new tab can middle-click.
  `noreferrer` in particular was actively costing us: it strips the `Referer`
  header even on same-tab navigation, so Substack and Pine Peak Digital could not
  see this site as a traffic source. If a future link genuinely needs a new tab,
  it gets `rel="noopener"` — not `noreferrer` — plus a visible cue in the label.
- Every interactive element gets a visible `:focus-visible` outline — the palette
  is custom, so the browser default can't be assumed legible against it.
- All text tokens clear WCAG AA (4.5:1) against `bg`. Check any new colour before
  adding it; `faint` shipped at 3.27:1 once and had to be corrected.
- Measure stays readable (`max-w-prose`); the page column is `max-w-2xl`.
- Always set explicit width and height on images to prevent layout shift.

## Content Guidelines

- The positioning line under the name is also the home page's `<meta
name="description">` — `index.astro` derives one from the other, so editing
  the constant changes the search result too.
- Featured work is tiered: three entries get a role, a stack, a year range, and
  a real description. Everything else is a one-line "Also built" list.
- No "open to work" banner — current clients read this site.
- No hard-sell CTA. Contact is GitHub, LinkedIn, writing, and email, stated once.

## Structure

```text
src/
├── app.css                     # Tailwind entry point
├── layouts/
│   ├── Layout.astro            # <head>, column, footer, global styles
│   └── AccentPicker.astro      # dev-only accent picker
├── pages/
│   ├── index.astro             # home: positioning, selected work, also built
│   ├── 404.astro               # emitted as dist/404.html
│   ├── audioverse.astro        # AudioVerse case study
│   ├── writing.astro           # newsletter, Beeminder articles, newsletter archive
│   ├── writing/[slug].astro    # one newsletter post
│   └── uses.astro              # renders uses.yaml; its <script> is the tag filter
├── content.config.ts           # the `posts` collection schema
├── content/posts/*.md          # newsletter posts, imported from Substack
└── uses/
    ├── filter.ts               # tag/category logic, the only tested code
    ├── filter.spec.ts
    └── uses.yaml               # the list itself
```

Newsletter posts were imported from a Substack export (2026-09-18): one
Markdown file per post, named by its Substack slug, so `/writing/<slug>`
mirrors `narthur.substack.com/p/<slug>`. Frontmatter is `title`, optional
`subtitle`, `date`, and `substack` (the original URL). Images live in
`public/writing/<slug>/` as downloaded WebP (GIFs kept as GIFs) and are
written as raw `<figure><img width height>` HTML in the Markdown, so they keep
explicit dimensions. Links between posts point at the local copies. Post body
styles are in `writing/[slug].astro`, built from the palette tokens; syntax
highlighting is off because Shiki brings its own colours.

`src/uses/` lives outside `pages/` because Astro treats every `.ts` file under
`pages/` as an endpoint.

There is no nav and no components directory. Subpages carry a "← Nathan Arthur"
link, and the footer lives in the layout — its only consumer.

`Layout.astro` renders a dev-only accent picker (colour input, presets, and a
live contrast readout) behind `import.meta.env.DEV`. It is deliberate, not
leftover scaffolding, and it never reaches the build. Keep its script
`is:inline`: a processed `<script>` is bundled into the build whether or not the
component renders.

The favicon is self-hosted: `public/favicon.svg` is the source and
`public/favicon.png` is rendered from it as the fallback for browsers that don't
take SVG icons. Keep them in step. It carries a single letterform, not a
monogram — at the 16px browsers actually draw, two letters turn to mush.

## Newsletter embed

Supascribe, loaded via the script tag in `Layout.astro` and mounted on the
`data-supascribe-subscribe` div in its footer. Its default theme is a blue
button; the layout's global style block overrides the `--csw-*` CSS variables
to match the palette. Setting those colors in the Supascribe dashboard would
let that block be deleted.

## Build

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` (astro check), `pnpm lint` (prettier + eslint), and `pnpm test`
  all run in CI
- `build.format: 'file'` in `astro.config.mjs` emits `uses.html` rather than
  `uses/index.html`, so Cloudflare serves `/uses` directly instead of
  redirecting it to `/uses/`
- Astro drops the whitespace between a line of text and an element that starts
  the next line (`Inspired by` ⏎ `<a>` renders as `Inspired by<a>`). Where
  prettier breaks a link onto its own line, keep the space with `{' '}`

## Traffic

Zone-level analytics are in the Cloudflare dashboard. There is deliberately no
analytics script on the site.
