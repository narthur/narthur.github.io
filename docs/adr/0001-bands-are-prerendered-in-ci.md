# Bands are pre-rendered in CI by a headless browser

A Band is a generative strip drawn behind a post's title by a p5 Sketch. Running
that Sketch in the reader's browser cost about 1.4 seconds of main thread per
page load, on a site whose stated job is a 30-second skim. Bands are therefore
rendered during `pnpm build` by headless Chromium and shipped as a single WebP;
the page carries a CSS `background-image` and no JavaScript at all.

One image, not a set: the Sketch's field wraps in x, so the full-width render is
a seamless loop and `repeat-x` covers any viewport. `srcset` is wrong here — a
full-bleed fixed-height band has a viewport-dependent aspect ratio, so `w`
descriptors would not be the same image at different sizes and `object-fit`
would crop vertically, discarding the reflection edges the Sketch is built
around.

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

Playwright is a devDependency, but it ships no postinstall, so **CI must install
the browser explicitly** — `pnpm exec playwright install --with-deps chromium`
before the build, in both `ci.yml` and `deploy.yml`. Without it `chromium.launch()`
fails on every clean runner. This is easy to miss on a developer machine that
already has a browser cached from unrelated Playwright use, which is exactly how
it was missed here.

Build time grows with the number of posts carrying a Band, so renders are cached
on a content hash of the Sketch, the Harness, the render page, the pinned p5
build and the Seed, and skipped when unchanged. That cache lives in
`node_modules/.cache/bands`, which CI rebuilds from scratch every run, so both
workflows carry an `actions/cache` for it as well as for the browser download.

Determinism is load-bearing rather than incidental. The same Sketch and Seed must
produce the same Band, or the cache key is a lie and every deploy churns the
images. That is why the key covers the p5 version and the render page too, and
why the accent is a shared constant rather than a token read off whatever page
happens to be rendering: a Sketch that silently reads nothing would freeze every
Band at the old colour after a re-theme.

## Amendment, 2026-10-07: a second track, for Sketches that are curves

The decision above still holds for a Band that is a field of pixels. It does not
hold for one that is a set of curves, because the pipeline it describes destroys
curves — which was not known when it was written.

Measured on `hopfield`, whose contours are 1.4px wide: the Sketch draws them at
device resolution, the render is then resized 2:1 (`SCALE`), and the result is
encoded at `quality: 70`. The resize halves a 1.4px line to 0.7px, and a line
narrower than a pixel cannot keep its amplitude through an area average; WebP
then treats what is left as noise and spreads it wider and fainter still. Median
brightness of a lit pixel, out of 255: **158** as drawn, **50** after the resize,
**5** after the encode. The shipped asset measured 7. Lossless encoding recovers
to 50 and q95 to 41, so the encoder is the larger multiplier, but the resize is
the cause — it is what creates the sub-pixel line the encoder then erases.

So a **vector track**: a Sketch may instead export `geometry`, returning paths
rather than writing pixels. `src/bands/index.ts` holds the two registries and is
the only place that says which track a name takes. A vector Band is a pure
function of size, Seed and accent, so it runs in plain Node — no DOM, no p5, no
browser, no screenshot, no resize, no encode — and ships as SVG the browser
antialiases at the device's own resolution. `hopfield` is 7KB gzipped against
38KB for the WebP it replaced.

**This does not reverse the rejection of "dropping p5" above.** That option was
rejected to keep the full p5 API available for Sketches not yet written, and
that reason is untouched: `sketches` and Chromium remain, `trails` still renders
through them, and a new Sketch can still be written against p5. What changed is
that a Sketch which does not need p5 is no longer made to pay for it. Chromium
launches only if some post wants a raster Band; a site whose Sketches are all
vector never starts it.

The consequence is a second thing to keep working — two tracks, two renderers,
two asset types — against one fewer thing to get wrong, since a vector Band has
no second rasteriser to drift from: `pnpm dev` and the shipped page run the same
function.

They emit the same bytes for the site's current accent, which is the only case
that ships. One input can differ: the build reads the `ACCENT` constant, while
the dev page reads the live `--accent`, and `AccentPicker` rewrites that on
every dev page so a candidate colour can be tried against a real one. So while
the picker holds a non-default accent the dev Band is deliberately not the one
that would ship — that is the picker doing its job, and it is the reason this
paragraph does not say "byte for byte".
