---
title: 'Iterating on a PR Extraction Workflow'
date: 2026-01-06T16:46:24.921Z
substack: https://narthur.substack.com/p/iterating-on-a-pr-extraction-workflow
---

<figure><img src="/writing/iterating-on-a-pr-extraction-workflow/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

Since I had good success with [my PR feedback review workflow](/writing/fast-pr-feedback-review-with-saved), I’ve been trying to create a similar workflow for extracting PRs from an existing large branch.

So far my success has been mixed.

Given my ADHD, switching tasks can be difficult. This often means I end up putting a lot of work on a single git branch and then facing a difficult decision: go through the painful process of breaking it into multiple smaller PRs, or send it as is and hope it doesn’t cause too much pain to whomever ends up reviewing it.

The saved AI prompt I’ve been playing with seems to help quite a bit. Here’s what it tries to do:

- Ensure the target branch is up-to-date with its base
- Diff the target branch against its base
- Identify a subset of the changes on the target branch that could be extracted to a new branch
- Explain the selected changes to the user and ask for permission to proceed
- Extract and commit the identified changes to the new branch
- Ask permission to create a PR from the new branch
- Create a draft PR from the new branch

When this workflow works, it feels really good.

I’ve had two main challenges so far:

1.  Ensuring the workflow is followed consistently and the AI doesn’t start skipping steps
2.  Dialing in how well the AI identifies an ideal subset of changes to extract

On issue two, the problem I’ve been dealing with is that the AI focuses on extracting the smallest possible change, even to the point of suggesting things like adding a single unused import statement to a file.

The set of changes to be extracted need to balance several factors:

- Is small, but not too small.
- Passes CI checks.
- Has self-evident benefit to the codebase, or is obviously a precursor to planned changes. This is to reduce the likelihood of the resulting PR being questioned by reviewers.

Currently I’ve been iterating on this prompt as a markdown file that I then paste into Warp. I’m thinking I may switch to trying to set it up as one or more custom skills and/or subagents in Claude Code. This should have a few benefits:

- Claude Code skills and subagents may be easier to share.
- Subagents may allow me to better control context and tool usage, hopefully improving workflow consistency.
- I’m hoping that at some point I won’t need to explicitly invoke the workflow, but simply ask Claude Code to extract a PR and it will infer which skills and subagents to use.

Things I’ve come across related to all this:

- [How Claude Code Works](https://www.youtube.com/watch?v=RFKCzGlAU6Q)
- [Most devs don’t understand how context windows work](https://www.youtube.com/watch?v=-uW5-TaVXu4)
- [Turn Claude Code into a Multi‑Agent Personal Assistant (Claude Agent SDK Tutorial)](https://www.youtube.com/watch?v=gP5iZ6DCrUI)
- [Claude Code Docs: Agent Skills](https://code.claude.com/docs/en/skills)
- [Claude Code Docs: Subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Docs: Discover and install prebuilt plugins through marketplaces](https://code.claude.com/docs/en/discover-plugins)
- [PromptLayer](https://www.promptlayer.com/)
