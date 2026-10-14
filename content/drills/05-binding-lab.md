# 05 — Binding Lab ("binong"): skinning a mesh to bones

Binding = telling each vertex which bone(s) to follow and how much.
Get it wrong and elbows collapse, shoulders pinch, thighs stick to the
wrong leg. This lab runs Blender 4.0.2's three built-in binding methods
on a practice body and teaches you when to reach for each.

## Setup

1. Get a body: `examples/quaternius/` (Warrior.fbx — CC0, rigged already,
   but we're going to UNBIND and rebind it), or generate one with MB-Lab
   (`tools/character-gen/mb-lab/`).
2. Import the FBX: File > Import > FBX. Select the mesh, go to
   Object Data Properties > Vertex Groups — you'll see the existing groups.
   For the lab, delete them all (minus button) so we start clean.

## Method 1 — Envelope (fastest, roughest)

1. Select mesh, Shift-select armature, Ctrl+P > **Armature Deform > With
   Envelope Weights**.
2. What it does: each bone has an invisible capsule (envelope); vertices
   inside get weight by distance. No raycasting, no volume analysis.
3. When to use: blockout, background characters, quick tests. Never for
   hero bodies — envelopes don't understand concavities (armpits, crotch).

## Method 2 — Automatic Weights (the default workhorse)

1. Same, but Ctrl+P > **Armature Deform > With Automatic Weights**.
2. What it does: voxelizes the mesh and solves heat diffusion from each
   bone — weights follow the actual volume.
3. When to use: most characters, most of the time. Fails on: overlapping
   separate meshes (buttons, armor plates get welded to the wrong bone),
   very thin parts (fingers), disconnected pieces.
4. If it fails with "Bone Heat Weighting failed": the mesh has
   non-manifold junk — go to Edit Mode, Select > Select All by Trait >
   Non Manifold, fix or delete, retry.

## Method 3 — Voxel Heat Diffuse (the fixer)

This is an **operator on the weights**, not a parent option:

1. Parent with Empty Groups first (Ctrl+P > Armature Deform >
   With Empty Groups), or keep your Automatic Weights result.
2. Select mesh, go to Weight Paint mode, Weights menu >
   **Voxel Heat Diffuse Skinning**.
3. What it does: re-solves weights with a more robust voxel solver —
   rescues cases where Automatic Weights failed or bled (armpit → torso,
   thigh → thigh).
4. Tune in the redo panel (F9): Resolution (higher = slower, cleaner),
   Falloff.

## Checking your bind (do this every time)

1. Pose Mode: rotate elbows, knees, shoulders to extremes. Look for:
   - collapsing volumes (candy-wrapper twist on forearms),
   - stray vertices (one vertex flying off = wrong group),
   - pinching (armpit/crotch).
2. Weight Paint mode: blue = 0, red = 1. Every deforming vertex should
   sum to ~1.0 across groups (check with the "Normalize All" operator
   if shoulders look lumpy: Weights > Normalize All).
3. Fix by hand: Weight Paint brush, Add/Subtract, or the Gradient tool
   for smooth falloffs across joints.

## Drill

1. Warrior.fbx → delete vertex groups → bind with Automatic Weights.
2. Pose: deep knee bend + arm raised overhead. Screenshot the worst spot.
3. Run Voxel Heat Diffuse on the worst joint. Compare.
4. Hand-fix one remaining bleeder with the Subtract brush.

Next: `06-rigging-lab.md` (build the rig itself), then
`07-softbody-deformation-lab.md` (fix what binding can't).
