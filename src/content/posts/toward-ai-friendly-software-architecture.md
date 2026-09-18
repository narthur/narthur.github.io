---
title: 'Toward AI-Friendly Software Architecture'
date: 2025-08-11T16:22:34.773Z
substack: https://narthur.substack.com/p/toward-ai-friendly-software-architecture
---

<figure><img src="/writing/toward-ai-friendly-software-architecture/1.webp" alt="a painting of architecture" width="1024" height="608" loading="eager"></figure>

I’m interested in thinking more about the software architecture decisions that will be influenced by our use of AI coding tools going forward.

- Monoliths
- Headless APIs
- Microservices
- Monorepos

## Monoliths

A monolith is a term used to describe a software project where everything is in a single codebase—no effort has been made to split things into multiple, separately-deployed systems. UI, business logic, and data access are all handled by this single codebase.

My experience has been that monoliths have been generally unpopular for a decade now because they make it harder to support multiple platforms cleanly. If you think you may want some combination of a web app, an iOS app, an Android app, a desktop app, and an Alexa app, you’ll likely want to avoid a monolith. And even if you don’t know you’ll want more than one of that list, why choose an architectural pattern that more-or-less commits you to a single platform?

I do feel like there’s been a shift back toward monoliths in recent years. One example is the popularity of NextJS. NextJS is a full-stack React platform that has taken over the React ecosystem. You can use it to build a client-only web application, but it’s designed to let you build your full application, back-end and front-end, within a single codebase.

Add to that React’s recent addition of server components and it starts to look like the JavaScript community has rediscovered monoliths, and they aren’t mad at them.

Monoliths make sense for use with AI coding tools. Having everything in a single repository makes it much easier for these tools to discover all the context needed to make a change, and makes it more likely that they’ll be able to complete the entire task in a single shot.

## Headless APIs

Headless APIs are the traditional solution to the issue of monoliths tending to lock you into a single platform.

Instead of putting everything in a single codebase, you break your project into two distinct pieces: a client which the user interacts with directly, and a backend service that handles everything else—the headless API. The client receives interacts from the user and then translates these interactions into commands to the API service. The API then returns a response, perhaps including new data, which the client displays to the user.

The big advantage with this architecture is that it lets you create new, entirely separate clients to your heart’s content. You don’t have to worry about needing to refactor your business logic to support your new client, because any previous clients weren’t allowed to interact directly with the business logic previously. So your new client can use the same API as your previous clients without needing much backend change.

Reality, of course, is rarely ever this clean. New clients do often end up needing changes to the headless API. And once you have multiple clients relying on the same separate API, you need to worry that a change made to the API for one client might break another client in a way that’s hard to detect. We have tools to try to mitigate these problems—OpenAPI specifications, GraphQL endpoints, etc. But they only go so far.

Headless API architectures seem to be a mixed bag when it comes to their compatibility with AI coding tools. To the extent that they result in a project becoming multiple separate git repositories, they can make it more difficult for AI coding tools to get the access they need to context, and can mean you’ll need to switch between different repos to have your AI tool execute different sub-tasks within a larger task that spans the entire project.

On the other hand, this pattern can result in having clear contracts between the backend and the client (the aforementioned OpenAPI specifications and GraphQL schemas) which can provide well-structured and extensive sources of context for AI tools to use.

## Microservices

If two deployable subsystems are better than one, then wouldn’t 100 be even better? That’s my impression of microservices.

Unfortunately I don’t have first-hand experience working within a project that uses microservices, so I can’t speak very well to their strengths and weaknesses. I know they were very popular for a period of time, that they may have advantages for systems that need to be extremely scalable and adaptive, and that they come with a potentially intense level of devops complexity. But that’s about all I know.

How well are they adapted to use with AI coding tools? No idea.

## Monorepos

A monorepo refers to taking multiple separately-deployable codebases and storing them in a single git repository.

I’ve had both good and bad experiences with monorepos.

At one point I reorganized my TaskRatchet codebases to use two monorepos: one for the frontend stuff and one for the backend stuff. Doing this turned out to be a mistake. It added a lot of complexity around managing dependencies and handling CI workflows without doing much to improve developer experience.

I now think that the way to use monorepos is to keep connected codebases together when you’ve decided not to use a monolith. For example, if you have an application that you’ve decided to split into three deployable codebases—a frontend client, a backend API, and an NPM SDK—it makes sense to keep all three within a single monorepo, since these things likely depend on one another and are likely to need to change together semi-frequently.

This also allows you to get much of the benefit a monolith has for AI coding tools without needing to use a monolith.

I’m currently continuing to move toward using monorepos, hopefully organized better than they’ve been in the past.

---

There are a few other similar decisions I’m interested in thinking through in relation to AI coding tools:

- Object-oriented vs functional programming
- Static vs dynamic typing
- Strong vs weak typing
- Compiled vs interpreted languages

Maybe I’ll do that in a future post.
