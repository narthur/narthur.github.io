---
title: 'Is Test-Driven Development Dead?'
date: 2025-05-30T16:14:37.194Z
substack: https://narthur.substack.com/p/is-test-driven-development-dead
---

<figure><img src="/writing/is-test-driven-development-dead/1.webp" alt="" width="1024" height="608" loading="eager"><figcaption>“A series of red and green circles inspired by automated software testing tools, slowly degrading from left to right.” Also notice the AI out-right forged a signature.</figcaption></figure>

Or, more precisely, are its days numbered?

Here I’m defining TDD (test-driven development) as a process by which code is written using the following steps:

1. Write a failing test
2. Write just enough code to make the test pass
3. Refactor
4. GOTO 1

(And by defining I mean stealing an existing definition.)

Done well, this process can provide some major advantages:

- Your test coverage naturally remains very high.
- This high test coverage makes changing existing code less risky.
- You’re forced to think through and demonstrate the change in behavior of the code you’re writing before you jump to implementation.
- You’re less likely to get lost in the weeds when solving a complex problem, since TDD allows you to focus on a single, tiny behavior change at a time, and ensures if a previously-implemented behavior breaks, you know immediately.
- Your code is naturally testable, since you’ve been testing everything from the beginning. And, arguably, testable code tends to be well-architected code.

I’ve been using test-driven development since I first learned programming during a pre-college internship. My manager was an Uncle Bob devotee, and had me go through Uncle Bob’s clean code video course as a part of my training. Later I purchased and read Uncle Bob’s book titled Clean Code.

I’m no longer a strict adherent to Uncle Bob’s programming philosophy. But I did stick with TDD, and have continued to use it consistently to this day.

AI coding tools are the first thing that’s caused me to question the future of TDD.

By our definition, TDD is inherently a human-in-the-loop process. It’s goal is to create the tightest feedback loop possible in coding. Define the smallest possible change in behavior, make the smallest code change possible to verify that change in behavior, and then receive the fastest feedback possible to verify the code change was successful.

As AI coding tools become more competent, agentic, and aggressive, it increasingly calls into question this strategy.

If I can ask a robot to fix a bug, add a feature, or build a whole app, why would I instead opt to write a long series of tiny tests and ask the robot to pass each test in turn? That’s a huge sacrifice in potential velocity.

I don’t yet think that AI will be the end of unit testing—that is, automated software testing, apart from the human-in-the-loop process described above.

- I’ve had mixed success asking AI coding tools to write tests for me, but it’s plausible they will continue to improve at it.
- Automated test feedback may already be a valuable source of context for AI coding tools.
- There’s been [at least one attempt](https://arxiv.org/html/2405.10849v1) to adapt TDD to be used more explicitly by an AI coding system itself. So instead of a human developer following the process, the AI coding tool would follow the process.
- At least at the moment, where AI coding tools are more efficient as collaborators with developers rather than replacements of them, there’s still plenty of value to a developer switching in and out of TDD based on whether the AI coding tool or the developer is currently driving.
- Any given project’s risk profile will have a significant impact on how quickly, if ever, rigorous testing processes can be abandoned.

All that said, it currently seems inevitable to me that test-driven development as we’ve practiced it is on the way out.

---

#### Featured Project: [Beeminder Autodialer](https://autodial.taskratchet.com/)

Maybe a stretch, but you could call [Beeminder](https://beeminder.com/) test-driven behavior change. I built the [Beeminder Autodialer](https://autodial.taskratchet.com/) (with kind help from the Beeminder folks) to let you automatically dial your goal rates up and down based on your historical data.
