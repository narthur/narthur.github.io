---
title: 'Issue 0'
date: 2025-04-20T16:41:00.000Z
substack: https://narthur.substack.com/p/issue-0
---

<figure><img src="/writing/issue-0/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>“A single unopened envelope, still life.” Also a forged signature.</figcaption></figure>

This is issue zero! Thanks for being here.

Definitely reply if you have thoughts on the content, format, or whatever. (I think you can do that? I guess let me know if replying to this email doesn’t work, either. My email is _nathan@pinepeakdigital.com_)

Hope you’re having a great weekend!  
Narthur

### Documentation Scraping

I've been experimenting with scraping documentation and adding it to my repositories to improve the effectiveness of tools like Codebuff and Cursor. Initially I've been using _[mdCrawler](https://github.com/AiCodingBattle/mdCrawler)_ for this purpose, but I've also been experimenting with building my own repo to crawl a whole list of documentation sources. So far I've been using _[crawler](https://www.npmjs.com/package/crawler)_ and _[turndown](https://www.npmjs.com/package/turndown)_ for the experiment.

### Building Agentic AI

I recently watched Microsoft's _[beginner course to building agentic AI](https://www.youtube.com/watch?v=OhI005_aJkA)_. And then I built a proof-of-concept agentic system to break down a project into a series of tasks and estimate the time needed to complete each task. I used _[Praison](https://github.com/MervinPraison/PraisonAI)_ as my framework to build the tool, along with Codebuff and scraped docs as described above, and _[Zep](https://www.getzep.com/)_ for semantic memory. It was surprisingly easy to get something set up and working, though I'm not sure how much more effort it would take to make the tool perform consistently when it comes to accuracy.

### Using AI in Pull Requests

I've been experimenting with Copilot's new PR-focused features, including _[generating PR summaries](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-for-pull-requests/creating-a-pull-request-summary-with-github-copilot)_ and _[requesting a PR review from Copilot](https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review)_. It also has features for _[iterating on a PR](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-for-pull-requests/using-copilot-to-help-you-work-on-a-pull-request)_ but I haven't tried that yet.

I've also been trying out using _[Meticulous](https://www.meticulous.ai/)_ to automatically test PRs. Their marketing material uses the term AI a ton, I'm not sure how much that's actually true yet. But regardless the concept seems really useful.

Basically you add a script to your site that records your sessions, but only when in development and staging. So you aren't recording end users. When you make a PR, Meticulous then selects a subset of these sessions and replays them both against your PR preview and your production environment. It then generates a report of differences, which you can choose to approve or not. Really neat idea, especially as we may be moving further and further toward "vibe coding."

### More Interesting Things

- _[JS Engine](https://www.moritzjung.dev/obsidian-js-engine-plugin-docs/)_ lets you run JavaScript inside your Obsidian notes. Plus same person's _[built some other interesting Obsidian plugins](https://www.moritzjung.dev/obsidian-collection/)_, too.
- _[Lynx](https://lynxjs.org/)_ is yet another write-once-deploy-anywhere tool set. Anything that pushes us closer to a web-technology-everywhere future is a win in my book.
- _[FilePizza](https://file.pizza/)_ is a browser-based peer-to-peer file transfer tool.
- _[SST](https://sst.dev/)_ is an infrastructure-as-code framework. Maybe similar to Terraform? Maybe better?
- _[Hydrogen](https://hydrogen.shopify.dev/)_ is Shopify's official framework for building custom Shopify storefronts.
- _[bolt.new](https://bolt.new)_ lets you prompt to create an entire web or mobile app in a single go. I literally said "build me a tic tac toe game" and _[this is what it created](https://endearing-gumdrop-a2ee14.netlify.app/)_ and then deployed to Netlify for me.
- _[DSNP](https://www.projectliberty.io/dsnp/)_ is a decentralized social networking protocol (oh, right, that's what it stands for). How does it relate to the AT protocol, ActivityPub, and the _[Fediverse](https://en.wikipedia.org/wiki/Fediverse)_? I don't know. I try to stay off social media.
- Beeminder-friend Mary just published a new _[visual time management app](https://time-stream.app/)_ for iOS.
- Anthropic recently added _[a new $100 Max tier](https://www.anthropic.com/news/max-plan)_
- Anthropic also added a new _[research feature](https://www.anthropic.com/news/research)_ that looks to be a combination of reasoning and gathering context via multiple searches both of the open web and any of your own information you may have given Claude access to.
- _[Zep](https://www.getzep.com/)_ is an API for building and referencing a semantic knowledge graph as a kind of memory for AI applications.
- _[Zep](https://www.getzep.com/)_ published a blog post on _[The One-Token Trick](https://blog.getzep.com/the-one-token-trick/?ref=zep-news-newsletter)_ in which they explain how they’ve leveraged OpenAI’s API to determine the relevance of search results while reducing cost by limiting the LLM’s response to a single token.
- _[Lovable](https://lovable.dev/)_ is yet another AI-powered app builder.
- _[This article](https://gameofbricks.eu/blogs/news/how-to-light-up-legos-and-choose-the-right-lego-lighting-kits)_ is a deep-dive on choosing the right products to add lighting to your LEGO sets. I’m especially intrigued by _[Brickstuff](https://www.brickstuff.com/)_’s modular lighting system.
- _[Voyage AI](https://www.voyageai.com/)_ is a third-party embeddings API _[recommended by Anthropic’s documentation](https://docs.anthropic.com/en/docs/build-with-claude/embeddings)_.
