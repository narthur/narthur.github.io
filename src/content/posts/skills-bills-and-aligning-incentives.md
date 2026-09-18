---
title: 'Skills, Bills, and Aligning Incentives'
date: 2026-03-04T18:27:24.542Z
substack: https://narthur.substack.com/p/skills-bills-and-aligning-incentives
---

<figure><img src="/writing/skills-bills-and-aligning-incentives/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

[Claude Code skills](https://code.claude.com/docs/en/skills) are eating my development process. They can be used to assist me with basically anything I do as a developer.

- Documenting codebases
- Reviewing business finances
- Generating development reports for clients
- Summarizing recent team activity
- Grooming GitHub issues
- Working through PR review backlogs
- Organizing file systems
- Fixing CI failures
- Testing features and bug fixes across environments using Playwright
- Etc

I find that they have big advantages to other ways I might try to solve the same issues.

- They crystallize knowledge and give distinct pieces of knowledge handles, reducing the demand on my long-term memory.
- They allow for creating flexible, interactive workflows for given tasks, allowing me to maintain focus and reducing demand on my short-term memory.
- They are easily improved over time without switching contexts. A skill didn’t work the way I’d like it to? Just ask the system to update it to behave better.
- They can be designed to be self-improving, by instructing them to update themselves on each use.
- They don’t pollute AI coding tool context windows, since AI tools only pull them in when they are relevant (or when you’ve explicitly pulled them in as a slash command).

With all these advantages, I’ve been doing my best to lean fully into using them. I’ve created many personal skills that are available in any project I work on, and I’ve started moving other forms of developer documentation and coding agent context files to skills in the projects where I have the leeway to do so.

Our current clients are billed hourly. This meant that, if we didn’t do something to address the issue, we’d be disincentivized to use agent skills to the extent that we should. No one wins if we cheap out and take longer to do poorer work at a higher price.

To address this, I’ve set up [a bare bones system](https://github.com/narthur/dotfiles/blob/main/.claude/TOKEN_ATTRIBUTION.md) that allows me to track the tokens I spend for each of my clients and then bill them for those tokens separately from our hours.

Currently its big downside is that it only runs on my machine. In the future I’ll need to figure out a way to send the data to something on the web so that any subcontractors I’m working with can also track their tokens and have them billed and reimbursed.

### Links Roundup

- [Opik](https://www.comet.com/site/products/opik/) — LLM observability platform
- [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — Claude Code compound engineering plugin
- [jayminwest/mulch](https://github.com/jayminwest/mulch) — Structured expertise files that accumulate over time, live in git, work with any agent
- [jayminwest/kotadb](https://github.com/jayminwest/kotadb) — Local code intelligence API for AI dev workflows (Bun + SQLite)
- [jayminwest/agentic-engineering-book](https://github.com/jayminwest/agentic-engineering-book) — Growing guide to building agentic systems
- [stephendolan/ynab-cli](https://github.com/stephendolan/ynab-cli) — YNAB CLI with JSON output optimized for LLMs
- [remotion-dev/remotion](https://github.com/remotion-dev/remotion) — Make videos programmatically with React
- [tambo-ai/tambo](https://github.com/tambo-ai/tambo) — Generative UI SDK for React
