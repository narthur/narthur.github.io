---
title: 'Adding Sentry & Neon to TaskRatchet'
date: 2025-11-21T17:08:34.667Z
substack: https://narthur.substack.com/p/adding-sentry-and-neon-to-taskratchet
---

<figure><img src="/writing/adding-sentry-and-neon-to-taskratchet/1.webp" alt="Semi-abstract oil painting of organic flowing forms on one side gradually crystallizing into geometric interconnected structures on the other, muted greens and browns giving way to clean slate grays with touches of optimistic teal, thick impasto application with palette knife ridges, texture emphasizing the transformation from fluid to stable" width="1024" height="608" loading="eager"></figure>

I’ve added [Sentry](https://sentry.io/welcome/) to TaskRatchet’s front-end, API, and email worker. It’s already been quite helpful in surfacing errors and reducing the effort needed to fix them.

I had been thinking that having [Honeycomb](https://www.honeycomb.io/) meant I didn’t need something like Sentry. But I now thing that was a mistake. Honeycomb and Sentry serve different purposes. Honeycomb collects a ton of detailed telemetry, making it ideal for debugging complex issues and surfacing trends and correlations over time. Whereas Sentry is great for immediately alerting me when an error occurs, and surfacing all the context around that specific error.

I’ve just about decided to use [Neon](https://neon.com/) for TaskRatchet’s database instead of [Cloudflare D1](https://developers.cloudflare.com/d1/). This has a few advantages:

1.  Since it doesn’t require a worker to connect to it, I can switch databases before moving the API to Cloudflare.
2.  It should make it quite easy to set up [feature branch database forks](https://neon.com/docs/introduction/branching).
3.  [It’s just postgres](https://neon.com/docs/get-started/why-neon#neon-is-postgres), which should make it easier to migrate to something else in the future if needed.

Making the switch means modeling TaskRatchet’s data relationally and creating a corresponding schema. This is something I didn’t have to do with [Firestore](https://firebase.google.com/docs/firestore/), since Firestore is a no-SQL document store.

I never had too much trouble with Firestore when it comes to data integrity. I’ve used a thin service wrapper so only my Firestore service and my migrations interact with it directly. And my service layer has evolved to be coded fairly defensively to compensate for the lack of an explicit schema. In practice that means my service functions use [Zod](https://zod.dev/) to validate the data coming out of Firestore before returning it to the rest of the application. When something breaks for a user due to corrupt data, I find out based on the errors that Zod throws, and then go into Firestore and manually fix whatever is incorrect or missing.

I have definitely had issues with Firestore, though. Examples:

Since it’s a document store, sometimes I have to duplicate data across documents to reduce the number of queries I have to make, like syncing the user’s timezone across every task document for that user. This reduces the number of queries I need to make, but feels really yucky coming from a relational mindset.

The kinds of queries you can do are sometimes quite limited compared to a traditional database. Google says this is to prevent you from being able to create slow queries. But I’ve found on more than one occasion that what it means in practice is I’m forced to query much more data than I wanted and then filter it application-side, resulting in being charged for potentially hundreds of reads when I only wanted to read a single document.

Getting the kinds of database backups that are automatic with most database services is not obvious with Firestore. I had to set up my own job to do it. It makes me nervous knowing I rolled my own backup system for the database.

It’s also bothered me that Firestore is a proprietary system, meaning a fair amount of lock-in. There’s no simple way that I’m aware of to get a dump of a Firestore database that can be easily imported into another database system. Though this may be partly due to my desire to move from Firestore to a relational database, which wouldn’t map cleanly regardless of what no-SQL database I was coming from.

I think the biggest advantage of document stores comes at the prototyping phase of a product. You don’t have to plan out your schema ahead of time. You can just create some collections of documents and throw data at it. Quick, easy, maybe a bit dirty.

I feel like this advantage becomes less of a value add once the product is more mature. You already have a good idea of your data structure, so there isn’t so much of a need to have a super flexible “schema.” And you end up having to add layers on top of the document store to give you more of the assurances you’d have gotten out-of-the-box with a relational database—e.g. my usage of Zod to validate data queried from Firestore.

Additionally, if you want something more like a document store, you can do that with postgres using json fields. In TaskRatchet’s database I intend to do that with an integrations table, which will have a json-type config column. This will give me the benefit of a document store’s flexibility only where I need it—in this case, for integrations so I don’t need to keep expanding and modifying the database’s structure every time I want to add a new integration with a third-party service.

Anyway, I’m feeling optimistic about the move to Neon. We’ll see how it goes in practice.
