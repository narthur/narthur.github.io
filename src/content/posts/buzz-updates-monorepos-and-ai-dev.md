---
title: 'Buzz Updates, Monorepos, & AI Dev Workflows'
subtitle: 'More commands added to Buzz, using monorepos--correctly this time, and improving how I use Copilot and CodeRabbit together'
date: 2025-10-24T17:33:09.034Z
substack: https://narthur.substack.com/p/buzz-updates-monorepos-and-ai-dev
---

<figure><img src="/writing/buzz-updates-monorepos-and-ai-dev/1.webp" alt="Abstract expressionist painting split into two distinct color zones - left half in cool cyan and silver tones, right half in warm coral and bronze tones, circular movements from each side reaching across the boundary and interlocking like gears, layers building where they meet, heavy impasto technique with visible palette knife marks, conveying two systems in constant dialogue and mutual refinement" width="1024" height="608" loading="eager"></figure>

## Buzz Updates

I’ve been continuing to improve [buzz](/writing/buzz-a-terminal-interface-for-beeminder). You can see the release notes [here](https://github.com/PinePeakDigital/buzz/releases). Highlights:

- \`buzz view\` lets you view some details about any specific goal.
- \`buzz review\` lets you step through all your goals alphabetically, meant for use when [calendialing](https://blog.beeminder.com/calendial/).
- \`buzz —version\` now shows you what version of buzz you have installed.
- \`buzz refresh\` now lets you trigger an autodata refresh for a specific goal (requested by [Philip Hellyer](https://forum.beeminder.com/t/buzz-another-terminal-interface-for-beeminder/12557/3?u=narthur)).

## Back to Monorepos

I’ve moved back to using a monorepo for TaskRatchet. [As mentioned previously](/writing/toward-ai-friendly-software-architecture#monorepos), I had tried using monorepos with TaskRatchet in the past, but had a poor experience. This time around I took a different approach, creating only a single monorepo for TaskRatchet, and only moving things to it that are directly related to TaskRatchet and are likely to change together or be referenced together while doing development. It’s already feeling much better than last time.

## Copilot + CodeRabbit Optimizations

I’m continuing to use GitHub Copilot coding agents alongside CodeRabbit, and the combination continues to be surprisingly effective. A few notes on how I’m using these tools together:

---

I have the GitHub CLI installed locally. I’ve added an alias to it that runs a script to create new issues and immediately comment on them requesting CodeRabbit’s input.

The alias: `'!gh-ic "$@"'`

The script, stored as \`gh-ic\` in my bin:

```bash
#!/bin/bash

# GitHub CLI issue create script
# Usage: gh-ic Issue title without quotes

# Check if title argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: gh-ic Issue title without quotes"
    exit 1
fi

# Get the issue title from all arguments
title="$*"

# Create the issue with empty body and capture the URL
issue_url=$(gh issue create -b "" -t "$title")

# Extract issue number from URL (format: https://github.com/owner/repo/issues/123)
issue_number=$(echo "$issue_url" | grep -o '[0-9]*$')

# Add a comment asking CodeRabbit AI to analyze and enhance the issue
gh issue comment "$issue_number" --body "@coderabbitai Please analyze this issue and update the description with implementation details, suggested approach, and any relevant technical considerations."
```

This setup allows me to quickly create new issues like this:

```bash
gh ic The title of the new issue
```

Which are immediately added to the repo I’m viewing in terminal, and shortly after populated with details by CodeRabbit. I can then further comment on the issue as desired, asking @CodeRabbit to make any desired revisions.

---

Once I’m happy with the state of an issue, I assign it to Copilot, which will go off and create a PR and eventually request my review.

When Copilot finishes its first pass, I do the following in this specific order:

1. I manually review the code changes.
2. I mark the PR as ready for review, taking it out of draft mode.
3. I manually request CodeRabbit review the PR, since CodeRabbit won’t auto-review a PR opened by a bot.
4. I go back-and-forth with Copilot and CodeRabbit, asking Copilot to address CodeRabbit’s feedback, and CodeRabbit to make new reviews.
5. Once CodeRabbit is happy with the PR (or I’ve dismissed its feedback as out-of-scope), I approve CI jobs to run.
6. Once all CI jobs have successfully run, I merge the PR.

The main thing to notice here is that I intentionally go through the CodeRabbit review process before approving CI jobs to run. This is to reduce the cost of this workflow.

CodeRabbit doesn’t charge per review (as much as I might like them to), so requesting more reviews doesn’t increase your costs.

However, GitHub does charge per actions minute (once you’ve used the monthly free minutes that come with your plan). And you may be using all your free minutes, since Copilot coding agents run on GitHub Actions, so they use your minutes.

Because of this, I prefer to get the CodeRabbit feedback out of the way before I approve my jobs to run, since CodeRabbit may find issues that would have failed in CI, potentially saving me from using even more CI minutes by needing to run the CI jobs multiple times.

---

Copilot consistently has difficulty remembering how to access all feedback left on a PR by CodeRabbit. For this reason, I’ve been adding [this section](https://github.com/PinePeakDigital/buzz/blob/main/.github/copilot-instructions.md#accessing-coderabbit-pr-feedback) to Copilot’s instructions file in many of my repos. And then, for good measure, when I ask Copilot to address CodeRabbit’s feedback, I remind it to use these instructions:

> @copilot Please address coderabbit feedback. Your instructions file will tell you how to access coderabbit feedback.

I have this set up as a text expansion using [espanso](https://espanso.org/), though I still find myself entering it manually quite frequently since I’ll often be using devices other than my primary work machine.

---

Speaking of multiple devices, one advantage I find with this workflow is that I’m able to move things along from just about any device I’m at. My work machine is best optimized for it, since I have all my dev tools set up if I need to check out a PR for manual changes or local testing, and I have my GitHub CLI alias configured for quickly adding new issues.

But I can be nearly as productive on my laptop, tablet, and even phone. On mobile devices I use the GitHub app to create new issues, ask CodeRabbit for issue revisions, and go through the PR review process described above. And on my laptop I can do the same on github.com.
