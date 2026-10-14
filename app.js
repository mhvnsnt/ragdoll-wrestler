/* Physics Playground — mobile PWA
 * Matter.js scenes + Hammer.js gestures. Vanilla, no build step. */
(function () {
'use strict';

if (!window.Matter) { document.getElementById('hintBar').textContent = 'Physics engine failed to load.'; return; }
if (!window.Hammer) { document.getElementById('hintBar').textContent = 'Gesture library failed to load.'; return; }

const { Engine, Render, Runner, Bodies, Body, Composite, Constraint, Events, Vector } = Matter;

/* ---------------- toast ---------------- */
const toastEl = document.getElementById('toast');
let toastTimer = 0;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1400);
}

/* ---------------- tabs ---------------- */
const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
const panels = {};
Array.from(document.querySelectorAll('.tab-panel')).forEach(el => { panels[el.id] = el; });
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.toggle('is-active', b === btn));
    Object.entries(panels).forEach(([id, el]) => el.classList.toggle('is-active', id === btn.dataset.tab));
    if (btn.dataset.tab === 'tab-demos') requestAnimationFrame(fitCanvas);
    if (btn.dataset.tab === 'tab-models' && window.__viewerFit) requestAnimationFrame(window.__viewerFit);
  });
});

/* ---------------- matter setup ---------------- */
const canvas = document.getElementById('world');
const wrap = document.getElementById('canvasWrap');
const engine = Engine.create({ enableSleeping: false });
const world = engine.world;
const render = Render.create({
  canvas,
  engine,
  options: {
    wireframes: false,
    background: '#0a0e14',
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    hasBounds: true
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);

/* camera: world point at screen center + css-px per world unit */
const cam = { x: 400, y: 350, scale: 1 };
let camTouched = false; // true once the user zooms/pans

function applyCamera() {
  const w = wrap.clientWidth, h = wrap.clientHeight;
  if (!w || !h) return;
  const hw = (w / 2) / cam.scale, hh = (h / 2) / cam.scale;
  render.bounds.min.x = cam.x - hw;
  render.bounds.max.x = cam.x + hw;
  render.bounds.min.y = cam.y - hh;
  render.bounds.max.y = cam.y + hh;
}
function fitCanvas() {
  const w = wrap.clientWidth, h = wrap.clientHeight;
  if (!w || !h) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  render.options.width = w;
  render.options.height = h;
  // Matter.Render.setPixelRatio sets canvas.width/height AND the inline
  // style size from options — without this the canvas keeps Render.create's
  // default 800x600 style and everything draws ~2x too big, overlapping UI.
  Matter.Render.setPixelRatio(render, dpr);
  if (!camTouched && currentScene) fitHome();
  else applyCamera();
}
function fitHome() {
  const b = currentScene.home;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  const bw = Math.max(1, b.maxX - b.minX), bh = Math.max(1, b.maxY - b.minY);
  cam.scale = Math.min(w / bw, h / bh);
  cam.x = (b.minX + b.maxX) / 2;
  cam.y = (b.minY + b.maxY) / 2;
  camTouched = false;
  applyCamera();
}
function screenToWorld(sx, sy) {
  const r = canvas.getBoundingClientRect();
  return {
    x: cam.x + (sx - r.left - r.width / 2) / cam.scale,
    y: cam.y + (sy - r.top - r.height / 2) / cam.scale
  };
}
function bodyAt(p) {
  const bodies = Composite.allBodies(world);
  for (let i = bodies.length - 1; i >= 0; i--) {
    const b = bodies[i];
    if (b.isStatic || b.isSensor || b.label === 'floor') continue;
    if (Matter.Bounds.contains(b.bounds, p) && Matter.Vertices.contains(b.vertices, p)) return b;
  }
  return null;
}

if ('ResizeObserver' in window) new ResizeObserver(() => fitCanvas()).observe(wrap);
window.addEventListener('resize', fitCanvas);
window.addEventListener('orientationchange', () => setTimeout(fitCanvas, 250));

/* ---------------- scenes ---------------- */
const PALETTE = ['#58a6ff', '#f778ba', '#3fb950', '#d2a8ff', '#ffa657', '#79c0ff'];
const sceneNameEl = document.getElementById('sceneName');
const hintBar = document.getElementById('hintBar');
const btnGravity = document.getElementById('btnGravity');
const sceneDots = document.getElementById('sceneDots');
let currentScene = null;
let sceneIndex = 0;
let gravityOn = true;
let orbitAttraction = true;

function baseOptions() {
  return { friction: 0.5, frictionStatic: 0.6, restitution: 0.1, density: 0.0012 };
}
function addFloor(y, w) {
  const floor = Bodies.rectangle(400, y, w || 2000, 60, {
    isStatic: true, label: 'floor',
    render: { fillStyle: '#1c2330', strokeStyle: '#2a3342', lineWidth: 2 }
  });
  Composite.add(world, floor);
  return floor;
}
function joint(a, ax, ay, b, bx, by, stiffness) {
  return Constraint.create({
    bodyA: a, pointA: { x: ax, y: ay },
    bodyB: b, pointB: { x: bx, y: by },
    stiffness: stiffness == null ? 0.85 : stiffness,
    damping: 0.12, length: 6,
    render: { strokeStyle: '#9aa7b8', lineWidth: 3 }
  });
}

function buildRagdoll() {
  addFloor(680);
  const o = baseOptions();
  const head = Bodies.circle(400, 120, 26, { ...o, label: 'head', render: { fillStyle: '#ffd9a0' } });
  const torso = Bodies.rectangle(400, 205, 56, 104, { ...o, label: 'torso', render: { fillStyle: '#58a6ff' } });
  const uArmL = Bodies.rectangle(352, 190, 20, 64, { ...o, render: { fillStyle: '#f778ba' } });
  const fArmL = Bodies.rectangle(352, 262, 18, 60, { ...o, render: { fillStyle: '#f778ba' } });
  const uArmR = Bodies.rectangle(448, 190, 20, 64, { ...o, render: { fillStyle: '#f778ba' } });
  const fArmR = Bodies.rectangle(448, 262, 18, 60, { ...o, render: { fillStyle: '#f778ba' } });
  const thighL = Bodies.rectangle(379, 330, 24, 78, { ...o, render: { fillStyle: '#79c0ff' } });
  const shinL = Bodies.rectangle(379, 418, 20, 72, { ...o, render: { fillStyle: '#79c0ff' } });
  const thighR = Bodies.rectangle(421, 330, 24, 78, { ...o, render: { fillStyle: '#79c0ff' } });
  const shinR = Bodies.rectangle(421, 418, 20, 72, { ...o, render: { fillStyle: '#79c0ff' } });
  const parts = [head, torso, uArmL, fArmL, uArmR, fArmR, thighL, shinL, thighR, shinR];
  const joints = [
    joint(head, 0, 24, torso, 0, -52),                       // neck
    joint(torso, -28, -38, uArmL, 0, -32),                   // shoulder L
    joint(torso, 28, -38, uArmR, 0, -32),                    // shoulder R
    joint(uArmL, 0, 32, fArmL, 0, -30, 0.7),                 // elbow L
    joint(uArmR, 0, 32, fArmR, 0, -30, 0.7),                 // elbow R
    joint(torso, -14, 52, thighL, 0, -39),                   // hip L
    joint(torso, 14, 52, thighR, 0, -39),                    // hip R
    joint(thighL, 0, 39, shinL, 0, -36, 0.7),                // knee L
    joint(thighR, 0, 39, shinR, 0, -36, 0.7)                 // knee R
  ];
  Composite.add(world, [...parts, ...joints]);
  return { home: { minX: 60, minY: 0, maxX: 740, maxY: 720 } };
}

function buildTower() {
  addFloor(680);
  const boxes = [];
  const size = 58, gap = 2;
  const rows = 6;
  for (let r = 0; r < rows; r++) {
    const n = rows - r;
    const y = 680 - 30 - size / 2 - r * (size + gap);
    for (let i = 0; i < n; i++) {
      const x = 400 + (i - (n - 1) / 2) * (size + gap);
      boxes.push(Bodies.rectangle(x, y, size, size, {
        ...baseOptions(),
        chamfer: { radius: 8 },
        render: { fillStyle: PALETTE[(r + i) % PALETTE.length] }
      }));
    }
  }
  // a wrecking ball hanging nearby for instant fun
  const anchor = Bodies.circle(120, 80, 8, { isStatic: true, render: { fillStyle: '#9aa7b8' } });
  const ball = Bodies.circle(200, 420, 34, {
    ...baseOptions(), density: 0.004, restitution: 0.3,
    render: { fillStyle: '#ffa657' }
  });
  const rope = Constraint.create({
    bodyA: anchor, bodyB: ball, stiffness: 0.9, length: 360,
    render: { strokeStyle: '#9aa7b8', lineWidth: 3 }
  });
  Composite.add(world, [...boxes, anchor, ball, rope]);
  return { home: { minX: 40, minY: 180, maxX: 760, maxY: 720 } };
}

function buildOrbit() {
  const sun = Bodies.circle(400, 400, 42, {
    isStatic: true, label: 'sun',
    render: { fillStyle: '#ffb340', strokeStyle: '#ff7b00', lineWidth: 3 }
  });
  Composite.add(world, sun);
  const defs = [
    { r: 150, size: 14, color: '#58a6ff' },
    { r: 220, size: 18, color: '#f778ba' },
    { r: 300, size: 12, color: '#3fb950' },
    { r: 390, size: 20, color: '#d2a8ff' }
  ];
  // circular-orbit speed: v = sqrt(278*C/r), C tuned for Matter's force scale
  const C = 20;
  defs.forEach((d, i) => {
    const a = (i / defs.length) * Math.PI * 2 + 0.4;
    const x = 400 + Math.cos(a) * d.r, y = 400 + Math.sin(a) * d.r;
    const v = Math.sqrt(278 * C / d.r);
    const p = Bodies.circle(x, y, d.size, {
      ...baseOptions(), frictionAir: 0, restitution: 0.9,
      render: { fillStyle: d.color }
    });
    Body.setVelocity(p, { x: -Math.sin(a) * v, y: Math.cos(a) * v });
    Composite.add(world, p);
  });
  return { home: { minX: -80, minY: -80, maxX: 880, maxY: 880 } };
}

/* orbit gravity: sun attracts everything, applied pre-update */
const ORBIT_C = 20;
Events.on(engine, 'beforeUpdate', () => {
  if (!currentScene || currentScene.id !== 'orbit' || !orbitAttraction) return;
  const bodies = Composite.allBodies(world);
  let sun = null;
  for (const b of bodies) if (b.label === 'sun') { sun = b; break; }
  if (!sun) return;
  for (const b of bodies) {
    if (b.isStatic || b === sun) continue;
    const dx = sun.position.x - b.position.x, dy = sun.position.y - b.position.y;
    const d = Math.max(70, Math.hypot(dx, dy));
    if (d > 2600) { Composite.remove(world, b); continue; } // lost to space
    const f = ORBIT_C * b.mass / (d * d);
    Body.applyForce(b, b.position, { x: f * dx / d, y: f * dy / d });
  }
});

const SCENES = [
  {
    id: 'ragdoll', name: 'Ragdoll Drop', short: 'Ragdoll', build: buildRagdoll,
    gravity: true,
    hint: '<b>tap</b> spawn ball · <b>2×tap</b> shockwave · <b>hold</b> grab + fling · <b>drag</b> pull limbs · <b>pinch</b> zoom · <b>swipe</b> next scene'
  },
  {
    id: 'tower', name: 'Jiggle Tower', short: 'Tower', build: buildTower,
    gravity: true,
    hint: '<b>tap</b> knock a block · <b>hold</b> grab a block, pull the tower down · <b>2×tap</b> shockwave · <b>pinch</b> zoom · <b>swipe</b> next scene'
  },
  {
    id: 'orbit', name: 'Zero-G Orbit', short: 'Orbit', build: buildOrbit,
    gravity: false,
    hint: '<b>drag</b> fling planets · <b>tap</b> add a comet · <b>2×tap</b> shockwave · <b>pinch</b> zoom out · <b>2-finger drag</b> pan camera'
  }
];

function setScene(i, silent) {
  sceneIndex = (i + SCENES.length) % SCENES.length;
  const s = SCENES[sceneIndex];
  Composite.clear(world, false, true);
  engine.gravity.x = 0;
  engine.gravity.y = s.gravity ? (gravityOn ? 1 : 0) : 0;
  if (s.id === 'orbit') orbitAttraction = true;
  const built = s.build();
  currentScene = { ...s, home: built.home };
  sceneNameEl.textContent = s.name;
  hintBar.innerHTML = s.hint;
  btnGravity.style.display = s.gravity ? '' : 'none';
  btnGravity.setAttribute('aria-pressed', String(gravityOn));
  btnGravity.textContent = 'Gravity: ' + (gravityOn ? 'on' : 'off');
  Array.from(sceneDots.children).forEach((d, di) => d.classList.toggle('is-active', di === sceneIndex));
  fitHome();
  if (!silent) toast(s.name);
}
function resetScene() {
  setScene(sceneIndex, true);
  toast('Reset');
}

/* scene dots */
SCENES.forEach((s, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'scene-dot';
  b.textContent = s.short;
  b.setAttribute('role', 'tab');
  b.addEventListener('click', () => setScene(i));
  sceneDots.appendChild(b);
});
document.getElementById('btnReset').addEventListener('click', resetScene);
btnGravity.addEventListener('click', () => {
  gravityOn = !gravityOn;
  engine.gravity.y = gravityOn ? 1 : 0;
  btnGravity.setAttribute('aria-pressed', String(gravityOn));
  btnGravity.textContent = 'Gravity: ' + (gravityOn ? 'on' : 'off');
  toast(gravityOn ? 'Gravity on' : 'Zero-G!');
});

/* ---------------- gestures ---------------- */
const mc = new Hammer(canvas);
mc.get('pinch').set({ enable: true });
mc.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL, velocity: 0.4 });
// two-finger pan = camera pan (separate recognizer; the default pan is 1-pointer)
mc.add(new Hammer.Pan({ event: 'pan2', pointers: 2, threshold: 8 }));
mc.get('pan2').recognizeWith(mc.get('pinch'));
mc.get('pinch').recognizeWith(mc.get('pan2'));
mc.get('pinch').recognizeWith(mc.get('pan'));
// NOTE: Hammer's built-in double-tap recognizer is not used — its
// multi-tap state machine is unreliable across builds, so double-tap is
// disambiguated manually in the tap handler below (320ms window).

