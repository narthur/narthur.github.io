---
title: 'Labor Day Update + Link Roundup'
date: 2025-09-02T15:54:42.024Z
substack: https://narthur.substack.com/p/labor-day-update-link-roundup
---

<figure><img src="/writing/labor-day-update-link-roundup/1.webp" alt="A calm, atmospheric expressionist oil painting featuring a focused mechanic immersed in repairing a colossal, mysterious machine. The composition centers on the machine's intricate system of interlocking, oversized gears—painted with dynamic, swirling brushstrokes and exaggerated proportions to highlight texture and movement. Dozens of gears, cogs, and wheels dominate the foreground and background, overlapping and layered to create visual complexity. Muted, moody colors and soft, diffused lighting add tranquility, while the mechanic’s figure is partially obscured by the profusion of gears. Style reminiscent of Edvard Munch, wide-shot in an ambiguous workshop setting." width="1024" height="608" loading="eager"></figure>

My brother is back to working with me now. At this point there are three of us working together on a regular basis.

Currently most of our time is spent in Ruby on Rails and various TypeScript projects. I’m relatively new to Ruby on Rails, but feeling much more comfortable than I was just a few months ago.

I’ve been able to start spending more time working on TaskRatchet again, which is feeling great. I deployed a switch to Clerk for TaskRatchet authentication. It allowed me to simplify things a lot behind the scenes, and should also improve user experience quite a bit.

I was quite nervous around the launch that I would have introduced a bunch of bugs that I missed and we’d only find out about when users ran into them. So far, though, this seems not to be the case. Nicky told me that they haven’t gotten any complaints yet, which I’m thankful for!

I’m currently focused on getting to the place where we can sunset API v1. Currently that means migrating the cron jobs that are still running on the old API to our new API v2 codebase. I’ve completed the development work to make the switch, though I still would like to think things through a bit more before I pull the trigger.

I’m currently in-between IDEs, using both Zed and VS Code. Zed for its collaboration capabilities, VS Code for its AI features. The state-of-the-art is changing so fast right now that I don’t feel like I can commit myself fully to any one tool, so I just end up having a lot of different ones installed so I can learn and experiment with them all.

Yesterday my brother and I went and spent time with some friends for a Labor Day bonfire and horseshoes. It was very relaxing.

One of the other people that were there is a biology professor at at the local university. Mostly unprompted he and his wife started asking me about AI and how it impacts my job. He told me that he’s been feeding his take-home assignment questions to AI, and its responses have been getting worryingly good. You know things are changing when biology professors start asking you about your development tooling.

#### Link Roundup

- Danny published [a post about using LEGOs](https://blog.beeminder.com/legolaps) to get a workout on a home staircase. Makes me wish my apartment had two stories!
- [ReactOS](https://reactos.org/) is a Linux distribution under development that is prioritizing native compatibility with Windows applications and drivers.
- [NVIDIA Jetson Thor](https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai/) is a mini PC focused on physical AI tasks.
- [Oxc](https://oxc.rs/) is an ecosystem of JavaScript tools written in Rust to replace things like ESLint and Prettier.
- Google is making waves with its new [Nano Banana](https://blog.google/intl/en-mena/product-updates/explore-get-answers/nano-banana-image-editing-in-gemini-just-got-a-major-upgrade/) image editing model.
- MacroFactor’s app has [AI-powered food logging](https://macrofactorapp.com/ai-food-logging/), and [according to the Beeminder community](https://forum.beeminder.com/t/how-are-we-not-talking-about-macrofactor-more-often/12228) it’s worth a look.
- GitHub Actions [supports reusable workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows), which again came in handy recently when I was refactoring a CI setup in a client repository.
- I’ve been tentatively learning Godot, and [they have a design philosophy document](https://docs.godotengine.org/en/stable/getting_started/introduction/godot_design_philosophy.html). Neat.
