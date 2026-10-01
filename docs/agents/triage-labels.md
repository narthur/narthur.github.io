# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage` †     | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info` †       | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent` †  | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human` †  | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

† **Not created yet.** Checked 2026-10-01: of these five, only `wontfix` exists
on `narthur/narthur.github.io`. Applying one of the others will fail until it is
created — `gh label create needs-triage --description "..."`, and so on. Names
are settled; the labels themselves are not.

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.
