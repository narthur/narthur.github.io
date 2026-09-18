---
title: 'TaskRatchet on Cloudflare, Cursor 2, Etc'
date: 2025-10-31T16:49:31.557Z
substack: https://narthur.substack.com/p/taskratchet-on-cloudflare-cursor
---

<figure><img src="/writing/taskratchet-on-cloudflare-cursor/1.webp" alt="&quot;Impressionist gouache painting of ascending steps made of fragmented code snippets and geometric shapes dissolving into mist, thick gestural brushstrokes, cool grays transitioning to warm yellows, visible canvas texture, energetic mark-making suggesting upward progress and transformation.&quot; And a forged signature." width="1024" height="608" loading="eager"></figure>

I’m still working toward having TaskRatchet fully deployed to Cloudflare. The front-end is currently deployed to Cloudflare, but the API is still deployed to Render.com. My goal is to have fully-automated dev previews so I can easily manually test my changes. Getting closer, but not there yet.

The difficult part about where I’m at now is it’s a bit of a chicken-and-egg problem to get the API deployed to Cloudflare. The API uses Firestore, which isn’t immediately compatible with Cloudflare Workers. I plan to switch from Firestore to Cloudflare D1 for the database, but D1 is only accessible via a worker. Which basically means I have to switch deployment target and database at the same time. Which is scary. I’d rather break them into two separate tasks.

---

[Cursor 2](https://cursor.com/blog/2-0) has some super interesting new features, including an interface for using agents in parallel and an in-IDE browser. Unfortunately it seems like actually using agents in parallel may require you be on [their $200 / month plan](https://cursor.com/pricing), which seems like a pretty hard sell.

---

I’ve been having an issue where my USB controller crashes on my Debian machine when I try to run a dev container in vs code. I’m currently working on getting a watchdog service set up to auto-restart the controller when it crashes so I don’t have to hard restart my machine every time.

---

You can use Homebrew on Linux. It’s pretty great. I’m currently trying to use it to install Watchman in my dev container, since it seems Facebook no longer provides prebuilt binaries in their GitHub releases. (You could also use it to install [buzz](https://github.com/PinePeakDigital/buzz). 😉)
