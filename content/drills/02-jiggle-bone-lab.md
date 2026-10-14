# Drill 02 — Jiggle-bone lab

Goal: build intuition for spring physics on bones — tails, hair, hanging
chains, loose cloth bones.

## Setup
1. Install `addons/wiggle_2_ultimate.py` (Edit > Preferences > Add-ons >
   Install from Disk), enable it.
2. Open `scenes/demo_playground.blend`, press Play. Watch the chain lag
   behind the rocking armature: stiff base, loose tip.

## Drills
1. **Stiffness sweep.** Select `chain_05` (tip), set Stiff 60 → 400 → 60.
   Play each time. Note how high stiffness kills the swing.
2. **Damping sweep.** Set Damp on the tip 0.4 → 3.0. High damping = swing
   dies fast; low damping = keeps oscillating.
3. **Your chain.** Open your model, Pose Mode, select a bone chain
   (tail, braid, belt strap). Run `scripts/setup_jiggle_bones.py` from the
   Text Editor. Scrub: base must HOLD, tip must SWING.
4. **The base-lock test.** If the whole chain swings from the root, the
   attachment bone is leaking rotation — raise its stiffness to 800+ and
   re-test. (This was the exact defect in the first Pantera tail video.)
5. **Collision.** Add a sphere as a Wiggle collider, move it through the
   chain while playing. Bones should deflect, not clip through.

## Pass criteria
- You can predict what halving tip stiffness will look like before you
  press Play — and you're right.
- No bone ever passes through the body mesh with collision on.
- Base bone visibly locked while the tip swings free.
