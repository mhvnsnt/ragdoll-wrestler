# Drill 03 — Cloth, soft-body, rigid-body

Goal: Blender's built-in simulators, practiced on your model.

## Cloth (capes, skirts, loose sleeves)
1. Select the cloth mesh > Properties > Physics > Cloth.
2. Preset: Cotton for stiff, Silk for flowy. Start with Silk.
3. Pin the vertices that attach to the body (Vertex Group > Pin).
4. Add a Collision modifier to the body mesh underneath.
5. Play 60 frames. Fix clipping by raising cloth Quality Steps to 10+
   and the collision Distance.

## Soft body (flesh jiggle)
1. Duplicate a fleshy part to a test object first — never tune on the
   hero mesh.
2. Physics > Soft Body. Keep Goal at 0.7 so it holds shape, Friction 5.
3. Animate the body moving; the soft part should lag one or two frames
   behind, then settle. If it explodes, lower the Goal spring values.

## Rigid body (props, debris)
1. Floor: Physics > Rigid Body > Passive.
2. Props: Physics > Rigid Body > Active, Shape: Convex Hull (Mesh is slow).
3. Play: props fall, collide, settle. Nothing falls through the floor —
   if it does, raise Steps Per Second to 120.

## Pass criteria
- 60 clean frames of each sim with zero interpenetration.
- You can explain why the pin group exists and what Quality Steps cost.
