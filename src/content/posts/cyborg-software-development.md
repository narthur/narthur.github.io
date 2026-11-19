---
title: 'Cyborg Software Development'
date: 2026-11-19T16:00:00.000Z
band: { sketch: 'digitised', seed: 34268 }
---

As a developer, it's my responsibility to ensure quality outcomes. The features have to work, bugs have to get fixed, and the code has to be maintainable.

In the right hands, AI has had the ability to assist in these tasks since ChatGPT came out in 2022. But with the release of Claude Opus 4.5 in late 2025, there was a fundamental shift in the ways AI can now support my work.

It's able to mine large repos and monorepos and come up with detailed proposals that are generally high-quality. It's able to execute these plans and see them through end-to-end. And it's able to effectively review code changes for a wide variety of defects given a bit of scaffolding.

With all that increase in capability, it feels like I spend a lot of my time renegotiating which parts of my process are handled by me and which are handled by AI. The line is always shifting. It's unclear to me where the steady state will land, which pieces will remain the responsibility of humans for the foreseeable future. In any case, this is what I'm still doing, and how that intersects with what I have my agents do for me.

Here's the process I've settled into when using Claude Code to program agentically:

1. Identify the problem
2. Ask Claude for a proposal
3. Sanity check Claude's proposal
4. Provide pushback and alternative interpretations
5. Decide whether to reject or proceed to implementation
6. Spot-check the code at the end to find ways I need to improve my automated quality gates

When I'm working on something that needs design and architecture decisions, both the grill-me and review-loop skills are integral to my process. [Matt Pocock's grill-me skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) helps me incrementally load the context into my brain and find everything I wouldn't have thought to ask. [My own review-loop skill](/writing/using-ai-for-recursive-code-review) allows me to iterate on what good code looks like without having to remember that and manually check every time.

I have [Claude Code](https://claude.com/claude-code) grill me before I let it start on the new pull request. I find that reverse-engineering all the decisions Claude made after the fact from the PR is quite difficult. Everything is much more efficient and likely to be correct when I use the grill-me skill to make sure Claude and I are on the same page from the start.

Claude tends to jump too quickly to solutions and aggressively frame things in a positive, flattering light. I try to notice when Claude says it has found the answer, or otherwise asserts that everything is as I'd wish it to be. That's a flag that I need to stop and check that its conclusion is properly evidenced.

One recent example occurred when I was pulling evidence for the impact of a CI change at a previous job. I had set up [pa11y-ratchet](https://github.com/marketplace/actions/pa11y-ratchet) to ensure that the number of accessibility issues on the front-end would only go down, regardless of who was contributing. Claude discovered that after I left, accessibility issues actually increased. Claude reasoned that it should disregard current production in telling the story to avoid the unflattering outcome it had discovered. I had to push back to prevent Claude from only keeping the evidence that made me look good.

<figure><a href="/writing/cyborg-software-development/pa11y.html" data-embed="bare"><img src="/writing/cyborg-software-development/pa11y.png" width="1200" height="675" loading="lazy" alt="Bar chart of pa11y accessibility errors: 592 when pa11y-ratchet was adopted on 2024-05-22, 201 at my last commit on 2025-03-27, and 925 in a production scan on 2026-08-30"></a></figure>

Sometimes defects (whether mine or Claude's) get past review-loop and my other automated checks. When I discover this has happened, I look for a structural change that makes the issue less likely to recur. This can mean changes to CI, my local git and Claude hooks, or my review-loop skill.

For example, I recently came to the conclusion that I was doing a poor job of capturing the numbers that would show me the impact of different work tasks I've completed. So I updated my review-loop skill to check that I have a plan for doing that and the appropriate instrumentation to make it possible for any given change. Here's the falsifiability plan the review loop included in a PR meant to reduce the number of cache misses for a stats endpoint:

> **Baseline (2026-09-23 to 09-30):** 132 of 139 requests (95%) reached [D1](https://developers.cloudflare.com/d1/).
>
> **Window and threshold:** 7 days after deploy. Worked if fewer than 70% reach D1; inconclusive 70–90%; did not work at 90% or more.
>
> — TaskRatchet PR #1364

---

For the time being this workflow is working well for me. AI in software development is here to stay, and it's allowing us to churn out far more code than we could before. In this reality, it's up to us as developers to make progress in two directions simultaneously: understanding what's being built even when we aren't the ones writing the code, and automating defect detection to ensure increased speed translates into positive outcomes for everyone involved.
