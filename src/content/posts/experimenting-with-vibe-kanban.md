---
title: 'Experimenting with Vibe Kanban'
date: 2026-02-10T18:02:57.820Z
substack: https://narthur.substack.com/p/experimenting-with-vibe-kanban
---

<figure><img src="/writing/experimenting-with-vibe-kanban/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

I’ve been experimenting some with using [Vibe Kanban](https://www.vibekanban.com/). It gives you a local kanban interface where you can track coding tasks and trigger coding agents to work on them locally using [git worktrees](https://git-scm.com/docs/git-worktree). It also provides a local MCP server that you can connect to your other AI tools list and add tasks.

I like the fact that this provides a private space for planning programming tasks. The chunks of a task that make sense to assign to a coding agent are likely often different than what would be ideal for syncing with other humans on something like GitHub Issues or Trello.

One thing that Vibe Kanban is still missing is a way to chat with an AI about an issue within the kanban interface. I enjoy being able to ask [CodeRabbit](https://www.coderabbit.ai/) questions inside my GitHub issues and collaborate with the AI on planning the issue.

I guess with Vibe Kanban the intended way to solve this is with its MCP server. Instead of chatting with the AI about a task within that task’s interface, chat with your favorite AI outside of Vibe Kanban about the task. And presumably that agent can then use the MCP server to update the task with new research and planning.

I did run into a bit of a hiccup with its use of worktrees. It had created a worktree for a task branch (as it always does). Later I wanted to do something manually on that branch. I went to the main project folder and attempted to checkout the branch. Git then complained that I couldn’t do that because I already had a worktree for that branch. I ended up going back to Vibe Kanban and using its AI interface to do what I was going to do there. Perhaps if I were more comfortable with git worktrees generally this wouldn’t have tripped me up like it did.
