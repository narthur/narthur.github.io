---
title: 'AI After TDD: Keeping Test Coverage High'
subtitle: "If we aren't writing our own tests by hand, how do we ensure test coverage stays high?"
date: 2025-06-06T16:13:28.833Z
substack: https://narthur.substack.com/p/ai-after-tdd-keeping-test-coverage
---

<figure><img src="/writing/ai-after-tdd-keeping-test-coverage/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>“An abstract, minimalist painting representing the concept of test coverage. Incorporate a recursive grid structure.” Forged signature as usual.</figcaption></figure>

---

This issue is a follow-up to my last issue. I’d suggest reading it first:

[Is Test-Driven Development Dead?](/writing/is-test-driven-development-dead)

---

So. What comes after test-driven development?

These are the benefits to using test-driven development I listed previously:

1.  Your test coverage naturally remains very high.
2.  This high test coverage makes changing existing code less risky.
3.  You’re forced to think through and demonstrate the change in behavior of the code you’re writing before you jump to implementation.
4.  You’re less likely to get lost in the weeds when solving a complex problem, since TDD allows you to focus on a single, tiny behavior change at a time, and ensures if a previously-implemented behavior breaks, you know immediately.
5.  Your code is naturally testable, since you’ve been testing everything from the beginning. And, arguably, testable code tends to be well-architected code.

How do we ensure we keep as many of these advantages as possible without using test-driven development?

This week let’s look at the first advantage.

### 1\. “Your test coverage naturally remains very high.”

Let’s assume we don’t want to give up unit testing, but just the human-in-the-loop workflow. If we don’t have a developer writing each test before they make it pass, how do we ensure our test coverage stays high?

In my experience with AI coding tools, they are inconsistent with writing tests at best. Most of the time they never write them at all. Even when I’ve gone in and added custom rules or prompts, I still find these tools just do the thing and don’t write tests.

#### Require a Test Coverage Threshold

The simplest solution might be to rely more heavily on code coverage checks. I’m most familiar with Jest and Vitest, and these tools have built-in ways to check the test coverage of a particular project. Adding a test coverage requirement to CI would be a simple way to prevent code from being committed before sufficient unit tests have been added. And the developer is always free to go ask their AI tool of choice to write the tests for them.

This comes with some disadvantages.

- Some pieces of code will be more valuable to test than others.
- Sometimes coverage tools can have a hard time seeing actual test coverage for certain pieces of the code base depending on a project’s architecture.
- Tests written for the sole purpose of increasing test coverage are often of a lower quality than those written in a test-driven style.
- If we’ve decided that tests will always be written after the code it’s testing, we may lose the potential benefit of the tests’ ability to influence our project’s architecture.
- We also may lose the advantage of testing first forcing us to decide ahead of time what the behavior of our code should be.

#### Automate Requesting AI-Generated Tests

Perhaps we add a step to our CI workflows that calls some AI coding tool and requests that it commits new tests to the current PR, perhaps in combination with a test coverage threshold. I’m not convinced that AI coding tools are consistent enough for this to be a better developer experience than working with the tools directly and locally to add tests, but perhaps in the future they will be.

#### Use Recording & Playback

I recently ran into a very-early-stage tool called [Meticulous](https://www.meticulous.ai/) that I’m very excited to see mature.

Meticulous watches you as you interact with your application during development, and records the events that were fired during your session, the code paths that were exercised by your interactions, and the responses to any HTTP requests that were made for future playback.

When you create a PR, Meticulous attempts to identify a set of these sessions that will best exercise the code you’ve changed, and then runs these sessions on a known-good staging environment, and also on your PR preview environment.

It then compares the resulting behavior of the application between these two environments, and presents any differences to you to approve as a part of your PR review process.

I really want this to exist.

If this tool is able to do what they’re promising, it could potentially allow us to continue to have high test coverage without relying on the ability or inclination of our AI tools to write the tests for us.

Unfortunately it remains to be seen if they’ll be able to deliver. Currently to get any real use out of Meticulous you need to have an on-boarding call with them. My understanding is that this is because they haven’t yet gotten their tool to the level of reliability you’d need without doing manual setup work on their end tailored to your specific project.

Fingers crossed.
