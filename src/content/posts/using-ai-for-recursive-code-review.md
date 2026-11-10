---
title: 'Using AI for Recursive Code Review'
date: 2026-11-10T16:00:00.000Z
band: { sketch: 'subdivide', seed: 1 }
---

Since switching to doing my development work almost exclusively via Claude Code, I've become focused on finding ways to automate quality control to ensure what I ship doesn't become worse over time.

I was already in the habit of using CI checks and automated testing suites to do this. I added CodeRabbit on top of these tools to help me catch problems that are less easily identified using traditional tools.

CodeRabbit is a [fantastic tool](/writing/ai-for-code-review-coderabbit). But it has some problems I was running into:

- It's heavily rate-limited.
- It can be expensive.
- It posts its feedback to the PR, so agents have to query there to retrieve it.

For these reasons, a while back I cancelled my CodeRabbit subscription and built [my own code review skill](https://github.com/narthur/skills/tree/main/skills/review/review-loop) that Claude uses locally, spending my Claude subscription tokens.

The skill runs before every push. I enforce this using a git pre-push hook.

When it runs, the skill fans out subagents, each looking at different parts of the application and for different types of issues. The different types of problems it looks for has expanded over time. Currently it looks for:

1. Infractions against CLAUDE.md
2. Code smells
3. Changes that contradict the intent of previous commits and commit messages
4. Changes that contradict guidance left in existing code comments
5. Security issues
6. Missing test coverage
7. Places where the code should be simplified or an abstraction should be removed
8. Observability gaps
9. Potential for spending overruns
10. Gaps between intent and implementation
11. Infractions against feedback left in prior PRs that touched the same files
12. Failures to conform to written specs such as issues, agent briefs, or spec files

The skill spins up subagents running haiku to score each finding on how confident it is that the finding is real. This way the scorers aren't biased based on having access to the agent history that made the changes or discovered the problem.

With some exceptions based on finding type, the skill then decides how to address each finding based on the following matrix, taking confidence and [risk](/writing/hills-to-die-on) into account.

| Confidence        | Risky    | Not risky |
| ----------------- | -------- | --------- |
| Low confidence    | Skip     | Skip      |
| Medium confidence | Ask      | Auto-fix  |
| High confidence   | Auto-fix | Auto-fix  |

At the end of the cycle, if any changes have been made, either automatically or based on my responses, the skill runs again on the new changes. Hence why it's called `review-loop`. It continues looping until no new findings are discovered or its budget for the run is exhausted.

Once the loop finishes, the new changes are pushed and, if a PR exists, a full report and evidence that the changes work locally are posted to the PR. (If no PR exists yet, the report is saved locally until the PR is created.)

There's quite a bit of detail and nuance that I haven't described here. If you're interested in diving deeper, [check out the skill's readme](https://github.com/narthur/skills/tree/main/skills/review/review-loop) or ask your own agent to review the skill and interview you on what parts of it might be useful additions to your own development process.
