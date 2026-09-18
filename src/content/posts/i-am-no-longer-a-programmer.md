---
title: 'I am no longer a programmer'
date: 2026-04-21T17:45:47.935Z
substack: https://narthur.substack.com/p/i-am-no-longer-a-programmer
---

<figure><img src="/writing/i-am-no-longer-a-programmer/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

I knew it was more or less inevitable. But I hadn’t realized it had already happened until a couple of days ago when I was talking shop with my brother. I realized I haven’t written code by hand for months.

What finalized the change was when I started using Claude Code with Opus 4.5. I was already using agentic coding tools before that point. But they were still unreliable enough that I’d go back and forth between working with the agentic coding tools and working on the code myself.

My current workflow no longer requires this.

- I ask an agentic tool (Claude Code, Cursor, or Zen Coder) to implement a change to the project.
- I spot-check the code changes as the agent works to make sure they look reasonable.
- I ask the agent to verify the change and/or verify it myself.
- I put the agent’s work through multiple cycles of automated code review (a separate local agent; GitHub PR review bots such as CodeRabbit and GitHub Copilot).
- I review the changes in the final PR.
- Depending on the project, I may or may not request an additional human review from a teammate.
- I deploy.

So if I’m no longer a programmer, what am I?

I now spend my time:

- Grooming issue backlogs
- Managing running agents
- Reviewing code
- Looking for new tools and processes to ensure product quality doesn’t suffer
- Communicating with teammates and clients
- Further automating business tasks

I guess I was right. [AI has turned me into a manager](/writing/will-ai-make-us-all-managers).
