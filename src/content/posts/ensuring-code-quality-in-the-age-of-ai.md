---
title: 'Ensuring Code Quality in the Age of AI'
date: 2025-05-23T14:10:54.989Z
substack: https://narthur.substack.com/p/ensuring-code-quality-in-the-age-of-ai
---

<figure><img src="/writing/ensuring-code-quality-in-the-age-of-ai/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>Unmanaged speed, abstract</figcaption></figure>

I’ve been puzzling for a while now on how our strategies for ensuring software quality will need to change as we continue leaning more and more on AI coding tools. If my current experience holds true, the shift to AI for coding tends to:

- Significantly increase code output per developer
- Decrease developer understanding of code produced
- Introduce more variability in code quality
- Decrease test coverage compared to a reasonably disciplined developer

Given that list, you might think I view these AI tools as a net-negative for software quality. That’s probably true at present, but I think the story is more complicated than that.

My hypothesis:

Adding AI tools to an existing development workflow is increasingly like installing an incredibly powerful engine in an aging budget car. Exhilarating, but risky, since it was never designed to handle that much power.

At their core, AI tools add velocity, potentially a lot of it.

- Tab to accept lines, blocks, functions, even whole files.
- Never switch to Google or Stack Overflow when you get stuck—just type a question in your IDE’s sidebar.
- Ask an agent to implement features or execute refactors across entire code bases.

This amount of raw output increasingly strains our existing strategies for ensuring code quality.

- **Developer craft:** The less code a developer is manually writing themselves, the less impact their skill level is going to have on the quality of that code. While there are probably developers whose skill level is lower than the average output of AI coding tools, the variability in output quality of these tools makes this difficult to rely on.
- **Manual testing:** Of course we can manually test that the code an AI tool produced works. However, as AI tools become more and more agentic and more and more aggressive in making many edits at a time throughout a code base, the scope of the software that would need to be manually tested increases exponentially. Developers are unlikely to have the patience to do this type of thorough, repetitive, manual review.
- **Unit testing:** If you can ask an agent to implement an entire feature in one go, you’re unlikely to take a test-first approach. Most agents are inconsistent at best at including new tests in their edits. You can ask them to write tests after the fact, which they’re happy to do. But are you really going to read those tests carefully enough to ensure they accurately ensure your requirements? Probably not.
- **Code review:** Reviewing another developer’s code was already difficult enough—time consuming, confusing, unlikely to be effective in catching bugs. That’s why so many developers already do the bare minimum to qualify as a review. Increasing the amount of code produced per developer is only likely to increase these problems.

There is a class of tools that don’t suffer. It includes:

- Formatters and auto-fixers
- Linters and static analysis
- Strict type systems
- Record-and-playback testing
- Environment monitoring (whether in development, staging, or production)
- Tools that ease and/or automate rollback

These types of tools have multiple advantages:

- They do not require ongoing developer intervention or discipline to maintain efficacy over time.
- They do not require AI tools behave differently or more consistently than they currently do.
- They can be used to provide immediate feedback to AI tooling to immediately increase the quality of AI output.
- They can be integrated in continuous integration and deployment workflows to provide feedback and reduce risk at deploy time.

I’m interested in exploring further how this class of tools can be expanded, improved, or better leveraged to cover the loss of the practices AI seems to threaten.

#### Featured Project: _[Later](https://later.nathanarthur.com/)_

Back in the day there was a phone app called “Do It (Later)” that let you write down tasks you wanted to complete and postpone them until tomorrow. This is a super simple web clone of that, also adding some features I always wished the original had. I built it when I was first experimenting with what _[Codebuff](https://codebuff.com/referrals/ref-6d348d54-80f1-4155-903b-2cc6c57dd12f)_ could do (one of the AI coding tools I’ve been loosely referring to).
