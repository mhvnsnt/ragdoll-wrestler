# 07 — Soft-Body Deformation Lab

Binding (lab 05) gets you 90%. This lab is the last 10%: the tricks that
keep flesh looking like flesh when bones bend — and when to run an actual
simulation instead.

## 1. Corrective Smooth (the 30-second fix)

The modifier that hides a multitude of binding sins:

1. Select mesh > Modifiers > Add > **Corrective Smooth**.
2. Put it AFTER the Armature modifier in the stack.
3. Settings: Factor 0.5, Repeat 2–3, enable "Only Smooth" off (you want
   the shrinkwrap-ish correction), vertex group to limit it to problem
   joints (elbows, shoulders, knees).
4. What it does: relaxes the mesh toward its rest shape after deformation
   — kills pinching and candy-wrapper collapse without repainting weights.
5. Cost: it's a post-deform smooth; too high and the character looks
   melt-y. Mask it to joints.

## 2. Mesh Deform cage (art-directable soft body)

The BlenRig trick (`addons/blenrig/`), usable on any character:

1. Model a LOW-RES cage around the body part (a limb, the torso) —
   simple, all-quads, slightly larger than the flesh.
2. Select flesh, add **Mesh Deform** modifier, point it at the cage,
   click **Bind** (bind is slow once; that's normal).
3. Now deform the CAGE (armature on the cage, or shape keys on the
   cage) — the high-res flesh follows smoothly. This is how you get
   belly jiggle and thigh squash that you can art-direct bone by bone,
   no sim required.
4. Cage binding fails if the cage intersects itself — keep it clean.

## 3. Shape keys + drivers (muscle bulge)

1. Select mesh > Object Data Properties > Shape Keys > + (Basis exists
   by default) > + again to add "bicep_flex".
2. Edit Mode with "bicep_flex" active: sculpt the bulge.
3. Back in Object Mode: right-click the shape key Value > Add Driver >
   Manually Create Later. Open the Drivers editor, set driver type
   "Averaged Value", target the forearm bone's rotation.
4. Now bending the elbow inflates the bicep. Repeat for calves, chest
   breathing (driven by a custom property), etc.

## 4. Real Soft Body sim (when faking won't do)

For actual jiggling flesh (belly, chest):

1. Select the flesh object > Physics Properties > **Soft Body**.
2. Settings that matter: Goal (pin the parts that shouldn't move —
   paint a vertex group, set it as Goal), Edges (stiffness), Damping.
3. Bake: Soft Body Cache > Bake. Collide against bones via Collision
   physics on the armature meshes if needed.
4. Reality check: Blender's soft body is slow and springy — for game
   export, you're usually better off with Mesh Deform + jiggle bones
   (lab 02) faking it. Sim is for film shots.

## Drill

1. Warrior.fbx bound rig from lab 05 → add Corrective Smooth after the
   Armature modifier, masked to elbows.
2. Bend the elbow 120°. Screenshot before/after the modifier.
3. (Stretch) Build a Mesh Deform cage around the thigh, bind it, and
   drive a squash with a shape key on the cage.

Pipeline so far: generate (MB-Lab / Quaternius) → rig (lab 06) →
bind (lab 05) → deform (this lab) → jiggle (lab 02 + VRM spring bones).