let dragConstraint = null;
let grabbed = null;          // press-held body
let pressPoint = null;
let trail = [];              // pointer trail for fling velocity
let pinchStart = null;

function trackTrail(x, y) {
  const now = performance.now();
  trail.push({ x, y, t: now });
  while (trail.length > 2 && now - trail[0].t > 120) trail.shift();
}
function trailVelocity() {
  if (trail.length < 2) return { x: 0, y: 0 };
  const a = trail[0], b = trail[trail.length - 1];
  const dt = Math.max(16, b.t - a.t) / 1000;
  // screen px/s -> world units/tick (Matter velocity is per-tick-ish)
  const vx = (b.x - a.x) / dt / cam.scale / 60;
  const vy = (b.y - a.y) / dt / cam.scale / 60;
  const m = Math.hypot(vx, vy), cap = 28;
  if (m > cap) return { x: vx / m * cap, y: vy / m * cap };
  return { x: vx, y: vy };
}
function endDrag() {
  if (dragConstraint) { Composite.remove(world, dragConstraint); dragConstraint = null; }
}
function releaseGrab(fling) {
  if (!grabbed) return;
  const b = grabbed;
  grabbed = null;
  b.isStatic = false;
  Matter.Sleeping.set(b, false);
  if (fling) {
    const v = trailVelocity();
    Body.setVelocity(b, { x: b.velocity.x + v.x, y: b.velocity.y + v.y });
  }
  toast('Fling!');
}
function spawnBall(p) {
  const r = 13 + Math.random() * 10;
  const ball = Bodies.circle(p.x, p.y, r, {
    ...baseOptions(),
    restitution: 0.65,
    render: { fillStyle: PALETTE[Math.floor(Math.random() * PALETTE.length)] }
  });
  Composite.add(world, ball);
}
function shockwave(p) {
  const R = 260, POWER = 16;
  let hit = 0;
  for (const b of Composite.allBodies(world)) {
    if (b.isStatic) continue;
    const d = Vector.magnitude(Vector.sub(b.position, p));
    if (d < R) {
      const dir = d < 1 ? { x: 0, y: -1 } : Vector.normalise(Vector.sub(b.position, p));
      const k = POWER * (1 - d / R) + 3;
      Body.setVelocity(b, { x: b.velocity.x + dir.x * k, y: b.velocity.y + dir.y * k });
      hit++;
    }
  }
  toast(hit ? 'Shockwave!' : 'Boom (nothing in range)');
}

