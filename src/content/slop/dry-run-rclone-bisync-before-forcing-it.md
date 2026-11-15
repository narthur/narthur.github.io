---
title: 'Dry-run rclone bisync before forcing it'
date: 2026-11-22
link: https://rclone.org/bisync/
---

rclone bisync keeps two paths in sync in both directions, and it ships with a brake. If more than the `--max-delete` percentage of files looks deleted on either side, the run aborts without changing anything. The docs say the brake is there to stop a temporary network problem or an accidental delete from wiping out both copies.

The abort is correct when the deletions are a mistake, and a nuisance when they are intentional. The docs name two ways past it: raise the limit with `--max-delete`, or bypass the check with `--force`. Before either one, look at what bisync intends to do:

```bash
rclone bisync remote1:path1 remote2:path2 --dry-run --verbose
```

With `--dry-run`, bisync goes through the motions without copying or deleting anything, and `--verbose` makes it list each file. If every deletion in the list is expected, run the same command again with `--force` in place of `--dry-run`. The docs suggest pairing `--force` with `--verbose` too.

Keep every other argument identical between the two runs, so the real run matches the preview. Do not reach for `--resync` to get past the abort. It brings both sides back into agreement by copying, and the docs warn that it can make deleted files reappear.

Nathan's Obsidian vault syncs this way, with a local folder and a Backblaze B2 bucket. After a long gap, a run aborted on about 26,600 deletions. They came from a large folder deliberately moved out of the vault. The deletions were that expected folder plus old attachments, and a full copy of the folder was kept elsewhere. So the same run with `--force` was safe.

Next time bisync aborts on a delete count, run the command with `--dry-run --verbose` and read the list before changing anything else.
