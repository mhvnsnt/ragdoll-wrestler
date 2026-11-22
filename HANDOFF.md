# HANDOFF — ragdoll-wrestler

**Last updated: 2026-11-22 (America/New_York).**
**Repo:** `mhvnsnt/ragdoll-wrestler` (PUBLIC), default branch `main`.
**Purpose of this file:** any agent that picks up work here reads this FIRST, then the linked docs. It states what we've done, where we're at, and what we're working toward — so the owner can say "go to this repo, pick up the work" and you just know. Update this file in the same PR whenever the state changes (add, don't delete).

## 1. What this repo is

Ragdoll Wrestler — a physics-playground variant: touch demos, drills, and a 3D model viewer, as a web app (`index.html`, `app.js`, `model-viewer.js`, `styles.css`, `manifest.json`, `sw.js`, `content/`, `examples/`, `tools/`, `vendor/`). It is the playful physics side of the wrestling work: ragdoll bodies, touch-driven demos, and drills the owner can poke at on his phone.

At 4.2 MB it is a working web app, not a study doc. It sits next to `wh-mocap-viewer` (watch clips) and the physics playground repos — this one is for FEELING the physics, not for clip review.

## 2. Where we're at

### DONE
- **Working app in place:** `index.html` + `app.js` + `model-viewer.js`, PWA manifest + service worker (`manifest.json`, `sw.js`), touch demos and drills under `content/` and `examples/`, tooling under `tools/`, vendored deps under `vendor/`.
- **Working method stated (2026-10-27):** commits `9a30eda` / `cd02ea9` ("Add working method statement"), `WORKING-METHOD.md` at root.
- **Anti-clobber laws merged (2026-10-17, PR #8):** the owner's anti-clobber laws are in `AGENTS.md`.
- **Last push 2026-11-20** (repo metadata; no new content commits after Oct 27 — the push reflects repo-level activity).

### IN PROGRESS
- **Three open PRs:** PR #11 — "Docs: pre-made parts first rule" (2026-11-20, `docs/premade-parts-first`); PR #10 — "Docs: sourcing rule" (2026-11-19, `docs/sourcing-rule`); PR #7 — "law: ANTI-CLOBBER LAW (owner 2026-10-17)" (`law/anti-clobber-20261017`, open since Oct 17 — note PR #8 already merged the anti-clobber laws, so #7 may be a superseded duplicate; check before touching it). Next step: a merge/close call on #7, #10, #11.
- **No README at root.** Pickup starts at `AGENTS.md` and `WORKING-METHOD.md`, not a README.

### BLOCKED
- **Nothing recorded as blocked in the repo state read 2026-11-22.** No blocked item is named in this repo. The open PRs are awaiting a merge/close decision, not unblocked work. What the next feature is (which drill, which demo) is not recorded in the repo — that is an open question, not a blocker (see §6).

## 3. What we're working toward

**The goal:** a ragdoll wrestling toy that feels right on the phone — touch it, it flops, it drills, it shows the model. The physics playground where wrestling movement gets felt before it gets built into the game.

**The bar (owner, general):** REAL-SOURCE-ONLY — real parts, wired in; the work proves itself in a live build the owner can open and poke at on his phone, never a text-only "done". Physics must be felt in the build, not described in a doc.

**In order:** (1) resolve the three open PRs (#7, #10, #11 — merge or close); (2) next drill/demo per the owner's call; (3) keep it playable from a phone link with no setup steps for him.

## 4. Standing rules that apply here

- **Branch → PR → merge, always.** Never push to main directly. Add-only, zero-conflict PRs, no force pushes.
- **Checkpoint-and-save law:** CHECKPOINT.md first, update after every step; the repo is the save; resume, never restart.
- **No-temp-storage law:** nothing in /tmp or any wipeable location, ever. Everything goes straight into the repo or a durable folder the second it exists.
- **Real-source-only:** every part comes from the actual source code and files, wired up fully. No hand-tooled lookalikes, no fake panels.
- **Anti-clobber law (owner 2026-10-17):** do not clobber other lanes' work. Add, don't overwrite; check what's there before writing.
- **Verify with your own eyes:** a physics change is proven in the live build on a phone, not in a commit message.
- **No-gaps / solve-it law:** a gap or block is never the end of the work — route-switch until it's done or every reasonable route is exhausted with exact errors recorded.
- **Phone-only:** the owner opens it on his phone. Touch demos must work there, with no setup steps for him.

## 5. Key files and paths

| What | Where |
|---|---|
| App entry | `index.html`, `app.js`, `styles.css` |
| 3D model viewer | `model-viewer.js` |
| PWA shell | `manifest.json`, `sw.js` |
| Demos / drills | `content/`, `examples/` |
| Tooling | `tools/` |
| Vendored deps | `vendor/` |
| Icons | `icons/` |
| Agent notes / working method | `AGENTS.md`, `WORKING-METHOD.md` |
| Docs | `docs/` |
| Open PRs | #7 (anti-clobber law — possibly superseded by merged #8), #10 (sourcing rule), #11 (pre-made parts first rule) |

There is no root README and no releases in this repo.

## 6. Open decisions needing the owner

- **Merge or close PRs #7, #10, #11?** #10 and #11 are the two docs-rule PRs. #7 is the anti-clobber law branch — but PR #8 already merged the anti-clobber laws, so #7 may be a stale duplicate that should be closed, not merged. His call — lanes do not decide merges or closes.
- **What's the next drill/demo?** The repo doesn't record a next feature. That priority is his call, not a lane's guess.
- **No other owner decision is recorded as open in this repo's state.**

## 7. How to pick up

1. Read this HANDOFF.md first, then `AGENTS.md` and `WORKING-METHOD.md` (there is no README).
2. Check the three open PRs (#7, #10, #11) — especially whether #7 duplicates merged #8 — and leave them alone unless told to merge/close.
3. Check what other agents are already doing before starting anything (never start a duplicate session; anti-clobber: add, don't overwrite).
4. Resume from the stated next step — never restart, never re-derive finished work.
5. Land work branch → PR → merge, add-only. Update this HANDOFF.md in the same PR when the state changes. Prove physics changes in the live build on a phone before claiming anything done.
