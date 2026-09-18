---
title: 'Future Changes to TaskRatchet'
date: 2025-07-21T17:25:07.513Z
substack: https://narthur.substack.com/p/future-changes-to-taskratchet
---

<figure><img src="/writing/future-changes-to-taskratchet/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>abstract todo lists</figcaption></figure>

[TaskRatchet](https://taskratchet.com/) is a project I built [back in 2020](https://blog.beeminder.com/taskratchet/) and have continued to maintain and develop since, as time allowed. It’s a task management app that allows you to stake real money on completing each task by its associated deadline.

Recently I drafted this list of technical changes I plan to make to TaskRatchet:

- Remove Astro, switch back to just React
- Use Clerk for auth instead of db auth and firebase auth
- Deploy to Cloudflare instead of Render.com
- Spin down API v1
- Set up API v2 to publish an OpenAPI spec
- Switch from one list of tasks to two or three (e.g. Next and Archive)
- Set up Honeycomb on the front-end

I thought I’d give a bit more context for each here.

## React Over Astro

A while back I added [Astro](https://astro.build/) to the web app as a way to slowly transition away from [React](https://react.dev/). My reasoning was that React introduced some unfortunate performance issues, and there were other front-end libraries I now prefer over React, such as [Vue](https://vuejs.org/) or [Svelte](https://svelte.dev/). Astro would allow [multiple front-end libraries](https://docs.astro.build/en/guides/integrations-guide/#official-integrations) to co-exist during a transition.

I now think this was a mistake.

- The main performance issues were due to having two-way infinite scroll in the main tasks list, and I separately want to get rid of that. (Already have partially.) So I think all the performance improvements I need can be made without leaving React.
- Even though I might like other view libraries better, I have the most experience in React.
- AI coding tools are really good at working in React.
- React is better supported by other things I may want to use than are Vue or Svelte.

None of this is to say anything negative about Astro. [I love Astro](https://blog.beeminder.com/astroblog). But it wasn’t a good direction to take in this case.

## Use Clerk for Auth

This one’s a bit painful. Currently under the hood I have two authentication strategies which are operating in parallel: our own home-spun database-powered auth, and [Firebase Auth](https://firebase.google.com/docs/auth/). My tentative existing plan was to move everything to Firebase Auth.

However now I’ve used [Clerk](https://clerk.com/) auth on several other side projects and it seems really great. It has React components for login, registration, forgot password flows, etc, so it will allow me to simplify the codebase while improving the user experience around authentication.

Of course, that means transitioning two systems to a third new system, which is the painful part.

## Switch from Render.com to Cloudflare

Currently TaskRatchet is deployed to [Render.com](https://render.com/). Render.com has a fantastic developer experience, but it isn’t cheap for someone like me who creates a lot of little projects. So I’m working on learning [Cloudflare](https://www.cloudflare.com/) and moving all my projects to it for hosting and compute. It makes sense for TaskRatchet to be a part of that.

## Spin down API v1

Currently there are two versions of [TaskRatchet’s API](https://docs.taskratchet.com/api-v2.html), and the web app uses both. I’ve been working intermittently on getting to the place where TaskRatchet only uses v2. Once that happens, I can spin down v1 and simplify our backend.

## Publish an OpenAPI spec

That’s [OpenAPI](https://www.openapis.org/what-is-openapi), not OpenAI. Having an OpenAPI spec will allow for us to generate public API documentation from our code rather than having keeping the API documented be a separate task from building the API. Also it will allow us and users (if they wish) to use the spec to [generate clients](https://heyapi.dev/openapi-ts/get-started) to ease use of the API.

## Split the Main Task List

Currently all of a user’s tasks are shown in a single task, including completed and past-due tasks. In the future I hope to split this into multiple lists, both to make the user experience more focused on a user’s relevant tasks and to improve the performance of the web app. Tentatively this means one list for tasks that are due within the last 24 hours and into the future, and a second list for everything else.

## Add Honeycomb on the Front End

I already use [Honeycomb](https://www.honeycomb.io/) for back-end instrumentation to allow me to see errors and try to track down the causes of problems. I’d like to add Honeycomb to the front-end, too, to increase my visibility into issues which may span the whole stack.
