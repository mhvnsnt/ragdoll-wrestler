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
## ANTI-CLOBBER LAW (owner 2026-10-17 — the DXMMII 54k-file deletion)
On 2026-10-17 an agent committed from a working tree missing 54,456 files. `git add -A` swept every missing file in as a deletion, and the commit rode into main through PR #221. The agent's real work was 105 files. Nobody checked the deletion list before committing or merging. Canonical text: mhvnsnt/agent-ops `docs/ANTI-CLOBBER-LAW.md`.
1. Read your deletions before every commit (`git status` + `git diff --cached --name-status`). Every deleted file must be something your task meant to delete. Unexplained deletions = STOP, do not commit. Assume your environment is corrupted — do not try to "fix" it by committing.
2. Never `git add -A` / `git commit -a` in a tree you didn't fully populate yourself. Verify tree completeness (file counts vs the remote branch) first.
3. Say what you deleted in the commit message (which dirs/file types, and why). Message/diff mismatch on deletions = hard failure, do not push.
4. Deletion circuit breaker: any deletion outside your task's scope blocks the commit. Stop and report instead of committing.
5. The merger reads the PR's deletion list and matches it against the task. Unexplained deletions block the merge. A giant diff's deletions are never "probably fine".
