---
title: 'Check for a stray .pnpm-store before git add -A'
date: 2026-11-09
link: https://pnpm.io/cli/store
---

pnpm keeps every package in one global store. Each project's `node_modules` hard-links to it. `pnpm store path` prints where that store lives. Normally it is under your home directory, outside any repo.

If the home directory isn't writable, pnpm falls back to a store inside the project, at `.pnpm-store/`. A sandboxed shell can trigger this. The install still succeeds and nothing looks wrong. Then `git add -A` stages tens of thousands of package files, because the folder isn't in `.gitignore`.

Two commands and one ignore line catch it:

```bash
pnpm store path   # should point outside the repo
git status --short | wc -l   # thousands of lines means something unignored got in
echo ".pnpm-store" >> .gitignore
```

Run the count before any commit that follows an install. If it is huge, `git reset` to unstage everything and look at what appeared.

Nathan hit this with an AI agent working in a sandboxed git worktree. The install fell back to a repo-local store. A later `git add -A` swept about 97,000 files into a commit, and the commit had to be rebuilt before it could be pushed. Running the install outside the sandbox fixed it at the source. The ignore line is the safety net for whoever forgets.

Add `.pnpm-store` to your `.gitignore` today, and glance at the file count in `git status` after every install.
