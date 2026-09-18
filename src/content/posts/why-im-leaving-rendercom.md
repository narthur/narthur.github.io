---
title: 'Why I’m Leaving Render.com'
date: 2026-09-03T16:59:54.899Z
substack: https://narthur.substack.com/p/why-im-leaving-rendercom
---

<figure><img src="/writing/why-im-leaving-rendercom/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

[Render.com](https://render.com/) is a fantastic service. It’s a cloud provider that makes the right stuff easy.

- The happy path is [automatic deploys](https://render.com/docs/git-provider) from your git provider.
- It has first-class infrastructure-as-code support via [its blueprint files](https://render.com/docs/infrastructure-as-code).
- It skips the complex IAM systems of AWS and GCP.
- It ships a limited (though growing) number of primitives that can be used to build the majority of things I’d want to build. Currently [around ten](https://render.com/docs), depending on how you count, compared to [more than 300 at AWS](https://docs.aws.amazon.com/).
- Its [pricing](https://render.com/pricing) is straight-forward and predictable.

I’ve been a fairly big user of render.com for a while, even hosting [TaskRatchet](https://taskratchet.com/) on it for two years.

For a while now I’ve been migrating off of Render.com, moving most of my work to Cloudflare. The only things I’m still hosting on Render.com are a few static websites.

Why the switch?

The main reason: It’s expensive.

Simple pricing doesn’t mean cheap. And my usage pattern, building many side projects which probably won’t get much usage, is just about the worst scenario. A server project typically needs at minimum a public computer service and a PostgreSQL database. To avoid cold starts and losing data, that means paying, at minimum, $7 / month for the compute service and $6 / month for the database, or $13 / month all-in. And that’s even if I’m the only one ever using the project. if I want five such projects, I’m easily paying $65 / month or more.

So at this point Cloudflare turns out to be a way better fit. It’s way cheaper, and the architectures it naturally pushes you toward mean I’m paying for what I use rather than paying for instance that are doing nothing most of the time. Plus Cloudflare-hosted projects tend to be really fast. Since I’m using Claude Code, I don’t have any issues configuring the cloud infrastructure. And it gives me more flexibility in how I can build things while still avoiding the incredible complexity of something like AWS.

I’m happy with the move.
