---
title: 'Spec-Driven Dev, TUIs, Etc'
date: 2025-09-18T17:15:55.755Z
substack: https://narthur.substack.com/p/spec-driven-dev-tuis-etc
---

<figure><img src="/writing/spec-driven-dev-tuis-etc/1.webp" alt="Pointillist painting showing a large, complex pattern gradually resolving into smaller, distinct elements. Each dot represents a small, manageable task. The viewer's eye naturally follows the flow from overwhelming complexity to organized simplicity." width="1024" height="608" loading="eager"></figure>

## Spec-Driven Development

We’re currently experimenting with adding a task planning phase to our process. We’ve moved to using Trello for our current primary client. I’ve created a template Trello card with checklists to help structure our planning:

---

**Planning**

- Init specification document
- Braindump (15m)
- Technical exploration (30m)
- Define user stories (10m)
- Punt capture (10m)
- Define scope and exclusions (10m)
- Draft PR breakdown, more PRs better (10m)
- Request async peer review

**Plan Review**

- Rate each PR size as S/M/L
- Can any planned PRs be split further?
- What's our riskiest assumption?

---

One thing we’re frequently poor at is keeping our pull requests small. This issue was the motivator for trying a planning step.

The times in parentheses are only suggestions. We’ve been using them as a starting point for time blocking. So we set a timer for the task and then assess whether we have more to do on that task when the timer is up.

Currently we’re using a private HedgeDoc instance for storing the specification documents for capturing this planning, though we may consider storing them as markdown files within the relevant repo itself, like \`plans/0001_my_new_feature.md\` or something.

Relatedly, I’ve been continuing to experiment with using [GitHub Spec Kit](https://github.com/github/spec-kit/tree/main) with TaskRatchet API. It seems like a really promising approach to add more scaffolding around using AI for programming. I haven’t gotten through a full iteration using the framework yet. I also understand that different AI models perform different with the framework, so may take some experimentation to get the best results.

## Terminal Tools

I’ve been installing and learning more terminal tools lately. Namely:

- [upterm](https://upterm.dev/) for session sharing
- [zellij](https://zellij.dev/) for an upterm-friendly multiplexer
- [podman](https://podman.io/) for an alternative to docker
- [git-branchless](https://github.com/arxanas/git-branchless) to improve git
- [zoxide](https://github.com/ajeetdsouza/zoxide) for a more-efficient cd command
- [posting](https://github.com/darrenburns/posting) as an alternative to postman
- [superfile](https://github.com/yorukot/superfile) for a terminal-based file manager
- [countdown](https://github.com/antonmedv/countdown) for bare-bones mob programming tracking (e.g. \`countdown 10m && say "Next"\`)
- [bin](https://github.com/marcosnils/bin) for managing github-hosted binary installation

Many of these are listed in [awesome-tuis](https://github.com/rothgar/awesome-tuis), and I plan to explore more of the tools listed there soon.

## Link Roundup

- [mob.sh](https://mob.sh/) is a terminal tool for mob programming that handles [git handovers](https://www.remotemobprogramming.org/#git-handover) under the hood. It’s a different approach to mob programming than I’m used to, but something I might like to try at some point.
- [Remote Mob Programming](https://www.remotemobprogramming.org/) is a page describing one approach to mob programming.
- [Round-robin coding](https://www.innoq.com/en/articles/2023/03/typist-wechsel-dich-remote-edition-code-uebergabe-mit-dem-mob-tool/) is a blog post on using mob.sh with mob programming.
- [This video](https://www.youtube.com/watch?v=Hju0H3NHxVI) is all about how [Peter Whidden](https://github.com/PWhiddy) created a GPU-optimized interactive ecosystem simulation called Mote as something half-way between a sandbox game and a tool for researchers.
