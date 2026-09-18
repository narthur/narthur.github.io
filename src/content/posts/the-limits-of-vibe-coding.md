---
title: 'The Limits of Vibe Coding'
date: 2026-08-27T17:53:25.836Z
substack: https://narthur.substack.com/p/the-limits-of-vibe-coding
---

<figure><img src="/writing/the-limits-of-vibe-coding/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

I’ve been thinking about where we’re at with vibe coding, defined as the ability of non-technical people to build and maintain software using LLMs.

My conclusion: Vibe coding works great as a way to quickly build small prototypes and jump-start new applications. But it falls short when it comes to maintaining quality software for the long-term.

The reasons are these:

- LLMs do what you ask them to do, and avoid getting sidetracked.
- A non-technical person doesn’t have the vocabulary of software architecture.
- A non-technical person doesn’t have the ability to attribute difficulty in developing the software to the underlying architectural problems.
- Good architectural decisions are made where software architecture, the domain, and the roadmap overlap.
- The world changes.

#### LLMs Do What You Ask

By design, LLMs do what you ask them to do and avoid doing what you don’t ask them to do. This is normally what you want. You have a task to complete—a feature to add, a bug to fix, a design change to make. You don’t want the LLM getting distracted by a side quest.

What this means, though, is that code messes don’t get cleaned up. As long as the LLM mades a little bit of a mess even a small percentage of the time, the codebase is likely to degrade over time. And the non-technical builder doesn’t have the ability to look at the code, see where the mess is, and ask the LLM to clean it up.

#### Lacking the Vocabulary of Software Architecture

A non-technical person can tell an LLM what they want to build. They can describe the features they want and how it should look and behave. But they don’t have the knowledge of software architecture to know how to ask the LLM to structure the codebase. So the LLM will make a best guess.

#### Lacking the Ability to Attribute

As a codebase becomes messier, the LLM begins to struggle making the user-visible changes the builder asks for. But without the knowledge of what makes for good code and what makes a project well-structured, the builder is ill-equipped to know where to point the LLM to have it correct the situation. The builder is likely to attribute the trouble to poor prompting or the model becoming dumber, instead of on underlying code smells.

#### The Architectural Decision Nexus

You might think the solution would be to simply tell the LLM to “use good architecture,” or otherwise give it a philosophy of architecture to work from.

The problem is that good architectural decisions can’t be made in a vacuum. Choosing an architecture is deciding what should be hard in the future and what should be easy. And that depends on your domain model and your product roadmap. Starting with good software architecture principles is not enough.

Architectural decisions are bets on how the context of your application will change over time, and choosing how to structure your codebase in an attempt to make it easy to adapt to those shifts.

#### The World Changes

Software is never finished. This is because the context in which it lives is always changing. User needs change. Hardware substrates change. Protocols change. The languages, libraries, and frameworks we depend on change. The security landscape changes. What’s considered “best practice” changes. A perfectly clean, sane codebase slowly turns into a poorly-optimized mess over years, even if no one’s modified it. The ground moves.

---

I wouldn’t bet on this state of affairs being permanent. Perhaps someday we’ll have fully-autonomous agents that proactively track the context of a piece of software and update its architecture accordingly. Consider this to be a snapshot in time of the challenges faced by non-technical builders who want to push their vibe coding to the limit.
