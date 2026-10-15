# AGENTS.md

Instructions for every AI agent working in this repo.

## No-data-loss rules (MANDATORY)
Read and follow [`docs/NO-DATA-LOSS-RULES.md`](docs/NO-DATA-LOSS-RULES.md) (canonical: mhvnsnt/agent-ops). No force-push, no rebase/amend of pushed work, no history rewrite, no branch/asset deletion without backup + owner approval, PRs only, empty D-filter + gitleaks + green CI before merge, push incrementally, keep WORKLOG, back up and sha256-verify before disk cleanup, never touch other agents' or Muse's work.


## MERGE-IT-YOURSELF LAW (owner 2026-10-15)
"Stop leaving things open for me to merge... I don't like to manually handle PRs."
When a PR satisfies ALL merge conditions (GitHub says MERGEABLE, CI green, no-deletion guard clean, gitleaks clean, build passes), MERGE IT — do not leave it open for the owner. He does not want to manually handle PRs.
The merge must be CLEAN and NON-DESTRUCTIVE: merge commits, never rebase/squash/force-push; resolve conflicts by keeping both sides' work — nothing lost, nothing clobbered, nothing destroyed on either side. Verify the merged result still builds and passes tests before calling it done.
A PR that is red, conflicting, or would lose work stays OPEN with a comment naming the blocker — but the default for a clean, green PR is MERGE, never "leave it for the owner."
Carve-outs (standing owner decisions, not overridden): never merge a DRAFT PR; never merge a PR the owner explicitly excluded.
