# Drill 04 — Ragdoll Lab

Drop a character, watch it collapse, bring it back. Uses the
**Ragdoll Kitten** addon (`addons/ragdoll-kitten/`) and a Quaternius CC0
body (`examples/quaternius/`). Blender 4.0.2 menu paths.

## Setup

1. Install Ragdoll Kitten: Edit > Preferences > Add-ons > Install from
   Disk → pick `addons/ragdoll-kitten/ragdoll_kitten-1.0.0.zip`
   (zip the `ragdoll_kitten/` folder if you only have the folder).
   Enable the checkbox.
2. Import a body: File > Import > FBX → `examples/quaternius/Warrior.fbx`.
   (Any of the six works; Warrior has the clearest silhouette.)
3. Select the armature. The Ragdoll Kitten panel appears at
   Properties > Physics > Ragdoll Kitten.

## a) Generate the ragdoll hitboxes

4. If the scene has no Rigid Body World, the panel prompts you —
   click **Add Rigid Body World** (and Constraints when asked).
5. Go Pose Mode, select the bones you want simulated. First pass: keep it
   simple — spine, head, upper arms, thighs. Hide the finger/toe bones
   (H) so they don't get hitboxes.
6. Click **Add Ragdoll**. Cubes appear around the selected bones — those
   are the rigid bodies; the armature now drives them (or vice versa).

## b) Drop it on a floor

7. Add a floor: Add > Mesh > Plane. With it selected:
   Object > Rigid Body > Add Passive.
8. Move the character up a couple meters (G, Z, 2).
9. Set the frame range (Timeline: 1–120). Press **Spacebar**. The body
   should crumple onto the plane.

## c) Tune it

10. Select a hitbox cube → Physics tab → Rigid Body Collisions: raise
    **Friction** if it slides too much, lower **Bounciness** if it
    trampolines.
11. In the Ragdoll Kitten Constraints panel: tighten rotational limits on
    elbows/knees (hinge-like), leave shoulders/hips loose (ball-like).
12. Geometry panel: scale hitboxes with **Relative Scale** until they hug
    the mesh. Solid viewport shading shows the boxes.
13. Optional: select the body mesh as **Deform Mesh** and hit
    **Approximate** in Pose Mode to snap hitboxes to the mesh surface.
    (Slow on dense meshes — do it per limb.)

## d) Bake it

14. Scene Properties > Rigid Body World > **Bake All Dynamics**
    (or Delete All Bakes to clear and re-run).
15. Scrub the timeline — the fall is now keyframed rigid-body motion.

## e) Blend back to animation

16. In the Ragdoll Kitten **Animated** panel: keyframe the **Animated**
    influence. 1.0 = full animation control, 0.0 = full ragdoll.
17. Classic hit reaction: animate the character (walk/idle) with influence
    1.0, drop to 0.0 on the impact frame, ease back to 1.0 over ~20
    frames as they get up. That's the whole trick behind game hit
    reactions.

## Checklist (before you call it done)

- [ ] Body falls, doesn't hover or explode.
- [ ] No hitbox clipping visibly through the mesh (approximate or scale).
- [ ] Knees/elbows bend the right way (constraint limits).
- [ ] Bake plays the same every time (cache baked, not live).
- [ ] Blend back to animation is smooth, no pop on the transition.

## Next

- Swap the body: re-run the drill on `Rogue.fbx` (thinner) vs
  `Cleric.fbx` — notice how hitbox scale changes the fall.
- Compare with an external solver: `tools/physics-engines/` has the same
  "drop a humanoid" in PyBullet and MuJoCo — tune there, apply here.
