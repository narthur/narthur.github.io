---
title: 'Goodbye Substack'
date: 2026-09-20T10:16:00.000Z
---

<figure><img src="/writing/goodbye-substack/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

I'm leaving Substack.

This will be the last issue of my newsletter published via Substack.

Here's what you need to do if you want to stay subscribed to my writing:

- If you're subscribed by email, you're good. You'll still receive my posts
- If you're subscribed via rss (cool!), you'll need to subscribe to [the new feed](https://nathanarthur.com/rss.xml)
- If you're not subscribed either way, subscribe at <https://nathanarthur.com/writing>

Reasons I'm leaving:

- I want to own my writing, in markdown, have it be a part of my own website and not hosted on a third-party platform. Data ownership is important to me.
- Substack puts a full-page subscribe modal in front of new visitors to narthur.substack.com and doesn't let me disable it.
- I'd like to have more control around things like how code blocks are rendered.

What I'm losing:

- A built-in way to easily promote the newsletter. I can manually share my writing on Substack if I wish.
- Paid subscriptions, though I wasn't using that anyway.
- Built-in ability for readers to check for AI text using Pangram.

I'm replacing Substack with my existing website, nathanarthur.com. I've converted it from SvelteKit to Astro, imported all my posts, and added [an RSS feed](https://nathanarthur.com/rss.xml).

I'm building [rss-to-email-worker](https://github.com/PinePeakDigital/rss-to-email-worker) to use Cloudflare to automatically send my posts to my subscribers. I considered using [Buttondown](https://docs.buttondown.com/rss-to-email) for this. I decided against it for two reasons:

1. Buttondown gets expensive once you start getting more subscribers. Currently the number of subscribers I have fits in their free plan. But I'd rather not set myself up for that problem in the future.
2. I'm currently searching for a job. So when I see an opportunity to build something that would go good in my portfolio, I take it.

Thanks for being along for the ride!
