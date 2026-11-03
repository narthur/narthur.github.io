# Holding Slop posts until the morning deploy

A Slop post goes live at the first build on or after 00:00 UTC of its `date`.
There is no rule holding it back until the scheduled 12:00 UTC deploy.

## What this means in practice

The daily `schedule` trigger in the deploy workflow rebuilds at 12:00 UTC. That
is the intended release, since it's morning in the US. But any build between
00:00 and 12:00 UTC also publishes that day's post, and that includes a push to
master or a manual run. In Chicago, that window is roughly 18:00 to 06:00 the
evening before. The first post, `benchmark-frameworks-for-agents`, appeared
that way.

The rule is a single comparison:

```ts
export const isPublished = (date: Date, now: Date) => date <= now;
```

## Why it stays this way

A post's date means a UTC day, like every other date on the site: the
`/writing` and `/slop` listings and the GitHub activity buckets all use UTC.
Nothing on the site uses a local timezone. A post that shows up the evening
before its date, US time, is harmless while the queue doesn't promise a release
time to anyone.

The alternatives considered:

- **Release at `date + 12h`.** Dates stay UTC, and no build can release a post
  ahead of the scheduled deploy. It's a one-line change to `isPublished`, plus
  the boundary tests in `src/slop-date.spec.ts` and the notes in `src/slop.ts`
  and `knowledge.md`. It's cheap, but it isn't needed unless the evening-before
  appearance matters.
- **Release at local midnight in `America/Chicago`.** This would add the site's
  first timezone, along with DST handling, and the scheduled deploy would still
  rebuild only at 12:00 UTC. It gains little over the `+12h` option.

## When to revisit

Revisit if an early release causes a problem: for example, if the feed or an
announcement needs to hold to "one post per morning", or if posts get tied to a
time-sensitive event. The `+12h` option is then the fix.

## Prior requests

- #124: "Slop posts can go live up to 12 hours before the scheduled release"