let lastTap = { t: 0, x: 0, y: 0 };
let tapTimer = 0;
const DOUBLE_TAP_MS = 320;

function singleTapAction(p) {
  const b = bodyAt(p);
  if (b) { toast('Selected'); Body.setVelocity(b, { x: b.velocity.x, y: b.velocity.y - 1 }); }
  else spawnBall(p);
}

mc.on('tap', ev => {
  const p = screenToWorld(ev.center.x, ev.center.y);
  const now = performance.now();
  const gap = Math.hypot(p.x - lastTap.x, p.y - lastTap.y);
  if (now - lastTap.t < DOUBLE_TAP_MS && gap < 50 / cam.scale) {
    // double-tap: cancel the pending single-tap, shockwave instead
    clearTimeout(tapTimer); tapTimer = 0; lastTap.t = 0;
    shockwave(p);
    return;
  }
  lastTap = { t: now, x: p.x, y: p.y };
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { tapTimer = 0; singleTapAction(p); }, DOUBLE_TAP_MS);
});

mc.on('press', ev => {
  const p = screenToWorld(ev.center.x, ev.center.y);
  const b = bodyAt(p);
  if (b) {
    endDrag();
    grabbed = b;
    pressPoint = p;
    b.isStatic = true;
    trail = [];
    toast('Held — drag, release to fling');
  }
});
// NOTE: Hammer has no 'pressup' event — release the press-grab on raw
// pointerup/pointercancel. `grabbed` is only set by press, so this is safe.
canvas.addEventListener('pointerup', () => { if (grabbed) releaseGrab(true); });
canvas.addEventListener('pointercancel', () => { if (grabbed) releaseGrab(false); });

