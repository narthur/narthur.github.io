---
title: 'AI as Slot Machine Programming'
subtitle: "Your IDE isn't a good place to go gambling."
date: 2025-11-14T17:32:07.795Z
substack: https://narthur.substack.com/p/ai-as-slot-machine-programming
---

<figure><img src="/writing/ai-as-slot-machine-programming/1.webp" alt="&quot;Oil painting of a vintage slot machine with its lever pulled, mechanical reels spinning and scattering into chaotic fragments, warm casino lighting contrasting with cool blue shadows, thick impasto brushwork showing metal textures and motion blur, traditional realist style with surreal elements of dissolution.&quot; And forged signature." width="1024" height="608" loading="eager"></figure>

I found [this issue of Understanding AI](https://www.understandingai.org/p/ai-ads-are-going-mainstream) quite interesting, especially this paragraph regarding [Coca-Cola’s recent AI-generated Christmas commercial](https://www.youtube.com/watch?v=Yy6fByUmPuE):

> To combat this \[lack of consistency\], good ads can take hundreds or thousands of individual generations to produce compelling content — Accetturo called this dynamic “slot-machine pulls.” A high level of human involvement helps to deliver a more consistent vision. But even a large number of generations doesn’t ensure quality — the Coca-Cola ad apparently required more than [70,000 video clips](https://www.youtube.com/watch?v=URT_pX74_qA&t=61s).

I think pulling the lever on a slot machine is a good analogy for what using AI tools can become when it isn’t working well. And I think it’s a good indicator that you need to stop and change course.

- Prompt the AI to stop and gather context
- Switch to manually gathering context on your own (e.g. adding log statements)
- Switch to [collaboration mode](/writing/ai-for-coding-collaborate-or-delegate), asking the AI how to do the thing and then doing it yourself instead of letting the AI execute on its own
- Update instructions files to improve the AI’s baseline performance in the codebase
- Look for ways to simplify or otherwise re-architect the codebase to make it more AI-friendly

Basically, when you find yourself in a situation where you’re just asking the AI to try again and hoping it works better this time, that’s the point you need to switch strategies.

---

I fixed the TaskRatchet error that I mentioned in my last post. Of course, it would be better if I fix the issues before users complain about them.

With that in mind, I’ve been working on improving my ability to catch and fix TaskRatchet errors quickly. I already had Honeycomb set up, but my error reporting setup was spotty.

To solve this, I’ve been working to add Sentry to all parts of TaskRatchet. So far I’ve added it to the web front-end and the API. I’m currently working toward adding it to the email worker.

I’m hoping that having Sentry up will make future infrastructure changes, such as moving to Cloudflare and switching database solutions, smoother than previous ones have been at times.
