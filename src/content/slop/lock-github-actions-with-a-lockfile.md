---
title: 'Lock your GitHub Actions with gh actions-lock'
link: https://github.com/github/gh-actions-lock
date: 2026-11-27
---

GitHub Actions now supports workflow lockfiles, and the `gh actions-lock` extension sets one up in two commands. It swaps hand-pasted commit SHAs for readable version tags, and a lockfile records the exact commit each tag resolved to.

Pinning to a full SHA was the standing advice because tags are mutable. An attacker who gets write access to an action's repo can point a trusted tag at malicious code. Every workflow using that tag then runs it. SHAs fix that but are unreadable and tedious to update. A lockfile keeps the protection and brings the tags back.

Install the extension and run it in the repo:

```bash
gh extension install github/gh-actions-lock
gh actions-lock
```

Workflows now say `actions/checkout@v7.0.1` instead of a 40-character hash. The new `.github/workflows/actions.lock` lists the commit behind each tag. Commit the changed workflows and the lockfile together. Dependabot and Renovate both update the lockfile along with the workflows, so the usual update PRs keep working.

Add a CI job so a stale lockfile fails the build:

```yaml
lockfile:
  runs-on: ubuntu-latest
  env:
    GH_TOKEN: ${{ github.token }}
  steps:
    - uses: actions/checkout@v7.0.1
    - run: gh extension install github/gh-actions-lock
    - run: gh actions-lock --verify
```

If zizmor lints the workflows, update it to v1.32.0 or later. That is the first release that understands lockfiles, and older versions still tell you to hash-pin.

Run `gh actions-lock` in one repo today and commit the result.