mc.on('panstart', ev => {
  trail = [];
  trackTrail(ev.center.x, ev.center.y);
  if (grabbed) { pressPoint = screenToWorld(ev.center.x, ev.center.y); return; }
  const p = screenToWorld(ev.center.x, ev.center.y);
  const b = bodyAt(p);
  if (b) {
    endDrag();
    dragConstraint = Constraint.create({
      pointA: p, bodyB: b,
      pointB: { x: p.x - b.position.x, y: p.y - b.position.y },
      stiffness: 0.12, damping: 0.08, length: 0,
      render: { strokeStyle: '#58a6ff', lineWidth: 2 }
    });
    Composite.add(world, dragConstraint);
  }
});
mc.on('panmove', ev => {
  trackTrail(ev.center.x, ev.center.y);
  const p = screenToWorld(ev.center.x, ev.center.y);
  if (grabbed) {
    Body.setPosition(grabbed, p);
    pressPoint = p;
  } else if (dragConstraint) {
    dragConstraint.pointA.x = p.x;
    dragConstraint.pointA.y = p.y;
  }
});
mc.on('panend pancancel', () => {
  if (grabbed && !pressPoint) releaseGrab(false);
  endDrag();
});

/* two-finger camera pan (Hammer's deltaX/Y are from pan start: incremental) */
let pan2Last = null;
mc.on('pan2start', () => { pan2Last = null; });
mc.on('pan2move', ev => {
  if (!pan2Last) pan2Last = { x: ev.deltaX, y: ev.deltaY };
  cam.x -= (ev.deltaX - pan2Last.x) / cam.scale;
  cam.y -= (ev.deltaY - pan2Last.y) / cam.scale;
  pan2Last = { x: ev.deltaX, y: ev.deltaY };
  camTouched = true;
  applyCamera();
});
mc.on('pan2end pan2cancel', () => { pan2Last = null; });

