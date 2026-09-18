---
title: "The Tools I'm Using"
date: 2025-07-07T15:43:43.143Z
substack: https://narthur.substack.com/p/the-tools-im-using
---

<figure><img src="/writing/the-tools-im-using/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>“Abstract, modernist, minimalist representation of the concept of digital development work.” Also, a forged signature.</figcaption></figure>

I thought I’d detail [my current programming setup](https://nathanarthur.com/uses). It’s continuously changing, quite fast, lately. But I think a snapshot is useful.

Are there areas of my tooling or processes that you’d like more detail on? Let me know, and I may say more in a future post.

_Fair warning: This post contains affiliate links._

My work machine is currently an [HP Z2 Mini G4 Workstation](https://amzn.to/4jOvjuv), with 32 GB of ram. I run [Debian](https://www.debian.org/) Linux with [i3](https://i3wm.org/) as my window manager. I have two monitors ([one](https://amzn.to/44sVouj), [two](https://amzn.to/3F7F8o1)), an external webcam and mic for meetings, and an [external hard drive](https://amzn.to/3TYFaCw) for extra storage.

I have a manual [standing desk converter](https://amzn.to/4jVgGFF) that sits on top of my desk to allow me to work standing or sitting as desired. I have a small dry-erase whiteboard organizer on the desk, too, that I can use to jot down notes as I work.

<figure><img src="/writing/the-tools-im-using/2.webp" alt="" width="450" height="450" loading="lazy"><figcaption>Not exactly this, but similar.</figcaption></figure>

My primary IDE is [Zed](https://zed.dev/). I use it specifically because its collaboration features work well on Linux, where I’ve had mixed results using [VS Code](https://code.visualstudio.com/) for collaboration on Linux. I pay for [GitHub Copilot](https://github.com/features/copilot) and use my Copilot AI for chat and completions in Zed instead of Zed’s own AI offering.

I also still have VS Code installed, though. Currently I mainly use it when I want to get a [CodeRabbit](https://www.coderabbit.ai/) code review on a repository that I don’t own, and so can’t authorize CodeRabbit to review directly.

I’m a bit bummed that I can’t make the VS Code-based [Cursor](https://cursor.com/en) my daily driver since when I last used it I was so impressed with its AI features.

Speaking of code review, I use [GitHub Actions](https://github.com/features/actions) on basically all my projects to automate running code quality checks. On most projects this includes [Vitest](https://vitest.dev/), [ESLint](https://eslint.org/), [Knip](https://knip.dev/), and [Prettier](https://prettier.io/). I also have Copilot and CodeRabbit configured to automatically add review feedback on any PRs where I have enough permissions to do so.

I use [Warp](https://app.warp.dev/referral/ME5ELJ) for my terminal. It has built-in AI that I use to help me make Linux configuration changes. Recently it’s also added more-robust agentic coding abilities that I’ve been experimenting with recently. Impressed so far. It also lets me store custom rules and prompts I can use with the AI features, and it allows me to share a terminal window when I’m collaborating with someone else on a task.

The other two terminal-based coding tools I’ve been using recently are [CodeBuff](https://codebuff.com/referrals/ref-6d348d54-80f1-4155-903b-2cc6c57dd12f) and [Claude Code](https://www.anthropic.com/claude-code).

Unfortunately I’m still limited by costs and/or tool limits on all these tools—Warp, CodeBuff, and Claude Code. These tools are getting better and better, but they aren’t yet to the point where I can let them run wild on client work, which means I’m mostly using them on side projects. And it’s harder to justify blowing $300 in a month on coding tools when the work I’m using them for isn’t directly bring in money.

I use [Obsidian](https://obsidian.md/) to capture information related to my work and projects. I use the [Obsidian web clipper](https://obsidian.md/clipper) extension in my browser to clip web pages. I use Obsidian plugins to sync my notes to S3-like cloud storage ([remotely-save](https://github.com/remotely-save/remotely-save)), and to let me use AI to chat with an individual note ([obsidian-copilot](https://github.com/logancyang/obsidian-copilot)). I use daily notes for miscellaneous scratch pads.

I have one-note-per-task journals I use for tracking my work on tasks. So when I have a new task, I add a new note with the name of the task as the title to an appropriate Tasks folder. Then, inside this note, whenever I work on the task, I add a subheading with the current date, and document what I’m doing within that date’s section. I always add the new section to the top of the note, so the most recent work I’ve done on the task is at the top. This approach helps me get into a task quickly by reminding me of where I was at when I last worked on it, and reduces the burden on my working memory.

I track my activity in two ways. I have [ActivityWatch](https://activitywatch.net/) which automatically collects detailed information about how I’m spending my time. And I have a custom script that keeps track of how much time I’m spending using my work computer, and posts that to a [Beeminder](https://www.beeminder.com/home) goal.

I use [Beeminder](https://www.beeminder.com/home) extensively to track and enforce my work goals. I have goals for time spent using my work computer, time spent on specific clients and projects, handling work email, shipping UVIs for [TaskRatchet](https://taskratchet.com/), handling finance tasks, and sending invoices and reports to clients. I try to keep all my Beeminder commitments manageable, and keep most of my work-related deadlines in the late morning or very early afternoon to avoid burnout given my ability to work in the afternoon isn’t consistent.

I use [Slack](https://slack.com/), [Discord](https://discord.com/), [Telegram](https://telegram.org/), and [Thunderbird](https://www.thunderbird.net/en-US/), all to varying degrees, for work communication. For [TaskRatchet](https://taskratchet.com/) we recently switched from [FreshDesk](https://www.freshworks.com/freshdesk/) to [Zoho Desk](https://www.zoho.com/desk) for handling support emails. I have a custom Slack support bot that we use to ease [TaskRatchet](https://taskratchet.com/) support tasks.

When researching I use [Perplexity](https://www.perplexity.ai/) and [DuckDuckGo](https://duckduckgo.com/) mainly, resorting to Google only when the other tools fail to find what I need. Though, with [Warp](https://app.warp.dev/referral/ME5ELJ) as my terminal and [Copilot](https://github.com/features/copilot) in my IDE, many times my questions can be answered without using a browser ([Chromium](https://www.chromium.org/chromium-projects/) in my case) at all.

I’ve found myself using [Claude](https://claude.ai/) recently when I need to draft an extensive prompt, e.g. to store as a saved prompt in [Warp](https://app.warp.dev/referral/ME5ELJ). Claude’s side-by-side artifact view for drafting documents is super useful for that.

I haven’t found AI to be that useful in writing yet. I’ve experimented with different times at using AI to write, but it always feels like it’s breaking the connection between speaker and writer, and personally I don’t like that. For now, I prefer authenticity over polish.

I have used AI a couple of times to write reports for clients, where it would be reasonable to say a trade-off between authenticity and functionality is perfectly fine. However I didn’t actually find that it saved me any time, since it results in a much longer report that I then have to carefully fact-check and revise. And the improved quality of the final product is arguable.

I use PayPal for invoicing clients. I use [PayPal](https://paypal.com/) and [Wise](https://wise.com/invite/dic/nathanielroberta) to pay subcontractors, depending on their preference. I use [YNAB](https://ynab.com/referral/?ref=shzpfXLkdN0y4JUk&sponsor_name=Nathan&utm_source=customer_referral) for tracking my business expenses on a day-to-day basis. I use [Keeper Tax](https://www.keepertax.com/invite?referrer=Nathan626989) when I’m ready to file my taxes. I use [Stripe](https://stripe.com/) as my payment provider for [TaskRatchet](https://taskratchet.com/). I also have a custom dashboard that I use to partially-automate various invoicing and reporting tasks.

For web hosting, I currently use a mix of [Render.com](https://render.com/) and [Cloudflare](https://www.cloudflare.com/), and I’m moving more and more toward Cloudflare. This is mainly because deploying many small projects is expensive with Render.com. Setting aside pricing, Render.com is a magnificent developer experience.

For time tracking I use a combination of [Beeminder](https://beeminder.com/) and a custom in-house time tracker (“Narthbugz”) which runs on top of a self-hosted [Baserow](https://baserow.io/) instance.
