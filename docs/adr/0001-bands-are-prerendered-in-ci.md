# Bands are pre-rendered in CI by a headless browser

A Band is a generative strip drawn behind a post's title by a p5 Sketch. Running
that Sketch in the reader's browser cost about 1.4 seconds of main thread per
page load, on a site whose stated job is a 30-second skim. Bands are therefore
rendered during `pnpm build` by headless Chromium, sliced to the `srcset` widths,
and shipped as WebP; the page carries an `<img>` and no JavaScript at all.

Decided 2026-10-01 by Nathan.

## Considered options

**A Cloudflare Worker generating Bands on demand.** Nathan's first proposal, and
the initial preference. Rejected once it was clear the cache key decides
everything: with no per-visit variation wanted, a cached Worker response is a
static image with extra steps, so the technical case against build-time
generation collapsed. What remained was that a deployed service is a better
artifact to point at during a job search — a real reason, but not one that
survived the next constraint. Running p5 in a Worker means Cloudflare's Browser
Rendering API, which is paid, slow and awkward, whereas a headless browser in a
build step is ordinary.

**Generating out of band and committing the images**, matching how
`scripts/github-activity.mjs` and `scripts/project-stats.mjs` already work.
Rejected: that precedent exists because those scripts need a GitHub token and
their output is data about the world, which changes with no code change. A Band
is a pure function of its Sketch and Seed, so the condition that justified the
precedent does not hold. Nathan also observed that CI prevents image-vs-Sketch
drift by construction, where out-of-band needs a guard to catch it — which is an
argument for CI rather than a cost of it.

**Dropping p5 and computing the raster directly.** The `trails` Sketch uses p5
only for `random`, `noise` and `putImageData`, so it would run in plain Node with
no browser. Rejected by Nathan, who wants the full p5 API available to get a head
start on polish for Sketches not yet written. Keeping p5 is what requires a
browser at all; this is the decision that costs the most and was made knowingly.

## Consequences

Playwright is a devDependency and `pnpm build` downloads Chromium. Build time
grows with the number of posts carrying a Band, so renders are cached on a
content hash of `(sketch, seed, dimensions)` and skipped when unchanged; in CI
that cache is an `actions/cache` keyed the same way.

Determinism is load-bearing rather than incidental. The same Sketch and Seed must
produce the same Band, or the cache key is a lie and every deploy churns the
images.
