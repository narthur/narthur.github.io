# Branding

`knowledge.md` holds the rules — the seven palette tokens, the type stack, the
link behaviour, the measure. This file holds what those rules are _for_, and
covers the ground they don't reach: the mark, the voice, the illustrations, and
the things the site deliberately refuses to do.

Each claim below says where it comes from. A claim marked _inferred_ was read
out of the code rather than decided in conversation, so it describes what the
site currently does, not a commitment anyone has made.

## Position

The site's job is **verification, not discovery**. Almost nobody arrives by
accident: they are holding an application, or they followed a link, and they
want to confirm who this is in about thirty seconds. Every page is built for
that reader. (Stated in `knowledge.md`; it is the root of nearly everything
else here.)

That single fact does most of the work. A reader who is already looking for you
does not need to be persuaded, retained, or converted — they need to find the
evidence fast and leave satisfied. So the site spends its budget on evidence and
none on persuasion.

## The through-line: restraint reads as confidence

The design rules are individually small and point the same way. No cards, no
shadows, no rounded corners, no entrance animations, no scroll effects, no
hover lifts, no light-theme toggle, no "open to work" banner, no hard-sell
call to action. (All from `knowledge.md`.)

Stated as a brand position rather than a list: **work that stands up doesn't
need decoration around it.** Ornament on a portfolio reads as compensation. The
absence of it is the claim. This is why "evidence first, ornament never" is a
brand rule and not merely a taste preference — and why the exceptions are
instructive. Genuine controls do get hover feedback and focus outlines, because
a control that gives no response is an accessibility failure, not restraint.
Restraint is about what the site _asserts_, never about what it _withholds from
a reader who needs it_.

## The mark

There is no logo. The mark is the favicon: a shell prompt — a chevron and a
block cursor — in the accent colour on the page background, drawn at an 8px
stroke on a 64 grid so that nothing thins to grey at the 16px browsers actually
render. (`public/favicon.svg`; the sizing rationale is in that file's own
comment.)

What it claims is narrow and accurate: this person works in a terminal. It makes
no claim about design, taste, or company. For a developer's verification site
that is the right size of claim — _inferred from the choice of glyph_.

There is no wordmark beyond the name set in Instrument Sans, and no `og:image`
— link previews currently fall back to whatever the platform generates.
_Inferred: no decision about either is recorded anywhere._

## Colour

Seven tokens, dark only, no toggle. The accent is the one variable: it resolves
to `--accent` declared once on `:root`, and a dev-only `AccentPicker` ships in
the layout specifically because the accent has been re-chosen more than once and
that is how candidates get tried against real pages. (`src/layouts/AccentPicker.astro`,
whose comment says exactly this.)

The implication worth recording: **the accent is a parameter, not an asset.**
Nothing in the brand depends on it being `#8ded51` lime in particular. The
presets in the picker span lime, teal, periwinkle, sky, coral, gold and plain
mono, and the site is designed to survive any of them. What is fixed is the
_structure_ — one accent, used sparingly, against a near-black ground.

Every text token clears WCAG AA against `bg`. This is a brand commitment and not
only a technical one: a site whose whole argument is "the evidence is legible"
cannot ship 3.27:1 body text, which `faint` did once before it was corrected.

## Typography

Instrument Sans at 400 and 500 for prose and headings; the system mono stack for
metadata — dates, roles, stack lists, section labels. Section labels are small
mono, uppercase, wide-tracked.

The split carries meaning rather than decoration: **mono marks machine-checkable
facts, sans carries human prose.** A date, a language, a commit share and a job
title are all things a reader could go and verify; they wear the typeface that
signals so. _Inferred from the consistency of the split, not stated anywhere._

## Voice

Two registers, and they are not the same.

**Site copy** — the positioning line, section headings, link labels — is
compressed to the point of terseness. The positioning line doubles as the home
page's `<meta name="description">`, derived from one constant so the tab, the
search result and the page cannot drift apart (`src/pages/index.astro`). Site
copy makes claims that are checkable and stops.

**Post prose** is Nathan's own and reads nothing like the site copy: first
person, discursive, willing to sit in uncertainty and end on a question rather
than a conclusion. The newsletter is where the thinking happens; the site proper
is where the record lives. Keeping them distinct is deliberate — _inferred from
reading both, and from the AI-disclosure rule below, which exists to protect the
posts specifically._

## Illustration

Posts carry a generated illustration as the first figure. The workflow is
documented publicly in the `my-ai-illustration-workflow` post and runs from
`~/bin/generate-illustrations`: an LLM extracts themes and a symbol bank from
the article, writes image prompts across four abstractness tiers, and a hosted
image model renders a batch to pick from.

The house style, as practised:

- **Painterly, never photographic.** Oil, visible brushwork, impasto, canvas
  weave. The generator appends an explicit anti-photo instruction because
  "hyperrealist" style names otherwise win and produce photographs.
- **Abstract over literal.** An illustration sets a mood and does not explain
  the article. Recognisable objects, and especially recognisable _people_, pull
  the image toward illustration-as-explanation, which is not what it is for.
- **The image must not overclaim on the writing's behalf.** Decided 2026-10-01
  while choosing the cover for "Small Treasures": the post argues that being
  easily moved by small things is itself worth something, and a reverent
  single-object-in-a-void composition staged the subject as precious before a
  word was read — contradicting the piece it illustrated. The chosen cover is a
  flat row of discs on a ledge, where the warm ones sit among the grey ones at
  the same size. The general rule: **check the image against the argument, not
  just the subject matter.**
- Illustrations are decorative and carry `alt=""`. The post's _content_ images —
  screenshots, embeds — carry real alt text. (`src/content/posts/*.md`.)

Lead a prompt with the medium rather than the subject. Scenes described
subject-first drift photographic regardless of the style suffix; the same scene
described medium-first stays painted. Observed repeatedly on 2026-10-01.

## Honesty commitments

These are brand positions, not just policies, because each one costs something
and is kept anyway.

- **AI-drafted prose is disclosed**, via `ai: true` in frontmatter or the `ai`
  prop on `Layout`, and the notice stays until every drafted sentence has been
  rewritten. Leaving it on is the safe error. (`CLAUDE.md`.) On a site whose
  entire function is verification, undisclosed generated prose would undermine
  the thing the site exists to do.
- **Every link opens in the same tab**, external included, so no
  `rel="noopener noreferrer"`. The reader keeps control of their own tabs.
  `noreferrer` was also actively costing attribution — it strips `Referer` even
  on same-tab navigation, so Substack and Pine Peak Digital could not see this
  site as a source. (`knowledge.md`.)
- **No "open to work" banner**, because current clients read this site; and no
  hard-sell CTA. Contact appears once, as GitHub, LinkedIn and email.
  (`knowledge.md`.)
- **Claims about the work are computed, not asserted.** The public code record
  decides what to list by measured commit share and collaborator status rather
  than by hand-picking. (`CONTEXT.md`.)

## Neighbours

The footer places this site among four others: Substack (the newsletter's home),
Pine Peak Digital (the company), Stack Overflow, and Ko-fi
(`src/layouts/Layout.astro`). The personal site is the hub and does not absorb
them — the newsletter keeps its own home and its own voice, and the company
keeps its own brand. _Inferred from the footer and from the newsletter's
separate domain; no decision about the relationship is recorded._

## Open questions

Nothing here answers these; they are listed so a later reader knows they are
unanswered rather than settled.

- No `og:image`, so shared links have no controlled preview.
- No wordmark or any mark larger than the 64px favicon.
- Whether the accent is ever intended to settle, or stays a parameter.
