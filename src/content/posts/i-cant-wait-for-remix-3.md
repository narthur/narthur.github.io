---
title: "I Can't Wait for Remix 3"
date: 2025-12-23T17:13:44.482Z
substack: https://narthur.substack.com/p/i-cant-wait-for-remix-3
---

<figure><img src="/writing/i-cant-wait-for-remix-3/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

Lately I’m super intrigued by the approach the Remix team is taking with [Remix 3](https://remix.run/blog/wake-up-remix). I watched both [part one](https://www.youtube.com/watch?v=iZl0IKj0HHc) and [part two](https://www.youtube.com/watch?v=dZbZgxWlzr8) of the “Introducing Remix 3” talk they gave a couple of months ago. It looks very promising.

All the modern front-end frameworks I’ve used take a reactive approach to rendering. When something changes (a component prop, a reactive piece of state, etc), the framework automatically renders the portion of the component tree that could be impacted by that change.

The obvious advantage of this approach is that you as the developer don’t have to worry about managing this yourself. You just change the state, and your app automatically updates to reflect the new state.

In practice, however, this can cause some pretty irritating issues.

- Render loops. Component A triggers a re-render of component B which does something in its render logic that triggers a re-render of component A, causing potentially a large chunk of your UI to re-render on every tick.
- Unnecessary re-renders. Since in React, for example, state is compared by reference, two things that are the same by value (such as two different objects with the same contents) can cause React to think something has changed when there actually wasn’t a meaningful change.
- Large re-renders. Say you add a React context provider at the top-level of your app to share state across your application to avoid needing to do elaborate prop drilling for state that is used throughout the application. Every time that context changes, everything within that provider re-renders, meaning your entire application for a top-level provider.

For a lot of applications, these issues aren’t that bad. But when I have run into them, I’ve found them to be extremely painful to deal with.

One such application had a site-wide media player, meaning there was state that needed to be accessible throughout the application (global context provider), had many events occurring (playback ticks), and needed to allow components throughout the tree to trigger changes back to the playback context (seeking, play/pause, auto play, etc). I repeatedly found myself dealing with the issues I listed above, and never found a good way to handle this state in React.

Remix 3 is taking the opposite approach by throwing out automatic re-renders. Instead of the framework automatically re-rendering the application when state changes, a component only re-renders when its `this.update()` method is explicitly called.

This really appeals to me. It means that it’s entirely in my control when my components re-render, and components can remain entirely static by default. And if I decide I actually do want reactivity in part of the application, I can add it in myself only where it makes sense using third-party libraries such as Redux or Zustand.

There are quite a few other things I’m excited about from watching the Remix 3 talks (focus on leveraging platform-level primitives, composable event handlers, back-end API type safety that looks better than Hono’s). Definitely watch the talks if any of that sounds interesting to you.