mc.on('pinchstart', ev => {
  pinchStart = { scale: cam.scale };
});
mc.on('pinchmove', ev => {
  if (!pinchStart) return;
  // zoom around the CURRENT pinch midpoint, anchored to the world point
  // under it — computed from live cam so pinch composes with two-finger pan
  const r = canvas.getBoundingClientRect();
  const mx = ev.center.x, my = ev.center.y;
  const wx = cam.x + (mx - r.left - r.width / 2) / cam.scale;
  const wy = cam.y + (my - r.top - r.height / 2) / cam.scale;
  const home = currentScene.home;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  const minScale = Math.min(w / (home.maxX - home.minX), h / (home.maxY - home.minY)) * 0.5;
  cam.scale = Math.min(6, Math.max(minScale, pinchStart.scale * ev.scale));
  cam.x = wx - (mx - r.left - r.width / 2) / cam.scale;
  cam.y = wy - (my - r.top - r.height / 2) / cam.scale;
  camTouched = true;
  applyCamera();
});
mc.on('pinchend pinchcancel', () => { pinchStart = null; });

mc.on('swipeleft', () => setScene(sceneIndex + 1));
mc.on('swiperight', () => setScene(sceneIndex - 1));

/* ---------------- drills ---------------- */
const DRILLS = [
  { file: 'content/drills/01-pose-playground.md', desc: 'Pose chains, weight feel, first Blender play' },
  { file: 'content/drills/02-jiggle-bone-lab.md', desc: 'Spring physics on bones — tails, hair, chains' },
  { file: 'content/drills/03-cloth-softbody-rigidbody.md', desc: 'Cloth, soft bodies, rigid bodies' },
  { file: 'content/drills/04-ragdoll-lab.md', desc: 'Drop a character, watch it collapse, bring it back' },
  { file: 'content/drills/05-binding-lab.md', desc: 'Skin binding: envelope, auto weights, voxel heat' },
  { file: 'content/drills/06-rigging-lab.md', desc: 'Rigify, BlenRig, Mixamo auto-rigger pipeline' },
  { file: 'content/drills/07-softbody-deformation-lab.md', desc: 'Soft-body sim, corrective smooth, mesh deform' }
];
const drillList = document.getElementById('drillList');
const drillReader = document.getElementById('drillReader');
const drillBody = document.getElementById('drillBody');

