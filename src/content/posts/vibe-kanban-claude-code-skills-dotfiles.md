---
title: 'Vibe Kanban, Claude Code Skills, Dotfiles, Etc'
date: 2026-02-18T16:25:32.665Z
substack: https://narthur.substack.com/p/vibe-kanban-claude-code-skills-dotfiles
---

<figure><img src="/writing/vibe-kanban-claude-code-skills-dotfiles/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

## Thoughts on Vibe Kanban

I’ve done some experimenting with [Vibe Kanban](https://www.vibekanban.com/). There are things I really like about it. The main one being that it seamlessly handles creating new git worktrees for each task attempt.

I can’t help but thinking, though, that having to use a GUI to interact with the tool just slows me down at this point. My [pr-triage](https://github.com/narthur/dotfiles/tree/main/.claude/skills/pr-triage) and [resolve-pr-feedback](https://github.com/narthur/dotfiles/tree/main/.claude/skills/resolve-pr-feedback) skills for Claude Code have convinced me that skill-based workflows initiated directly within Claude Code can be incredibly powerful.

I could almost leverage Vibe Kanban for this type of workflow, too. It has an MCP that lets you list and add tasks. But it doesn’t allow for creating and otherwise managing attempts on a task. If it did, I could build a Claude Code workflow around it and allow it to continue managing the git worktrees and running subagents autonomously in the different worktrees.

So that leaves me to try to reproduce that functionality, too. I haven’t yet succeeded. I’ve been attempting to get a skill working in my TaskRatchet repository. I’ve added a [dev container](https://containers.dev/) to the repo and added a project-specific skill to attempt to allow for parallel task attempts pairing the dev container with task-specific worktrees.

If I succeed in getting this skill to be functional, I’m unsure if it will need to remain specific to a single git repository. I figure I’ll just focus on getting it working within one repository and then assess what it would take to generalize.

## Dotfiles as Bare Git Repository

I’ve updated how I use [my dotfiles repo](https://github.com/narthur/dotfiles) to use [a bare git repository](https://www.atlassian.com/git/tutorials/dotfiles). The main advantage of this change is that I no longer need to keep an exhaustive list of files in the repo as exclusions in my .gitignore file, since all files in my home directory are ignored by default until explicitly added using `git add`.

## Links Roundup

- [Testcontainers](https://testcontainers.com/) - “Testcontainers is an open source library for providing throwaway, lightweight instances of databases, message brokers, web browsers, or just about anything that can run in a Docker container.”
- [Playwright CLI](https://github.com/microsoft/playwright-cli) - “This package provides CLI interface into Playwright. If you are using **coding agents**, that is the best fit.”
- [CodeQL](https://codeql.github.com/) - “Discover vulnerabilities across a codebase with CodeQL, our industry-leading semantic code analysis engine. CodeQL lets you query code as though it were data. Write a query to find all variants of a vulnerability, eradicating it forever. Then share your query to help others do the same.”
- [Jules](https://jules.google/) - “ules is an experimental coding agent that helps you fix bugs, add documentation, and build new features. It integrates with GitHub, understands your codebase, and works autonomously — so you can move on while it handles the task.”
