# nathanarthur.com

Nathan Arthur's personal website. Its job is verification rather than discovery:
almost everyone arriving already has a reason to look him up, so every page is
designed for a 30-second skim by that reader.

## Language

### The public code record

**Public code record**:
The set of public repositories and gists this site claims as Nathan's work,
gathered across every account and organization he writes under. Its value is
that this view exists nowhere else — GitHub can only show one account at a time.
_Avoid_: portfolio, repo list, project list

**Item**:
One entry in the public code record: a repository or a gist. The two are the
same kind of thing here and are ranked against each other on the same terms.
_Avoid_: repo, project, entry

**Substantially authored**:
The property that makes an item Nathan's rather than merely touched by him —
enough of its commits are his that claiming it is honest. Tested mechanically,
never asserted by hand.
_Avoid_: owned, written by, contributed to

**Code**:
Content a reader could go and read as programming work. An item that holds only
notes, configuration, or release plumbing is not code, however legitimately it
exists.
_Avoid_: source, real code

**Listed**:
The state of an item that appears on the page. An item is listed when it is
substantially authored and is code — nothing else, and nothing chosen by hand.
Stars and recency change only where a listed item sits, never whether it is one.
_Avoid_: shown, included, featured

**Share**:
How much of an item is Nathan's, as his commits over everyone's. The measure of
substantial authorship on an item he owns, and the column a reader sorts by to
ask what he actually built.
_Avoid_: ownership, percentage, contribution ratio

**Commit access**:
The distinguishing fact about an item Nathan does not own: someone else's project
admitted him to it. This is the record's strongest evidence and the reason it is
worth reading, so the page never flattens it into ownership, and a small share
there counts for more rather than less.
_Avoid_: collaboration, contribution

### Post illustration

**Band**:
The full-width generative strip behind a post's title. Pre-rendered at build
time, so a reader receives an image and never runs the code that made it. A
Band is an alternative to an Illustration, not a kind of one.
_Avoid_: banner, hero, header image

**Sketch**:
The p5 program that draws a Band. One per post, written for that post's
content rather than configured from a shared template — the ant post's Sketch
simulates ant navigation because the post is about what ants do without
understanding it.
_Avoid_: generator, viz, pattern

**Seed**:
The integer that fixes a Sketch's arrangement. The same Sketch and Seed give
the same Band every time, which is what makes the Band cacheable and what
makes choosing one an authoring decision rather than a lottery.
_Avoid_: variant, version

**Harness**:
The shared code that owns the p5 instance, canvas sizing, device pixels,
seeding and the ready signal, so a Sketch is only the part that draws. It
exists because those four are identical in every Sketch and each one has
already been got wrong once.
_Avoid_: runner, wrapper

**Embed**:
An interactive p5 page in a post's body, run in the reader's own browser
inside an iframe. The distinction from a Sketch is who executes it: a reader
runs an Embed and only ever sees the output of a Sketch.
_Avoid_: widget, demo

**Illustration**:
The AI-generated painting a post carries as its cover image, produced by the
workflow in `my-ai-illustration-workflow`.
_Avoid_: image, art
