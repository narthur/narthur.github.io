---
title: 'Write the pass line before you ship'
date: 2026-11-25
link: https://github.com/narthur/skills/tree/main/skills/review/review-loop
---

If a change is meant to move a number, write down what counts as success before it ships. A threshold picked after the data arrives gets picked to fit the data. The review-loop skill linked above checks for this on every PR, but the habit works without it.

Put three things in the PR description:

- Baseline: the current value, read now, plus the query for it. After merge there may be nothing left to compare against.
- Window and threshold: how long to wait after deploy, and what result counts as worked, inconclusive, or not worked.
- Guardrail: a metric that must not get worse.

Then check that the metric fires on the code path that the PR changes. It also needs to be splittable by who hit that path. If it can't, add the instrumentation in the same PR. A baseline can't be recorded after the fact.

A TaskRatchet PR aimed at cache misses on a stats endpoint shows the shape. Its plan recorded a baseline of 132 of 139 requests (95%) reaching D1, with a window of 7 days after deploy. Fewer than 70% reaching D1 meant it worked. Between 70 and 90% was inconclusive. At 90% or more it hadn't worked.

Last, schedule the read. A threshold nobody goes back to does nothing. Add a task due on the last day of the window, and put the literal query in it. Copy the plan into a commit message too: a clone of the repo keeps commits but not PR descriptions.

Before the next performance or conversion PR, write the baseline, the window and the three verdicts into its description.
