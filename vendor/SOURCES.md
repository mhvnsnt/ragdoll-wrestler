# Vendored libraries

All libraries below are open-source, MIT-licensed. Dist files only (no build
tooling vendored). License files verified in each upstream repo at pull time
(2026-10-14).

## matter-js — 2D physics engine
- Source: https://github.com/liabru/matter-js
- License: MIT (c) Liam Brummitt and contributors — see `matter-js/LICENSE`
- File: `matter-js/matter.min.js` (official built dist, 0.20.x line)
- Used for: all DEMOS tab physics scenes (ragdoll, jiggle tower, zero-g orbit)

## hammer.js — touch gesture recognition
- Source: https://github.com/hammerjs/hammer.js
- License: MIT (c) 2011-2017 Jorik Tangelder (Eight Media) — see `hammerjs/LICENSE`
  (LICENSE.md verified in the upstream repo)
- File: `hammerjs/hammer.min.js` — the official **2.0.8 release build**
  (banner reads v2.0.7, the release's known quirk).
- IMPORTANT: do NOT rebuild from the repo's master branch — its ES6-class
  rewrite has an input-init regression (the `Input` constructor calls
  `init()` before subclasses set `evEl`/`evWin`, so no input listeners are
  ever attached and no gesture ever fires; verified empirically). The 2.0.8
  release build works correctly.
- Used for: tap / press / pan / pinch / swipe gesture system. Double-tap is
  disambiguated manually in app.js (320ms window), not via Hammer's
  multi-tap recognizer.

## marked — markdown parser
- Source: https://github.com/markedjs/marked (v18.1.1)
- License: MIT — see `marked/LICENSE`
- File: `marked/marked.min.js` — UMD/IIFE build bundled locally from the
  verified v18.1.1 source with esbuild (`src/marked.ts --format=iife
  --global-name=marked --minify`), because upstream v18 ships ESM-only.
  Verified: `marked.parse("# hi")` → `<h1>hi</h1>`.
- Used for: rendering the DRILLS tab markdown

## three.js r147 (MIT)
- Source: https://github.com/mrdoob/three.js (release r147)
- Files: vendor/three/three.min.js (UMD build), examples/js UMD loaders FBXLoader.js + GLTFLoader.js, examples/js/controls/OrbitControls.js, LICENSE (MIT).
- Why r147: last era shipping global-THREE UMD scripts (no ES-module build step, works from file:// and plain static hosting). FBXLoader needs the fflate global.
- Note: fflate@0.8.2 UMD (vendor/three/fflate.min.js, MIT, https://github.com/101arrowz/fflate) — required by FBXLoader for compressed binary FBX.
