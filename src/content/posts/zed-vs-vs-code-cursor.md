---
title: 'Zed vs VS Code & Cursor'
date: 2025-05-02T17:11:32.492Z
substack: https://narthur.substack.com/p/zed-vs-vs-code-cursor
---

<figure><img src="/writing/zed-vs-vs-code-cursor/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>Abstract computer code in several colors</figcaption></figure>

### Giving Zed Another Look

Recently my brother and I have started using _[Zed](https://zed.dev/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ again. Zed is a competitor to _[VS Code](https://code.visualstudio.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_, built by _[some of the same folks](https://zed.dev/team?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ behind _[Atom](https://atom-editor.cc/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_.

When I tried Zed previously it seemed like a really neat project that wasn’t ready for me to use yet, missing language features I relied on. It seems like it’s come a very long way since then, with an impressive list of _[supported languages](https://zed.dev/docs/languages?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_.

The reason we’re trying Zed out again now is because of the issues we’ve had recently with multiplayer pairing in VS Code and Cursor. We’ve used Microsoft’s _[Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare&utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ plugin for a long time now, and it’s worked great. However since I’ve switched to Linux and started using _[Cursor](https://www.cursor.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ (a fork of VS Code), it’s become pretty much impossible for us to use. We tried switching to another VS Code extension called _[Open Collaboration Tools](https://marketplace.visualstudio.com/items?itemName=typefox.open-collaboration-tools&utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_, but we’ve found it to be unreliable.

Unlike VS Code, _[Zed has collaboration built-in](https://zed.dev/docs/collaboration?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_. And after our recent struggles with VS Code-based IDEs, it’s been a big relief.

A few observations after just a couple of days back in Zed:

- Zed’s collaboration features are fantastic, though not intuitive on first attempt. However once we figured out how to use them, they work very well, and I think we already prefer Zed’s implementation to how Live Share works.
- So far this time I’ve only used Zed for a fairly standard Node server-side project. But I was very impressed how well it worked out of the box. It immediately began showing me TypeScript and eslint warnings inline. I’ll be interested to see how it holds up when I throw other stacks at it. I’m especially interested in how it handles Ruby. Whether because of my lack of Ruby experience or due to something generally lacking in VS Code’s ecosystem, I’ve never had a good experience working with Ruby in VS Code.
- So far Zed is very fast. I know that’s been a big focus for the Zed team. I’ll be interested to see if the speed advantage persists as I continue customizing my Zed configuration and installing more extensions.
- Zed has _[their own hosted AI service](https://zed.dev/blog/zed-ai?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ powering their code completions and chat assistant. It’s unclear to me what the pricing for their AI features is or will end up being, though so far I haven’t needed to pay to use it. So far it’s passable. Definitely worse than Cursor. Zed does allow you to use GitHub Copilot or your own AI API keys. Though I have a feeling that I’d still prefer Cursor to Zed due to Cursor’s multi-line edit suggestions, smart rewrites, cursor prediction, and agentic assistant mode. Zed has some serious catching up to do.

### Some Interesting Things

- _[JetBrains](https://www.jetbrains.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ has a product called _[Junie](https://www.jetbrains.com/junie/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ which appears to be their agentic coding tool. I used JetBrains IDEs for years when I first started in web development. They make quality software, so I wouldn’t count them out yet.
- _[AnythingLLM](https://anythingllm.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ is an AI desktop tool that allows you to provide your own API keys. The biggest reason I gave it a go was that they make it easy to install it on Linux. It seems to have a good set of features. I’m not sure how much use I’ll actually get out of it.
- _[Hashnode](https://hashnode.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ is a service for building technical blogs and documentation sites. I’m especially interested in whether their GitHub integration makes them a viable alternative to _[GitBook](https://www.gitbook.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_. Unfortunately Hashnode’s GitHub integration is on their $200/month plan, which is far too rich for me.

#### Enjoyed this issue?

Consider doing one of the following:

- 📬 Forward this email to someone you think would enjoy it
- ✨ *[Check out](https://nathanarthur.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)* all the other things I’ve been working on
- ☕ _[Join my Ko-fi](https://ko-fi.com/narthur?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=zed-vs-vs-code-cursor)_ to provide ongoing support, or just leave a tip
