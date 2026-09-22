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
  `tailwind.config.js` as seven tokens: `bg`, `ink`, `mute`, `faint`, `rule`,
  `accent`, `warn`. Don't introduce colors outside those. The one exception is
  syntax highlighting, which uses a Shiki preset — see the post body styles
  below.
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
  The section list on a project page is a control too: its marker for the
  section being read changes colour with a `motion-safe:transition-colors`.
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
- The home page is one screen and lists no projects: three signposts (Work,
  Writing, Uses) point at the pages that do. `/work` carries the tiering —
  `emphasis: featured` entries lead, the rest follow one line each.
- No "open to work" banner — current clients read this site.
- No hard-sell CTA. Contact on the home page is GitHub, LinkedIn and email,
  stated once; Writing is a signpost rather than a contact link.
- Pages carrying AI-drafted prose say so, through `ai: true` in a project's or
  post's frontmatter or the `ai` prop on `Layout`. See `CLAUDE.md`.

## Structure

```text
src/
├── app.css                     # Tailwind entry point
├── layouts/
│   ├── Layout.astro            # <head>, column, footer, global styles
│   └── AccentPicker.astro      # dev-only accent picker
├── pages/
│   ├── index.astro             # home: avatar, positioning, contact, signposts, latest post
│   ├── 404.astro               # emitted as dist/404.html
│   ├── [project].astro         # a project page per src/content/projects/*.mdx
│   ├── work.astro              # every project, the stack over time, GitHub activity
│   ├── writing.astro           # newsletter post list, Beeminder articles
│   ├── writing/[slug].astro    # one newsletter post
│   ├── rss.xml.ts              # public RSS feed, footer for feed readers
│   ├── newsletter.xml.ts       # same feed, email footer; read by rss-to-email-worker
│   └── uses.astro              # renders uses.yaml; its <script> is the tag filter
├── feed.ts                     # builds both feeds; each passes its own footer
├── content.config.ts           # the `posts` and `projects` collection schemas
├── content/posts/*.md          # newsletter posts
├── content/projects/*.mdx      # project pages: prose with charts and screenshots
├── uses/
│   ├── filter.ts               # tag/category logic
│   ├── filter.spec.ts
│   └── uses.yaml               # the list itself
└── work/
    ├── work.yaml               # projects and stack spans for /work
    ├── work.ts                 # loads work.yaml
    ├── activity.json           # monthly GitHub counts, written by `pnpm activity`
    ├── chart.ts                # chart geometry (scale, bars, waveform path)
    ├── chart.spec.ts
    ├── commits.ts              # tallies and sums for the project commit charts
    ├── commits.spec.ts
    ├── commits/<project>.json  # monthly commits per repo, written by `pnpm project-stats`
    ├── project.ts              # what a project page's charts share
    ├── detail/                 # project page components: charts and <Shot>
    ├── shots.ts                # screenshot lookup by path
    └── shots/<project>/        # screenshots, shown on project pages
```

`/work` is the one page on the wider `max-w-4xl` column (`<Layout wide>`), because its
charts need the room. The activity waveform and stack chart share a time scale from the
first year in `activity.json` to its last month. The stack chart sits `mx-5` inside the
column so the dotted marks for spans running past either end of the axis fit; the
waveform runs the column's full width, its end labels anchored inside its own box. Each activity layer is scaled to its
own peak. Three of its four layers come from GitHub's per-type counts
(`totalCommitContributions` and friends), which cover **public repositories only** — for 2019
that was 1,004 of 5,491 contributions. The fourth, `private`, is computed as the remainder of
the contribution calendar, not fetched, which is what makes the four exhaustive: a fetched
bucket would drop public issues (85-191 a year lately) and anything GitHub adds later. It is
mostly private client work, and it also carries the 2016-2019 SimpleUpdates work, made under
`su-narthur`, an account whose email is gone and which therefore can't be logged into; its
contribution _calendar_ is public even so, which is the only reason those years register at
all. Repositories in the script's `EXCLUDE` list are subtracted month by month — currently
`tw-todo`, a taskwarrior-to-git sync whose 4,509 machine commits, over five months of 2019,
otherwise buried everything real that year. The committed file is also a **floor**: a finished month is never written lower
than it already reads, because GitHub stops counting a deleted or newly-private repository and
this file is the only record once that happens. `ACTIVITY_REBUILD=1` drops the floor, for when
a field legitimately means something new. To refresh, run `pnpm activity` (needs `gh` logged in
as narthur) and commit `activity.json`; the deploy has no GitHub token, so it is not fetched at
build time. In `work.yaml`, `end: now` means ongoing, a year means ended that year,
and no `end` means a single year. Screenshots named in `work.yaml` live under
`src/work/shots/` (a missing one fails the build); project pages use them too.

