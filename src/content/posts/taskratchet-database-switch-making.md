---
title: 'TaskRatchet Database Switch, Making AI Skills Autonomous, Etc'
date: 2026-04-14T16:46:54.595Z
substack: https://narthur.substack.com/p/taskratchet-database-switch-making
---

<figure><img src="/writing/taskratchet-database-switch-making/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

After three months of sporadic work, yesterday I finally moved TaskRatchet from Firestore to Neon. TaskRatchet was in maintenance mode for about an hour and a half during the migration. Fingers crossed that the change hasn’t introduced too many bugs.

Reasons for the switch:

- I plan to move the TaskRatchet back-end to Cloudflare, and Firestore isn’t very compatible with Cloudflare.
- Firestore is a proprietary database, which means lock-in issues. Neon uses PostgreSQL, so future moves should be much easier.
- Firestore restricts the kinds of querying I can do, which is frustrating when I’m trying to optimize cost and performance.
- PostgreSQL is widely supported for tooling such as ORMs.

---

I’ve been experimenting with pushing my AI skills to be more autonomous. Example: I’ve rewritten [my resolve-pr-feedback skill](https://github.com/narthur/dotfiles/blob/main/.claude/skills/resolve-pr-feedback/SKILL.md) to handle AI review feedback automatically instead of waiting for my input after each feedback item. It then commits and pushes any feedback, waits for AI reviewers to submit new reviews, and repeats the cycle up to three times. It still, however, requires my input on any human-submitted feedback.

---

I’m continuing to use the new Cursor 3 agents interface. It’s a significant improvement over using Claude Code when multitasking. Three things I’m hoping Cursor fixes soon:

- It currently has a bug where restarting Cursor results in archived conversations reappearing in the agents window sidebar.
- The in-Cursor browser is not scoped to the AI session. This means that if one agent uses the browser MCP to navigate to a page, any other agents who were trying to use the browser now see the new page instead of what they may have been working on.
- Worktree support is janky. I would like to be able to have multiple sessions in the same repo, each with its own worktree, and for which worktree each session is using to be clearly visible. Currently this is not the case. Agents can use different worktrees. But the agents are managing their worktrees manually, unsupported by the UI or any IDE-specific logic.

---

CodeRabbit now supports [usage-based billing](https://docs.coderabbit.ai/management/usage-based-addon), something I’ve long wished they had. Unfortunately it doesn’t replace their per-seat pricing. But it at least provides a way to prevent CodeRabbit’s rate-limiting from slowing development.
