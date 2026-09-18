---
title: 'AI for Code Review: CodeRabbit'
date: 2025-08-19T16:55:02.346Z
substack: https://narthur.substack.com/p/ai-for-code-review-coderabbit
---

<figure><img src="/writing/ai-for-code-review-coderabbit/1.webp" alt="An impressionist painting of a cybernetic rabbit, inspired by the style of Claude Monet. The rabbit features subtle metallic elements, glowing circuitry, and a futuristic appearance, set in a serene, softly colored landscape reminiscent of Monet’s garden scenes, with delicate brush strokes and a dreamy, light-filled atmosphere." width="1024" height="608" loading="eager"><figcaption>A cybernetic rabbit (and a forged signature)</figcaption></figure>

Most of the focus on AI in software development is on AI writing the code. Most of what I’ve written in this newsletter has been focused on that. And there are no shortage of products building these features.

- [CodeBuff](https://codebuff.com/referrals/ref-6d348d54-80f1-4155-903b-2cc6c57dd12f) (referral link)
- [Warp](https://app.warp.dev/referral/ME5ELJ) (referral link)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Cursor](https://cursor.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [bolt.new](https://bolt.new/)

And dozens more.

But the AI tool that’s done the most to consistently increase the quality of my work isn’t any of these. It’s [CodeRabbit](https://www.coderabbit.ai/).

(Apologies for this post sounding salesy. CodeRabbit isn’t paying me anything, I promise.)

CodeRabbit is a GitHub application that watches for commits to pull requests. When it sees changes, it spins up, analyses the changes, adds a summary of the changes to the PR, and makes review suggestions.

And it’s great at it.

CodeRabbit isn’t the only option for AI-powered code review. [GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) has a similar feature. But in my experience its recommendations are limited and less reliable than CodeRabbit’s.

The feeling I get when I receive a good human review is “Nuts, they got me.” They found the places where I was slacking off, the things that in the back of my mind I knew could be better but hoped no one would notice.

CodeRabbit gives me that feeling on almost every pull request. And it feels great.

The closest I’ve gotten to understanding how they’ve managed to make CodeRabbit work so well is [this podcast interview on the Software Engineering Daily podcast](https://softwareengineeringdaily.com/2025/06/24/coderabbit-and-rag-for-codereview-with-harjot-gill/) ([transcript](https://softwareengineeringdaily.com/wp-content/uploads/2025/06/SED1844-CodeRabbit.txt)).

- They take advantage of their position in CI and prioritize depth of analysis over speed.
- They gather context using multiple strategies: static analysis, related GitHub or Jira issues, and learnings stored in CodeRabbit from previous user interactions on reviews in the same codebase.
- They spin up a sandbox containing the full codebase for their agents to use while reviewing a PR.
- They allow their agents to use a terminal within the sandbox in order to allow the agent to find any additional context it needs.
- They allow their agents to query the web in order to pull in up-to-date information.

Definitely listen to the full interview if you’re interested in further understanding how they’ve architected the system. It’s fascinating.

These tools don’t replace no-AI static analysis and CI checks. Having automated code quality checks that are deterministic and precisely defined provides a degree of assurance that it’s hard to imagine getting from an AI-powered tool.

But CodeRabbit appears to be doing an excellent job of providing much of the value of a traditional human code review—taking the context of the PR along with its knowledge of the codebase at large and any relevant best practices and distilling it into actionable suggestions for the developer.

My main hangup with CodeRabbit is their pricing model. They charge per assigned GitHub org seat.

This makes it challenging to use as an independent contractor who works in repositories scattered across multiple GitHub orgs. If I wish to use CodeRabbit on projects for three different clients, I have to coach each client through adding the CodeRabbit app to their GitHub organization (or get admin access to the org and do it myself), and then pay a separate subscription for my seat in each org. I’m unsure if this is mostly CodeRabbit’s fault, or if it’s at least partly due to how GitHub handles repository permissions for third-party applications.

CodeRabbit gives me a lot of optimism about how much improvement may be possible in existing AI-powered tools. It implies there may be much room to achieve gains by improving the architecture around the models they rely on, even if the models themselves improve only slowly.
