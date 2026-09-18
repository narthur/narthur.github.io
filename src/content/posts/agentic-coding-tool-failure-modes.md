---
title: 'Agentic Coding Tool Failure Modes'
subtitle: 'When and why do these tools fail? And how can we get better at avoiding these problems?'
date: 2025-07-14T16:40:22.612Z
substack: https://narthur.substack.com/p/agentic-coding-tool-failure-modes
---

<figure><img src="/writing/agentic-coding-tool-failure-modes/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>Abstract, minimalist, non-representational impression of AI coding tools breaking down</figcaption></figure>

I’ve been using agentic coding tools off-and-on for quite a while now. Mostly:

- [Codebuff](https://codebuff.com/referrals/ref-6d348d54-80f1-4155-903b-2cc6c57dd12f) (referral link)
- [Warp](https://app.warp.dev/referral/ME5ELJ) (referral link)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)
- [GitHub Copilot](https://github.com/features/copilot)

They definitely have advantages:

- I find that I can work with them longer without serious fatigue or when I’m already too fatigued to code without them.
- At their best, they can find solutions that are more straight-forward, elegant, or idiomatic than I would have found on my own.
- They know a little of just about everything, reducing the need for me to do a bunch of research before I can get started on something.
- They can operate as rubber-duck partners for helping you get unstuck when you’ve been looking at a problem for a long time.

However they still have drawbacks, and I’d like to document the ones I’ve run into consistently here.

- If they don’t have a good idea on how to do something, they will often persist, trying over and over, until they’ve worked themselves into an over-complicated position which may or may not actually solve the problem.
- Depending on the tool, they may not consistently discover the correct context within the repository, resulting in them making similar mistakes or bad assumptions in the same project.
- They tend to be expensive, or they have usage limits that you’re likely to run into quickly if you’re using them seriously.
- Using them extensively can result in having code bases that you largely don’t understand, reducing your ability to work in the codebase yourself or spot issues with future work done by an AI tool.
- They still hallucinate to varying degrees, which can result in incorrect documentation if they’re involved in writing it, or a lot of wasted time spent based on something they told you which is simply wrong.
- They may not work well with the latest tools or tool versions based on when they were trained and the extent to which they have access to up-to-date documentation.

I feel confident that these tools will continue to improve, and that these problems will likely be solved over time. However, for the time being, they still exist, and I’d like to learn how to better compensate for these issues.

Currently I’m fairly cautious about how I use these tools on client work because of these limitations. The better I can get at avoiding these problems, the more I can make use of them in client projects.

One approach to solving some of these issues is to give the tools access to more and better-quality documentation. This can be:

- Scraping documentation sites and storing the saved documentation in the repository.
- Ensuring the tool has access to MCP services for searching the web or otherwise accessing up-to-date documentation.
- Leveraging tool-specific methods for adding “rules” and other forms of guidance, such as Claude Code’s [CLAUDE.md files](https://www.claudecode.io/tutorials/claude-md-setup).
- Working with the tool itself to add and update documentation.

I’ve found that last option to be the most fraught. There seems to be a lot of variance around how well these tools are able to produce accurate, valuable documentation. And if you aren’t careful, you end up with high-volume low-quality documentation which just confuses both us developers and the tools themselves more.

I’ve tried a few tools that are designed to produce documentation for a repository, either using AI or more-traditional static analysis, or a combination. I’ve even played around with creating my own such tool. They all seem to have their own drawbacks. Here’s a list, some of which I’ve tried and some I haven’t.

- <https://www.doxygen.nl/index.html>
- <https://deepwiki.org/>
- <https://www.sphinx-doc.org/en/master/usage/quickstart.html>
- <https://docs.swimm.io/>
- <https://workik.com/ai-powered-code-documentation>
- <https://github.com/ingig/code-narrator>
- <https://scribe.knuckles.wtf/laravel>
- <https://www.docuwriter.ai/>
- <https://docs.codegpt.co/docs/tutorial-features/code\_documentation>
- <https://mintlify.com/docs/guides/claude-code>
- <https://github.com/connor-john/ai-docs>
- <https://github.com/fynnfluegge/doc-comments-ai>
- <https://bito.ai/blog/ai-documentation-generator/>

In the past, Codebuff promised to do this kind of thing iteratively, creating and updating knowledge.md files throughout your codebase as it went. However it’s seemed to become less of an emphasis over time, and the tool doesn’t seem to do this very often. Though with Codebuff’s more-recent customization options, you might be able to configure it to do better.

- <https://www.codebuff.com/docs/agents>
- <https://www.codebuff.com/docs/advanced#configuration>

I think in the future it would be nice if CI-time tools like [CodeRabbit](https://www.coderabbit.ai/) were better at automatically suggesting improvements and new additions to a repo’s documentation based on changes made in each pull request. Perhaps you could get closer by adding [custom review instructions](https://docs.coderabbit.ai/guides/review-instructions)?

Currently my biggest complaint with CodeRabbit is that there isn’t a clear way for me to easily use it with client repositories I don’t own. Currently I can get a review on changes to these projects using their VS Code extension, but this is pretty inconvenient since my daily-driver is Zed, not VS Code.
