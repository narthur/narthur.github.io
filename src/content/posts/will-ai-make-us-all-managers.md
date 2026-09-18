---
title: 'Will AI Make Us All Managers?'
date: 2025-05-16T17:19:23.433Z
substack: https://narthur.substack.com/p/will-ai-make-us-all-managers
---

<figure><img src="/writing/will-ai-make-us-all-managers/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>“Hierarchy of control. Minimalist, abstract.” Also a forged signature.</figcaption></figure>

Today I watched another video by Theo about how AI has rewired his brain as a developer. A lot of his thoughts resonated with me.

So it has me thinking: What will it mean to be a developer after the dust has settled and AI has realized its full potential in software development? (Setting aside whether or not it’s reasonable to expect the current upheaval to have an end.)

One idea I’ve heard a few times now (confusingly, not in the above-linked video; sorry) is that AI in the workplace will in effect force us out of being individual contributors and into something closer to a managerial role, except instead of managing people we’ll be managing AI agents. And so, perhaps counter-intuitively, even as AI might reduce the number of humans required to to accomplish any given business outcome, the classic skills associated with being a manager may become more valuable.

Examples of skills that might apply just as well to managing a fleet of AI agents as a team of old-fashioned humans:

- Delegation
- Project & task specification
- Performance feedback
- Translation of business objectives to actionable tasks
- Project management

I’m still somewhat skeptical of this prediction. It strikes me as a trend that could just as easily be obsoleted by future AI advancements or changes in how businesses operate to better accommodate AI tools.

It rhymes with the idea that companies will continue hiring people to specialize in prompt engineering, when it seems more likely to me that this skill will eventually become less valuable over time as AI companies improve their products’ ability to get the user to their desired outcome without needing specialized skill in manipulating a model’s psychology.

Ways AI tools and products could improve to require less managerial prowess:

- Rely less on free-form chat inputs and more on structured processes and user interfaces.
- Estimate risk and ambiguity around a given task, and then proactively request clarification before executing.
- Spawn subordinate agents to execute sub-tasks (agentic systems—they already exist).
- Manage and update over time an internal model of business objectives and preferred tasks and processes to achieve them.
- Rely more on fully-specified, automated feedback mechanisms (think: continuous integration practices already ubiquitous in software development).

In short, my current feeling is that AI tools and systems will increasingly manage themselves rather than needing something akin to traditional team management.

#### Featured Project: _[Pa11y Ratchet](https://github.com/marketplace/actions/pa11y-ratchet)_

Speaking of CI, _[a couple of collaborators and I](https://github.com/narthur/pa11y-ratchet/graphs/contributors)_ have built _[a GitHub action](https://github.com/marketplace/actions/pa11y-ratchet)_ that allows you to ensure a team makes progress on fixing accessibility issues, even if you have a huge existing backlog of problems.

It does so by comparing the total count of issues between a PR and the branch it’s merging into, and only failing if the number of issues go up.

I’ve been using it for basically a year at this point, including on client projects, and it’s been working great. _[Give it a look!](https://github.com/marketplace/actions/pa11y-ratchet)_
