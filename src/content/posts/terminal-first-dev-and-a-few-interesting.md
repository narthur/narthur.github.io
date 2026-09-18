---
title: 'Terminal-First Dev & a Few Interesting Links'
date: 2025-10-03T17:16:58.346Z
substack: https://narthur.substack.com/p/terminal-first-dev-and-a-few-interesting
---

<figure><img src="/writing/terminal-first-dev-and-a-few-interesting/1.webp" alt="Abstract painterly illustration representing command-line workflow, flowing streams of text and code transforming into organized structures, dark background with luminous green and blue terminal colors, expressionistic brushwork, sense of movement and efficiency, contemporary digital art style" width="1024" height="608" loading="eager"></figure>

## Terminal-First Development

I’ve been challenging myself recently to see how much of my work I can do from a terminal rather than in a browser or an IDE.

The reason I started thinking about this was because I’ve been getting more comfortable using GitHub’s coding agent to execute tasks, and the workflow is really nice:

- Create a GitHub issue
- Capture any info in the issue about the task
- Comment on the issue asking CodeRabbit for input
- If new issues should be created based on the issue, comment on the existing issue asking CodeRabbit to create the new issues
- Once the issue is ready for execution, assign the issue to Copilot
- Review the changes in Copilot’s PR
- Request a review from CodeRabbit on Copilot’s PR
- Optionally reply to CodeRabbit’s review comments asking it to create new follow-up GitHub issues
- Optionally comment on the PR asking Copilot to address feedback
- Merge the PR

I’ve been making a surprising amount of progress with TaskRatchet this way. And it struck me that nothing here requires a browser—GitHub’s CLI lets you do everything on that list (with a couple of annoying exceptions—assigning an issue to Copilot and viewing CodeRabbit’s inline code comments).

So for the past couple of days I’ve been seeing how much I could get done while avoiding the browser and even the IDE most of the time. And it turns out to be quite a bit.

## Adapting My Terminal

What follows may be a sort of random collection of things I’ve done to my setup as a part of this experiment.

I added a shell script and corresponding saved AI prompt in Warp to have Warp AI scaffold out and complete issues which are then submitted to GitHub using the GitHub CLI.

I installed Navi for searching through command-line cheatsheets and [created a repo](https://github.com/narthur/cheats) to begin creating my own cheat files.

I installed the Perplexity plugin for [llm](https://github.com/simonw/llm) and created a bash function to let me use \`perplexity\` to quickly jump into a web-backed chat without needing to open the browser.

I installed TaskWarrior and BugWarrior to let me sync GitHub issues and PRs with a terminal-based task list.

I can view and edit files directly in Warp using nano or [Warp’s editor features](https://docs.warp.dev/code/code-editor).

I installed [fd](https://github.com/sharkdp/fd?tab=readme-ov-file) and [ripgrep](https://github.com/BurntSushi/ripgrep/tree/master) for easier file searching.

I’m using [Superfile](https://github.com/yorukot/superfile) for an in-terminal file manager.

I’ve installed [ddgr](https://github.com/jarun/ddgr) to let me search the web using DuckDuckGo from the terminal.

## Benefits?

So far I’ve only mentioned this experiment to two people (one being my brother) and both had the same response—why? Here they are:

- To find out if I could
- To get better at using the terminal and terminal-based tools
- To move more of my processes into a place where it’s more natural to request the assistance of AI, and for AI to tie multiple tools and sources of information together
- To explore how I could automate and streamline my processes and workflows
- To explore whether terminal-based workflows could be less distracting and more ADHD-friendly

We’ll see how the experiment goes.

## Link Roundup

- [TaskRatchet](https://taskratchet.com/) has a new competitor—[Mastt](https://mastt.app/). (ht [Daniel Reeves](https://agifriday.substack.com/)) It appears they’re building an iOS app. I’ll be interested to see if they’re able to stay in the app store long-term, given the experiences I’ve had with Apple’s internal reviews of TaskRatchet.
- [Cari](https://cari.institute/) is a super interesting site featuring collections of images illustrating many different consumer product styles.
- [WalkScape](https://walkscape.app/) is a gamified walking app currently in closed beta.
