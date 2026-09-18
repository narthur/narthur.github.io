---
title: 'AI for business data & using AI coding tools responsibly'
date: 2025-04-25T16:52:22.047Z
substack: https://narthur.substack.com/p/ai-for-business-data-using-ai-coding-tools-responsibly
---

<figure><img src="/writing/ai-for-business-data-using-ai-coding-tools-responsibly/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>Abstract representation of the joining of business data and artificial intelligence</figcaption></figure>

### AI for Querying Business Data

I’ve been thinking lately about how to make it easier for me to query my own business data—information bout clients, contracts, our own tools and processes, etc, etc.

One of my pain points when working with clients is that often they’ll ask questions about things that I don’t currently have loaded in my head, and then I need to go figure out what the correct answers are and how to translate the answer to be understandable to the client. This can be disruptive and frustrating.

I talked to my business coach, _[Philip Hellyer](https://www.hellyer.net/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_, about this, and he suggested that I might use one of the AI chat products to reduce this friction, whether by manually adding documents to something like ChatGPT or building something more automated.

Of course, as a developer it’s very tempting to jump to the over-engineered solution. Automatic archival of business data into an S3-like data lake, then ingest the data into things like _[Voyage AI](https://www.voyageai.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_ and _[Zep](https://www.getzep.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_. And expose it all via custom Discord and Slack bots.

I did recently hear an add for a product that’s trying to solve a similar issue I think—_[Informatica](https://www.informatica.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_. Seems like basically what I’m talking about, that being an AI-forward data lake solution. Though it being so enterprise-focused I doubt it would actually be a good solution for me.

### Being More Responsible with Git & AI

I recently watched this video about how to be responsible when using AI coding tools. It’s a good watch.

Theo’s main point is that the more we use AI to write code, resulting in more code for less time, the more we need to shift our time to reviewing the code we’ve generated. Basically Theo’s stance is that more manual code review is better and the direction we should be moving.

I’m not sure how I feel about this. I feel like the more we increase the velocity of our code generation the more we need to put effort into new approaches to automated review, validation, and rollback. That doesn’t necessarily mean using AI to automate code verification (though that could be part of a solution). At this point I feel like most of that should be non-AI tooling. Things like (the maybe-dying and probably-much-less-AI-than-their-marketing-implies) _[Meticulous](https://www.meticulous.ai/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_.

One thing I didn’t know before watching the video was the command `git add -p`, specifically the `-p` option. It allows you to review the work you’ve done on your local machine, hunk by hunk, and decide whether or not to stage each change individually. I’ve been using it a ton since watching Theo’s video. It’s great.

### Interesting Stuff

- _[reviewdog](https://github.com/reviewdog/reviewdog?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_ is a tool for programmatic posting of review comments to GitHub.
- Convex just released _[Convex Chef](https://news.convex.dev/meet-chef/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_, another AI app builder, but this one promising to do much better at the backend stuff. (_[Convex](https://www.convex.dev/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_ is the backend service that the _[Codebuff](https://www.codebuff.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_ team recommends)
- _[ncc](https://github.com/vercel/ncc?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_ is a tool for compiling a Node.JS module to a single file. I recently used it when I was building my new experimental GitHub action, _[UVI Finder](https://github.com/marketplace/actions/uvi-finder?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_.

#### Enjoyed this issue?

Consider doing one of the following:

- 📬 Forward this email to someone you think would enjoy it
- ✨ *[Check out](https://nathanarthur.com/?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)* all the other things I’ve been working on
- ☕ _[Join my Ko-fi](https://ko-fi.com/narthur?utm_source=narthur.beehiiv.com&utm_medium=referral&utm_campaign=ai-for-business-data-using-ai-coding-tools-responsibly)_ to provide ongoing support, or just leave a tip
