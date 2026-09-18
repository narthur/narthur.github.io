---
title: 'AI After TDD, pt. 3: Preserving Risk Management'
subtitle: 'How can we mitigate code risk without writing tests by hand?'
date: 2025-06-13T17:39:29.054Z
substack: https://narthur.substack.com/p/ai-after-tdd-pt-3-preserving-risk
---

<figure><img src="/writing/ai-after-tdd-pt-3-preserving-risk/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>An abstract, minimalist representation of the concept of risk, inspired by intricate systems in which small changes can have unexpected consequences.</figcaption></figure>

---

Previous posts in this series:

1. [Is Test-Driven Development Dead?](/writing/is-test-driven-development-dead)
2. [AI After TDD: Keeping Test Coverage High](/writing/ai-after-tdd-keeping-test-coverage)

---

The second benefit I listed in [part one](/writing/is-test-driven-development-dead) was this:

“This [high test coverage](/writing/ai-after-tdd-keeping-test-coverage) makes changing existing code less risky.”

How do we preserve this benefit without strict test-driven development?

A codebase that doesn’t have this property is painful to work with. A small change in one place may result in something, perhaps seemingly unrelated, breaking in another part of the codebase.

If you think the project you’re working in is this way, you’re likely to try to make as small a change as possible, regardless of whether it improves the quality of the codebase or not, in order to reduce your exposure to these unpredictable regressions. This can result in the codebase becoming more difficult to work with over time, as pragmatic hacks accumulate and refactoring is avoided.

At its best, test-driven development addressed this issue by creating a large collection of alarms that would trigger as soon as you had caused a regression, regardless of where it was in the codebase. So you could be more aggressive with your code changes without fear that you were creating chaos in parts of the system you had forgotten or didn’t yet understand.

Much of what I wrote in [part two](/writing/ai-after-tdd-keeping-test-coverage) applies here, too.

- Test coverage thresholds
- Automated test generation
- Recording-and-playback tools

These are all likely to preserve some of the risk mitigation we’ve gotten from TDD by simply retaining much of the test coverage we used to have, just in a different way.

What follows are additional tools and strategies for achieving the same benefit. Fair warning: This is a lot of back-to-the-basics talk.

#### Type Systems

Typed languages in effect create a separate layer of tests. If you make a change to the type annotations or inferred types in one part of the system, you are able to receive feedback quickly on whether this change is compatible with many other parts of the system.

For our purposes, a type system should:

- Apply throughout the entire codebase, either by inference or explicit annotation.
- Provide rapid feedback (IDE hinting, CLI commands, compile-time errors).

With these two properties, a typed language can go a long way to removing anxiety around changing code.

#### Static Analysis

This overlaps with the use of type systems, but also includes any linting tool that scans your code without running or compiling it to find potential style or logic issues with the code. Linters tend to be less concerned with application functionality and more with code quality, style, and convention. Though they can also hint at things that may be a mistake.

#### Version Control

Knowing that every change you’ve made is safely stored to be reviewed and perhaps reverted makes a big difference.

#### Rapid Rollback

Relatedly, the ability to rapidly roll back a production environment is likely to become more valuable.

- Rollback to any previous state (e.g. deploy or commit) should be as close to one click as possible.
- The process for initiating a rollback should be well-documented to avoid needing to rediscover the process during an active incident.

It might be valuable to schedule a kind of “rollback fire drill” on a regular schedule. This way those who would be responsible for doing the rollback remain familiar with the process, and there’s a regular opportunity to spot opportunities to improve or simplify the process.

---

I have the uneasy feeling that there’s more to do here, but I have a hard time imagining what. What are other tools and processes that will help us remain nimble without large hand-written test suites? Especially: What tools will we need to invent?