A project page is `src/content/projects/<name>.mdx`, served at `/<name>`. Its name,
years, role line, and meta description come from the `work.yaml` entry whose `url` is
`/<name>`, so they are never written twice. Each `##` heading starts a section and
becomes an entry in the sticky "On this page" list, which marks the section being read.
A section holds prose, a chart, or a `<Shot>`; put each chart inside the prose it
illustrates rather than grouping them. The charts (`<CommitsPerMonth>`, `<Repositories>`,
`<CommitShare>`, in `src/work/detail/`) read `src/work/commits/<name>.json`, and the
page's `lanes` frontmatter groups its repositories into rows; any repository no lane names
lands in an automatic "Other repositories" row, so the three charts count the same commits. That JSON comes from local
clones, not GitHub, because client repos can become unreachable: run
`pnpm project-stats <name> <repo dir>...` (archived clones work) and commit the result.
It holds counts only, split into mine and everyone else's, never names or emails, so
other contributors stay off the site.

The newsletter lives here: this site is its primary home, having moved off
Substack in September 2026. Each post is a Markdown file in
`src/content/posts/`, served at `/writing/<file name>`. Frontmatter is
`title`, optional `subtitle`, `date`, and optional `substack`. To publish a
post, add a file; it appears on `/writing` and in `/rss.xml` automatically.

The posts written before the move were imported from a Substack export
(2026-09-18). They keep their Substack slug as the file name, so
`/writing/<slug>` mirrors `narthur.substack.com/p/<slug>`, and their original
URL in `substack`, which the post page shows as "Originally on Substack". New
posts leave `substack` out. Imported images live in `public/writing/<slug>/`
as WebP (GIFs kept as GIFs), written as raw `<figure><img width height>` HTML
in the Markdown so they keep explicit dimensions; follow the same pattern for
new images. Post body styles are in `writing/[slug].astro`, built from the
palette tokens. Code blocks are the one place outside the palette: Shiki
highlights them with the `one-dark-pro` preset, and `.post pre` drops the
preset's panel background so the block keeps the hairline border the rest of
the site uses. Real highlighting was judged worth more than a perfect palette
match, but the contrast rule above still binds: only 20 of Shiki's 44 dark
presets have every token clear 4.5:1 on `bg`, so measure before swapping the
theme. Tag every fence with a language or it renders unhighlighted.

The feed carries each post's full rendered HTML with root-relative URLs made
absolute, and uses `trailingSlash: false` so item links (which double as
guids) match the real page URLs. Changing a post's file name changes its URL
and its guid.

There are two feeds from one builder, `src/feed.ts`, differing only in the
footer appended to each item. `/rss.xml` is the public one, linked from the
site, with a footer for feed readers. `/newsletter.xml` is unlinked and read by
rss-to-email-worker, which emails each new item; its footer is written for
email, and the worker adds the per-subscriber unsubscribe link below it. Guids
match across the two.

`src/uses/` lives outside `pages/` because Astro treats every `.ts` file under
`pages/` as an endpoint.

There is no site nav, and components live beside the data they draw (`src/work/detail/`)
rather than in a components directory. Subpages carry a back link to their parent: "←
Nathan Arthur" on most, "← Writing" on a post, "← Work" on a project page. The footer
lives in the layout — its only consumer.

`Layout.astro` renders a dev-only accent picker (colour input, presets, and a
live contrast readout) behind `import.meta.env.DEV`. It is deliberate, not
leftover scaffolding, and it never reaches the build. Keep its script
`is:inline`: a processed `<script>` is bundled into the build whether or not the
component renders.

The favicon is self-hosted: `public/favicon.svg` is the source and
`public/favicon.png` is rendered from it as the fallback for browsers that don't
take SVG icons. Keep them in step. The mark is a shell prompt — chevron and
cursor — on an 8px stroke over a 64 grid, so every limb is 2px at the 16px
browsers actually draw and nothing thins out to grey. It replaced an "n"
monogram on 2026-09-19: a letterform was legible but said nothing the tab
title doesn't.

## Newsletter form

The footer form in `Layout.astro` posts to the rss-to-email Worker at
`mail.nathanarthur.com/subscribe` (double opt-in), guarded by Cloudflare
Turnstile with `data-action="subscribe"`, which the Worker checks. The widget
uses `data-appearance="interaction-only"`, so it shows only when a visitor has
to interact with it.

## Comments

Newsletter posts carry a giscus thread, which stores comments as GitHub
Discussions in this repo under the Announcements category. The embed is a
script tag at the foot of `writing/[slug].astro`; the repo and category IDs in
its attributes are public identifiers, not secrets.

`data-mapping="specific"` with the slug as the term keys each thread to the
post rather than to its path, so moving a URL doesn't orphan the thread. The
theme is `transparent_dark`, which lets the page background show through
instead of laying a panel on it — the palette rule applies to the embed as much
as to anything else, and giscus is themeable where a hosted widget usually
isn't.

Chosen over Disqus on 2026-09-20 after measuring what Disqus actually shipped:
its free tier reported `can_disable_ads: ""` and in-thread ads every eight
comments, and the ad network is where the tracking lives — removing it meant
$12/mo. giscus has no ads, no tracking, and the comments stay in a repo Nathan
controls. The cost is that commenting needs a GitHub account, which suits this
audience and would not suit every site.

There is no comment count on `/writing`: the list stays type and rules, and
counts would mean loading the embed on the index too.

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
