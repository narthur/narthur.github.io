---
title: 'Solution for Large Branches: GitButler'
date: 2026-01-13T15:31:53.718Z
substack: https://narthur.substack.com/p/solution-for-large-branches-gitbutler
---

<figure><img src="/writing/solution-for-large-branches-gitbutler/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

I think I may have finally found a solution to my giant git branch issue.

Recap: I have a bad history of creating huge git branches which are then difficult to review. I’ve found it very difficult to maintain the discipline needed to keep branches small. Recently I’ve been exploring ways I could make it easier to break these larger branches down for easier review.

I’ve been working on [an AI workflow](/writing/iterating-on-a-pr-extraction-workflow) for this. It’s definitely shown promise. However I’ve found it to be temperamental and easy to break when I make changes to the saved prompt.

I’ve been aware for a little while that there was a piece of software called [GitButler](https://gitbutler.com/) that was supposed to make this kind of thing easier. However when I had previously looked into it, GitButler wasn’t yet available for Linux.

I checked again recently, and it now is. And with [a little bit of cajoling](https://github.com/gitbutlerapp/gitbutler/issues/11761), it’s now working on my system.

<figure><img src="/writing/solution-for-large-branches-gitbutler/2.webp" alt="https://gitbutler.com/images/app-preview-dark.png" width="1456" height="843" loading="lazy"><figcaption>Screenshot from the GitButler website</figcaption></figure>

I think this software may have just eliminated the issue altogether.

Even without this software I could create new branches as I build, of course. But doing so requires a lot of thinking:

1. Do I need a new branch?
2. Would the changes I put on a new branch depend on the changes in my previous branch? This determines what I should base the new branch on.
3. If I make the wrong decision, am I willing to wait for the branch to get reviewed and merged to default? Or do I need to do the work to change the bases of my branches or otherwise figure out the git magic to make the work on the non-merged branch available in my future branches?
4. Is the work in each branch an appropriate subset whose intent will be clear to reviewers and won’t invite unproductive back-and-forth due to lack of context?
5. How do I make sure the same changes don’t show up in the diffs on multiple of my PRs, making them unnecessarily difficult to review?
6. Stacked PRs always sound appealing. Should I try making a PR stack? What tool should I use?

Given all this uncertainty and friction, I usually end up ignoring the question and just staying heads-down in the code. It certainly feels more productive, at least until I actually need to get my work reviewed and merged.

<iframe src="https://www.youtube-nocookie.com/embed/DhJtNNhCNLM" title="YouTube video" loading="lazy" allowfullscreen=""></iframe>

I’ve only been using GitButler for a few days now, but it seems to address all these issues very effectively.

1. GitButler uses virtual branches, so multiple git branches can be applied to your working tree at once. Creating new branches is extremely easy and doesn’t require shifting existing work around.
2. While shifting work around isn’t required, GitButler makes it incredibly easy to do when needed. Files, hunks, and commits can all be dragged around. Commit on the wrong branch? Drag it to a different branch. Realize that one branch should actually depend on another? Drag the branch to where it should go in the stack, or to a new column to break it out of a stack.
3. Since you can have as many virtual branches applied to your working tree as you want, there’s no longer an issue with needing to wait for a PR to be reviewed and merged in order to have easy access to those changes while working on a new branch.
4. See #2.
5. Since there isn’t a need to worry about making sure changes from one unmerged branch are available within another, accidentally having the same changes appear in review diffs on multiple branches is unlikely.
6. Creating PR stacks in GitButler is super easy, and GitButler takes care of keeping an updated list of the PRs in the stack in each PR’s description, and rebasing your branches as needed.

My only concern is that once the novelty has worn off I’ll fail to keep using GitButler and end up with large branches again. We’ll see how it goes!
