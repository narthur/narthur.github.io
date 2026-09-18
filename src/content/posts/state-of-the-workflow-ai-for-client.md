---
title: 'State of the Workflow: AI for Client Programming'
date: 2026-04-07T17:40:54.110Z
substack: https://narthur.substack.com/p/state-of-the-workflow-ai-for-client
---

<figure><img src="/writing/state-of-the-workflow-ai-for-client/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

(Title stolen from [the Cortex podcast](https://cgpgrey.substack.com/p/state-of-the-workflow-how-major-life))

My team and I have been using [Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6) for most of our work for a while now. This really kicked into gear when our main client requested that our team use Opus for all work for them going forward. This was based on another developer who works for them telling them that tasks in their codebase that used to take weeks started taking days when he switched to Opus. We’re seeing similar results.

For quite a while now I’ve been using [Claude Code](https://claude.com/product/claude-code) exclusively. It’s great, though it has had some pain points, primarily when it comes to multitasking. Keeping track of multiple terminal pains with different Claude Code sessions running is difficult and inefficient.

Recently [Cursor released Cursor 3](https://cursor.com/blog/cursor-3), including a new multi-workspace agents interface. I’ve only started using it today, but it’s exactly what I’ve been lacking.

- One interface displays all my AI coding sessions in a sidebar for easy switching.
- Each session in the sidebar indicates if its running, done, or waiting for intervention.
- Cursor supports Opus, so I don’t have to use a different model.
- Cursor supports hooks, so I was able to easily tie it into our existing team-wide token tracking system.
- So far it seems to have good keyboard shortcuts support.
- It supports all my Claude Code skills, so I don’t need to do any fussing to transfer my existing skills.
- It isn’t repo-specific, so I can easily work in multiple sessions across multiple git repositories at the same time.
- It includes code review features so I can review code diffs locally before pushing to GitHub.

Our token tracking system consists of Claude Code and Cursor hooks that submit token counts along with the repo the session occurred in to an API endpoint. These session stats are then stored in a private [Baserow](https://baserow.io/) instance. When I need to bill a client, my billing tooling queries this session data for the sessions associated with the specific client’s GitHub repositories, tallies the tokens used within the billing period, and uses that to calculate how much the client owes in token usage based on model rates.

The skills I find myself using on a regular basis:

- client-report for generating detailed weekly reports of what our team has been doing for a client
- daily-standup for generating detailed summaries of what the team has been doing in the past day
- fix-ci for fixing failed GitHub Actions jobs
- obsidian for quickly giving an agent access to my notes
- pr-triage for working through pull request backlogs
- resolve-pr-feedback for working through pull request feedback, both human and automated

In addition, whenever possible I add comprehensive skills to each repository I’m working in. These skills provide documentation that can be loaded when relevant as well as documenting and automating different tasks and processes that are likely to be needed in the repository going forward.
