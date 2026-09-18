---
title: 'TaskRatchet Bugs, Cursor 2, & Rails Project Refactoring'
date: 2025-11-07T17:56:41.337Z
substack: https://narthur.substack.com/p/taskratchet-bugs-cursor-2-and-rails
---

<figure><img src="/writing/taskratchet-bugs-cursor-2-and-rails/1.webp" alt="Expressionist gouache painting of interconnected pathways and nodes with some connections broken or rerouting, bold gestural marks in slate gray and electric blue with touches of warning orange, heavy textured application showing paint layers, dynamic composition suggesting problem-solving and adaptation, visible brushwork indicating movement and iteration" width="1024" height="608" loading="eager"></figure>

I’ve been doing my best to fix an issue with TaskRatchet sign-ups where a user can register but then can’t add their payment method. I deployed what I hope will fix the issue but I haven’t gotten confirmation yet from the affected user.

I’m still kind of in an awkward place when it comes to finding and fixing issues with TaskRatchet. Switching to Clerk for auth has had the effect of basically preventing me from manually testing my code locally. Automated testing is unaffected.

I’ve been making some headway toward getting past the issue. The front-end is now deployed to Cloudflare, and I have branch previews set up in a way that I’ll be able to point the front-end preview deploys to corresponding back-end staging deploys once those are working.

The hang-up with that is that I think it’ll be tricky to switch from Render.com to Cloudflare for deploying the back-end, since it’ll also necessitate migrating the database from Firestore to Cloudflare D1 at the same time.

I think I should probably side-step this for now by getting my local dev server setup working well again.

---

[Cursor 2](https://cursor.com/blog/2-0) has me back on the Cursor bandwagon, and so far the changes seem really great. I’m mostly enjoying the agent layout so far. I haven’t tried using multiple parallel agents yet. And I haven’t made use of Cursor’s new built-in browser yet.

One thing that feels like a big improvement is Cursor’s new planning mode. So now it has Agent (just do stuff), Ask (let’s talk without doing stuff), and Plan (like Ask but it also puts together a planning document and task list). It allows for a flow more like Claude Code, and feels quite natural.

---

I’m actively experimenting with refactoring a large Ruby on Rails codebase to work better with AI tools. So far that’s meant:

- Switching to GitHub Issues + a GitHub Project for issue management and kanban
- Adding and iterating on a copilot instructions file
- Adding new CI checks
- Configuring GitHub Copilot to have access to more MCP servers (e.g. Sentry, [Context7](https://context7.com/))

So far that’s all low-hanging fruit. More changes I’m planning to make:

- Add a [copilot-setup-steps.yml](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment) file so Copilot has a better immediate setup when it starts a session
- Split the React front-end from the Rails back-end to create better separation and simplify tooling, making the repo a monorepo at the same time
- Pull the mobile app repo into the monorepo
- Add package-level [AGENTS.md files](https://github.com/openai/agents.md)
- Migrate all remaining JavaScript files to TypeScript
- Add [Sorbet](https://sorbet.org/) for Ruby type checking

And then there are changes I’d like to make but am not sure if they will be practical any time soon. The main one in that category is feature branch development previews. It seems with the project’s current architecture there just really isn’t a good way to do that which also wouldn’t cost a lot of money over time. Though once the front-end is split from the back-end I think we could at least get front-end deploy previews.
