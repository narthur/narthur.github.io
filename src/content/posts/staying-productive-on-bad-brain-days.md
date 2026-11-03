---
title: 'Staying Productive on Bad Brain Days'
date: 2026-11-03T16:00:00.000Z
band: { sketch: 'kuramoto', seed: 4 }
---

As someone with ADHD, I find that my mental function isn't consistent. My ability to focus, prioritize, and access working memory rises and falls from day to day and hour to hour. For people with neurodivergent minds these cycles may be more prominent than for the typical neurotypical individual. But I think everyone can relate to having more difficulty at work right after lunch or on the day following a late night.

I've long had the fantasy of some magical computer program that would present my work to me, piece by piece, allowing me to continue being productive even when I'm not at my best.

Turns out this is no longer a fantasy.

<figure><img src="/writing/staying-productive-on-bad-brain-days/1.webp" alt="A pilot card in Claude Code: &quot;Merge buzz #387, the Dependabot security bump to undici and zod in the buzz docs website's lockfile?&quot; with the options Approve (Recommended), Snooze, Deny and Rethink." width="1024" height="1112" loading="lazy"></figure>

About four months ago I built myself a claude skill that approximates what I've imagined. Here's how it works:

- I trigger the skill using `/pilot`.
- The skill runs a script which pulls in potential work items from a variety of sources (dependabot alerts, obsidian notes, open pull requests, sentry issues, etc).
- Claude decides what should be done.
- Claude summarizes what it proposes should be done, making sure to give me the information I need to determine risk under [my risk model](/writing/hills-to-die-on).
- Claude gives me a multi-choice option, allowing me to approve, deny, snooze, ask claude to rethink it, or provide a different answer under "other."
- Claude executes my choice in the background, and provides me my next choice.

This workflow is very effective for specific types of tasks:

- Tasks that pile up automatically over time.
- Tasks that can usually be executed by Claude.
- Tasks whose risk is generally low.
- Tasks that I can decide on without needing a great deal of effort or explanation.

If you find that you have periods of time when you aren't able to do deep, high-effort work, and you also have tasks that meet these criteria, I'd highly recommend you give this approach a go. Choose a single source of tasks to start:

- Somewhere work piles up and is abandoned,
- That can be accessed by MCP, CLI, or API,
- Where each task can be addressed without needing much input from you.

[Here's a gist](https://gist.github.com/narthur/70c973ecd238a8eb18ba7474aefbbd0b) you can use to get started.
