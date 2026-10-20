---
title: 'Agent Fieldnotes for Persistent Context'
date: 2026-10-20T14:51:00.000Z
---

I've found that Claude Code works far better when it has access to all the context it needs, and can proactively save new information to a location where it can retrieve that information later. I've achieved this by giving it access to my Obsidian vault, and additionally giving it a folder inside the vault where it explicitly has permission and is encouraged to create notes and store information about what we're working on as we work on it.

I call these notes "fieldnotes." I have [a `/fieldnotes` skill](https://gist.github.com/narthur/b57baeaa3d2c3d90a46f05f74998c819) that tells Claude how to use the folder. Additionally I have this section in my global `CLAUDE.md` file which is loaded in every session and every project:

> \# Fieldnotes
>
> There is an Obsidian folder called Fieldnotes at `$OBSIDIAN_VAULT/Fieldnotes` that supplements the auto-memory system. Use it for structured knowledge and project information shared between you and the user.
>
> See the `/fieldnotes` skill for full conventions on what belongs there and how to use it. Always read relevant Fieldnotes before starting work on a project or topic, and update them after completing work.
>
> Maintaining Fieldnotes is proactive and does not require permission. Read, create, and update notes on your own initiative as part of doing the work — don't ask whether to record something or wait to be told. (This covers Fieldnotes upkeep only; it is not blanket authorization for unrelated outward-facing actions.)

You might ask whether this is necessary given Claude Code already has a built-in memory system. These two systems serve different purposes. Claude Code's memories are short, usually one fact per file. Fieldnotes are meant to be exhaustively detailed, including all the information we know about a given project or task. On my system Claude's memories average about 180 words in length, where as fieldnotes average more than 1,300 words each.

Claude Code's memories are stored in per-project folders inside `~/.claude/projects`. Fieldnotes are meant to be more flexible, allowing Claude to use whatever folder structure it desires and create as many or as few notes as it wishes for any given task or subject. Practically this has meant an almost-entirely flat list of notes.

Additionally, I prefer having a system that is fully in my control and portable. A folder of markdown files located where I choose and backed up automatically achieves this. Trying to add a backup job on top of Claude's memories folder is more akin to using an undocumented API, hoping that Anthropic never decides to move the location of the files, what Claude is instructed to store in them, or the file format in which they are stored.

I've been using this setup since early May of this year. So far Claude Code has created more than 150 notes containing more than 360,000 words total. I've found that this approach is especially helpful for allowing Claude Code to remember all the relevant details on a project across sessions or after the current session is compacted.
