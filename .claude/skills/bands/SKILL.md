---
name: bands
description: Design a Band (the generative strip behind a newsletter post's title) for a post on nathanarthur.com — come up with Sketch concepts tied to the post's content, write 3–4 candidates, show them side by side, then keep the chosen one with a spec and the post's frontmatter. Use when Nathan asks for a band, band options, a new Sketch, or a header graphic for a post.
---

# Bands

A **Band** is drawn by a **Sketch** in `src/bands/` and named from a post's frontmatter as
`band: { sketch, seed }`. Read `CONTEXT.md` (§ Post illustration), the Band section of
`knowledge.md`, and `docs/adr/0001` before writing one. This skill is the process; those are the
rules.

## 1. Read the post

Read the whole post, not the title. Note its actual claim, its mechanism, and the concrete
things it names (objects, people, a link, a metaphor it leans on). Light posts (a holiday note)
and argued posts (an essay about review loops) want different kinds of concept; see §2.

## 2. Come up with concepts

The Sketch registry's rule is one Sketch per post, written for it. What makes a Band worth
having is the **semantic connection between the algorithm and the post** — the reader who knows
the idea should recognise the post in how the picture is _made_, not just in what it shows.

Strongest to weakest:

1. **The algorithm is the post's mechanism.** The process that draws the Band is the process the
   post is about. Examples already shipped:
   - `trails` (Small Treasures): ant stigmergy — real structure from agents too simple to deserve
     the credit, which is the post's question.
   - `hopfield` (podcast interview prep): associative recall from a fragment, drawing the
     _contested boundary_ of what repetition has fixed.
   - `kuramoto` (bad brain days): coupled oscillators locking and drifting as coupling rises and
     falls unevenly — good and bad days.
   - `subdivide` (recursive code review): cells holding a finding split and are reviewed again.
2. **The algorithm models a structure the post relies on.** `rings` (agent fieldnotes): each
   session lays a layer the next can read, as tree rings do. `digitised` (cyborg development): one
   terrain surveyed by hand on one side of a moving seam, on a grid on the other.
3. **The picture depicts something the post names.** `harvest` (Happy Thanksgiving): wheat bent
   by one wind. Fine for a short, warm post with no mechanism to model; a weak choice for an
   argued one, where it reads as clip art.

How to get there:

- List the post's verbs before its nouns. "Recall", "split", "lock in step", "accumulate" map to
  algorithms; "cat", "laptop" map only to pictures.
- Look for a known system with the same shape: dynamical systems, cellular automata, agent
  simulations, physical processes (diffusion, erosion, growth, weaving), data structures, signal
  processing. Ask what the post's process _is_, then which of these computes it.
- Draw the interesting quantity, not the obvious one. `hopfield` paints uncertainty, not state;
  painting confidence filled half the strip with solid accent. `trails` draws where ants walked,
  not the blurred smell field, which looked like fog.
- Spread the candidates across tiers and across the post's ideas, so the choice is between
  readings of the post, not between four textures of one idea.
- Give each candidate one sentence on why it fits. If the sentence needs the word "evokes", it is
  tier 3.

## 3. Write the candidates

Prefer the **vector** track: a `VectorSketch` returning geometry, shipped as SVG, no browser
(`src/bands/types.ts`). Raster (p5) only when the image is genuinely a field of pixels.

Each candidate is `src/bands/<name>.ts` exporting `geometry`, registered in `vectors` in
`src/bands/index.ts`. Every one must:

- Use the `.ts` extension on relative imports (plain Node loads these).
- Be a pure function of size and Seed; use `rng(seed)` from `vector.ts`, never `Math.random`.
- **Tile in x**: periodic terms use whole cycles across `W`, counts divide `W` exactly, distance
  wraps, and anything crossing the seam is drawn again at `±W`.
- Scale by `k = H / 240` so it looks the same at any height.
- Take colours from `accent` and `BACKGROUND` only; vary emphasis with path opacity.
- Carry a doc comment naming the post and saying why this algorithm fits it, in the style of the
  existing Sketches.
- Leave the title readable: the title sits bottom-left on a page-background backdrop, but a
  strip that is solid accent everywhere still fights it.

## 4. Show them side by side

With `pnpm dev` running (check for an existing server first — `astro dev status`), open:

```
http://localhost:4321/band-options?title=<post title>&sketches=a,b,c,d&seeds=4
```

It draws each Sketch at random Seeds under the title; reload for new Seeds, click a line to
copy its frontmatter. Screenshot it (`npx playwright screenshot --full-page
--wait-for-timeout 3000 …`, outside the sandbox — Chromium cannot launch inside it) and look
before handing it over. Only the centre ~1280px of the 3440px Band is visible at that width, so
sparse Sketches can look empty there. Tell Nathan which known flaws each candidate has.

The single-Sketch picker on the post page itself (bottom-left, dev only) is for fine-tuning a
Seed once the Sketch is chosen.

## 5. Keep the chosen one

1. Set `band: { sketch: '<name>', seed: <n> }` in the post's frontmatter. If Nathan picks a
   Sketch but not a Seed, choose one from what he saw and say which.
2. Delete the rejected Sketch files and their registry entries.
3. Write `src/bands/<name>.spec.ts`, following `rings.spec.ts`: it tiles across the seam, it is
   a pure function of the Seed, and it draws the same thing at any height. Make sure the tiling
   test would fail if the wrap were removed.
4. `npx vitest run src/bands`, then `pnpm build` (outside the sandbox: the build launches
   Chromium for raster Bands and Preview cards). Confirm `dist/writing/<slug>/band.svg` exists
   and look at the post's Preview image `dist/writing/<slug>.png`.
