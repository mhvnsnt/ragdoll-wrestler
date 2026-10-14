# 06 — Rigging Lab: building the skeleton

Rigging = building the bone system that binding (lab 05) attaches the mesh
to. Three routes, cheapest first.

## Route A — Rigify (built-in, free, 10 minutes)

Blender ships Rigify. It's the fastest credible human rig.

1. Enable: Edit > Preferences > Add-ons > search "Rigify" > enable
   **Rigify**.
2. Add > Armature > **Human (Meta-Rig)**. In Edit Mode, scale/position the
   meta-rig bones to match your mesh (use front + side views; get the
   joints ON the anatomical joints — shoulder at the deltoid cap, not the
   neck).
3. Pose Mode > Rigify panel > **Generate Rig**. You get the full control
   rig (IK/FK switches, facial bones if you placed them).
4. Bind: select mesh, Shift-select the GENERATED rig (`rig`, not
   `metarig`), Ctrl+P > Armature Deform > With Automatic Weights.
5. Gotchas: never bind to the metarig; never edit the generated rig
   directly (regenerate instead); keep the metarig on a hidden collection
   in case you need to regenerate.

## Route B — BlenRig 6 (vendored, `addons/blenrig/`)

Auto-rigging + skinning system with guide-based workflows.

1. Install: Edit > Preferences > Add-ons > Install from Disk > pick
   `addons/blenrig/` > enable **BlenRig 6**. (Verified enabling in
   Blender 4.0.2 headless; vendored tag `6_v4_0_1`.)
2. Armature > Add > **BlenRig 6 Biped** (guides appear in the Armature
   menu after enabling).
3. Follow the on-screen guides: align the guide bones to your mesh,
   then run the rig generation. BlenRig ships pre-weighted reference
   meshes and corrective shape keys you can study.
4. The **Mesh Deform cage** (lab 07) is BlenRig's soft-body-ish trick:
   a low-res cage mesh drives the high-res body — art-directable
   deformation without a sim.
5. Gotchas: BlenRig rigs are opinionated (its own bone names/layers);
   don't mix BlenRig parts with Rigify parts on one character.

## Route C — Mixamo auto-rigger (free, web)

When you have a static mesh and zero patience:

1. mixamo.com (free Adobe account) > Upload Character > upload your
   OBJ/FBX (T-pose or A-pose, arms slightly down).
2. Place the chin/wrist/elbow/knee markers where asked > Next >
   auto-skeleton + skinning in ~2 minutes.
3. Download: FBX for Unity (.fbx, 30fps) > Import into Blender.
4. Gotchas: Mixamo's skeleton is game-style (no twist bones, simple
   spine) — fine for background/Unity work, not for film-quality
   deformation. Re-target its animations with Rokoko or Blender's
   built-in retargeting if you need them on a Rigify/BlenRig rig.

## Drill

1. Take the same Quaternius Warrior from lab 05.
2. Route A: meta-rig → generate → bind → pose a walk stance.
3. Compare its shoulder deformation against the FBX's original rig.
4. (Stretch) Route B: generate a BlenRig biped on the same mesh and
   compare elbow bending — which holds volume better?

Next: `07-softbody-deformation-lab.md` — fixing what no bind survives.
