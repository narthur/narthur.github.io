---
title: 'GitHub CLI Alias to Prep Git for Your Next Task'
date: 2026-08-06T15:46:46.147Z
substack: https://narthur.substack.com/p/github-cli-alias-to-prep-git-for
---

<figure><img src="/writing/github-cli-alias-to-prep-git-for/1.webp" alt="" width="1024" height="608" loading="eager"></figure>

A while back I found myself getting mildly annoyed by the friction around ensuring a repo’s git was in the correct state for starting a new task with Claude Code.

1.  Am I on the default branch so Claude Code doesn’t create a PR based on another branch it shouldn’t?
2.  Is the default branch up-to-date with origin?
3.  Is the branch I was on previously merged and ready to be deleted?

I ended up adding a GitHub CLI alias built on top of [gh-poi](https://github.com/seachicken/gh-poi), a GitHub CLI plugin that deletes branches that are already merged into the default branch. I called the alias “doi” based on it running “poi” on the **d**efault branch.

With my alias set, I run `gh doi` in terminal, which runs the following commands:

```
# Save default branch name, so it'll work if your
# default branch is main or master or development
# or whatever
DEFAULT=$(gh repo view --json defaultBranchRef --jq ".defaultBranchRef.name")

# Checkout default branch
git checkout "$DEFAULT"

# Pull default branch
git pull

# Delete merged branches
gh poi
```

Here’s how to install gh-poi and add the alias:

```
gh extension install seachicken/gh-poi
gh alias set doi '!DEFAULT=$(gh repo view --json defaultBranchRef --jq ".defaultBranchRef.name") && git checkout "$DEFAULT" && git pull && gh poi'
```

And that’s it. You’re ready to run `gh doi` the next time you want to make sure your working tree is prepped to start a new task.
