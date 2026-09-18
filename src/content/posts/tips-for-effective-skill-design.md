---
title: 'Tips for Effective Skill Design'
date: 2026-07-30T17:52:55.090Z
substack: https://narthur.substack.com/p/tips-for-effective-skill-design
---

<figure><img src="/writing/tips-for-effective-skill-design/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

Just about seven months ago I [started](/writing/fast-pr-feedback-review-with-saved) [experimenting](/writing/iterating-on-a-pr-extraction-workflow) with building my own skills. Since then it’s become [the primary way](https://github.com/narthur/dotfiles/tree/main/.claude/skills) I encode and iterate on my work tasks, programming and otherwise. Here are a few lessons I’ve learned about skill design. I’ll be referring to Claude Code throughout, but you can substitute your preferred agentic coding tool.

**Don’t hand-write your skills.** Let Claude draft skills for you. The first draft isn’t supposed to be perfect. You’ll be iterating on it, so it’s inefficient to put a lot of energy into hand-crafting your skills.

**Have your skills use scripts.** Claude Code skill folders can contain any type of file, not just markdown files. Make use of this by including scripts in your skills that handle all the deterministic stuff that doesn’t actually need an LLM. This will reduce your token costs and improve the reliability of your skills.

**Leverage subagents.** Claude skills can instruct Claude to spin up subagents to handle portions of your task. Depending on the situation, this can improve result quality, increase speed, and even reduce costs. It can improve result quality by managing context, either preventing Claude’s main thread from becoming bloated or sandboxing something inside a subagent that shouldn’t have access to the main thread, like an independent reviewer. It can increase speed by parallelizing subtasks. And it can reduce costs when a portion of the task doesn’t need the model you’re using on the main thread and can be delegated to a cheaper model.

**Use progressive disclosure.** Not everything should go in a skill’s main SKILL.md file, only the stuff that is applicable to nearly every run of the skill. Anything that is conditional or situational should be extracted into separate markdown files in the skill’s folder, and referenced in the main SKILL.md file along with whatever condition should result in the skill loading that file into context. This approach makes it less likely that the skill becomes distracted by something not relevant to the current run, and reduces token costs.

**Keep your skill descriptions sharp.** The description should state when a skill should be invoked, not summarize what the skill does. This improves Claude Code’s ability to trigger the right skills at the right time.

**Let your skills learn over time.** This allows your skills to become better over time without needing to explicitly work to improve them. Example: In a playwright skill I built, I have the skill record website-specific learnings after each run to files in a websites subfolder of the skill.