function drillTitle(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}
async function loadDrills() {
  for (const d of DRILLS) {
    try {
      const res = await fetch(d.file);
      if (!res.ok) continue; // missing file: skip gracefully
      const md = await res.text();
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'drill-card';
      const t = document.createElement('span'); t.className = 't'; t.textContent = drillTitle(md, d.file);
      const ds = document.createElement('span'); ds.className = 'd'; ds.textContent = d.desc;
      card.append(t, ds);
      card.addEventListener('click', () => openDrill(md, t.textContent));
      drillList.appendChild(card);
    } catch (e) { /* skip gracefully */ }
  }
  if (!drillList.children.length) {
    const p = document.createElement('p');
    p.className = 'drill-error';
    p.textContent = 'No drills found.';
    drillList.appendChild(p);
  }
}
function openDrill(md, title) {
  drillBody.innerHTML = window.marked ? marked.parse(md) : '<p>Markdown renderer missing.</p>';
  drillList.style.display = 'none';
  drillReader.classList.remove('is-hidden');
  drillReader.scrollTop = 0;
}
document.getElementById('drillBack').addEventListener('click', () => {
  drillReader.classList.add('is-hidden');
  drillList.style.display = '';
});

/* ---------------- go ---------------- */
setScene(0, true);
loadDrills();
fitCanvas();
setTimeout(fitCanvas, 300); // settle after fonts/chrome

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* expose for automated verification */
window.__pp = {
  scenes: SCENES.map(s => s.id),
  bodyCount: () => Composite.allBodies(world).length,
  setScene, resetScene,
  hammer: mc,
  screenToWorld
};
})();
