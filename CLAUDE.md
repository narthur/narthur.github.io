# CLAUDE.md

Guidance for Claude Code working in this repository. `knowledge.md` holds the
design and content rules and the file layout; `WARP.md` holds the commands.
Both are load-bearing — read them before changing anything they cover.

## Disclose AI writing

Any page carrying prose an AI drafted must say so. The layout renders the
notice; you only set the flag:

- A project or post: `ai: true` in its frontmatter.
- Any other page: the `ai` prop on `<Layout>`.

Set it in the same change that adds the writing, not afterwards. Remove it only
once every AI-drafted sentence on that page has been rewritten — the notice is
Nathan's cue to go and do that, so leaving it on is the safe error.

This is about _prose_, not code: markup, config and component logic an AI wrote
don't trigger it. Neither does editing someone's existing sentence for grammar.

Don't infer the flag from git history. Claude's commits carry a
`Co-Authored-By` trailer, but every newsletter post arrived in one AI-authored
import commit and the SvelteKit-to-Astro conversion rewrote every page file, so
both blame and the trailers credit AI for words it did not write.

## Pages currently flagged

`/work` (work.yaml descriptions, activity-chart caption), `/audioverse`,
`/taskratchet`. Unflagged and
human-written: the home page (its copy is Nathan's, rewritten 2026-09-19),
`/writing` (intro and Beeminder blurbs, rewritten 2026-09-20), the newsletter
posts, `/uses`, and `/404`.
