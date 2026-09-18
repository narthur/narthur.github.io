---
title: 'Link Roundup + TaskRatchet API Update'
date: 2025-09-11T16:54:23.253Z
substack: https://narthur.substack.com/p/link-roundup-taskratchet-api-update
---

<figure><img src="/writing/link-roundup-taskratchet-api-update/1.webp" alt="Abstract painting of data streams flowing from cloudy, chaotic forms into clean, organized geometric structures, impressionist style with blues and greens" width="1024" height="608" loading="eager"></figure>

I’ve been continuing to work on sunsetting TaskRatchet’s public API v1. I’ll be going ahead and turning off v1 tomorrow, September 12.

I’ve been making sure that all our systems use API v2, and working out any bugs with that usage.

I’ve also been working on switching from Express to Hono in API v2 as the underlying API framework. This will allow me to more easily deploy to Cloudflare instead of Render.com, and it has a nice plugin for generating an OpenAPI spec file that will allow me to generate documentation from the API.

Having the API deployed to Cloudflare will allow me to set up multiple instances of the API for staging vs production, which should make things easier to manually test before shipping.

I’m thinking I also need to do better at letting users know that they can add a password back to their account after the authentication switch. New users will be prompted to set a password during sign-up, but users that already existed during the switch lost their old password and it isn’t obvious how they can re-add one so they don’t have to use email verification every time they sign in.

I’m thinking what I’ll do is listen for a Clerk webhook event indicating that a user logged in using email verification. I can then have TaskRatchet send them an email explaining how they can add a password if they wish. I can track whether I’ve already sent this email on their database user and only ever send it once so I don’t spam users who prefer using email verification.

Once I have all that done my next step will be to switch away from Firestore to Cloudflare D1 for the database. Firestore has worked well, but I think it’s time to move to a structured database, both to reduce costs and to avoid bugs related to inconsistent data in the database.

## Link Roundup

### Artificial Intelligence

- [Anthropic’s going to start training their models on chat transcripts](https://www.theverge.com/anthropic/767507/anthropic-user-data-consumers-ai-models-training-privacy), so maybe make sure to opt out if, like me, you’d rather they not do that.
- [Codebuff open sourced](https://github.com/CodebuffAI/codebuff) some or all (unclear) of Codebuff, or maybe just an agentic framework they developed while building Codebuff. Apparently people are already building new things with it, including [vly.ai](https://vly.ai/).
- [Textideo](https://textideo.com/) is another tool for generating AI videos.
- [Daytona](https://www.daytona.io/) is a cloud platform focused specifically on running AI-generated code.
- [Cartesia](https://cartesia.ai/) is another voice AI tool (“platform?”).
- [JigsawStack](https://jigsawstack.com/) lets you use small, specialized AI models tailored to your development stack.

### Programming

- [Verdent](https://www.verdent.ai/) sent me a cold email about their new agentic coding system. I don’t know if it’s any good, but maybe it is.
- Val Town [released a CLI](https://blog.val.town/vt-cli) that can be used to deploy a project from your local machine. Neat! Now I want to know if I could use it to set up GitHub Actions to automatically deploy on merge to main.
- [MonkeyUser](https://www.monkeyuser.com/) seems like a great xkcd-like comic focused on programmer humor.
- [dnd kit](https://dndkit.com/) is an npm package for adding drag-and-drop functionality to your React application.

### Assorted

- [Matt D’Avella released a new video on slow productivity](https://www.youtube.com/watch?v=GKWrSLCqgG4). It resonates.
- [This video essay](https://www.youtube.com/watch?v=Fua36HgaZj8) explains how the Sears catalog sidestepped Jim Crow-era racism.
