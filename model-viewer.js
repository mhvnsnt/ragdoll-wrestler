/* Ragdoll Wrestler — 3D model viewer (Three.js r147 UMD).
 * Separate IIFE from the Matter demos. Hammer.js is NOT attached here;
 * OrbitControls (r147 UMD) owns touch: 1-finger rotate, 2-finger dolly+pan. */
(function () {
'use strict';

var toastEl = document.getElementById('modelToast');
var toastTimer = 0;
function mtoast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1600);
}

if (!window.THREE) { mtoast('3D engine failed to load.'); return; }

/* ---- path config -------------------------------------------------------
 * Staging (this dir): models live at examples/quaternius/
 * Repo (PWA at mobile/): change to '../examples/quaternius/'
 * ------------------------------------------------------------------------ */
var MODELS_BASE = 'examples/quaternius/';
var TERABOX_URL = 'https://www.terabox.com';
var TERABOX_FOLDER = '/blend-physics-playground/grey-area/wrestling-moves/';

var MODELS = (window.MODELS_DATA && window.MODELS_DATA.models) || [];
// Refresh from models.json when fetch works (http hosting); file:// falls back to embedded data.
try {
  fetch('content/models.json').then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (d && d.models && d.models.length) {
        MODELS = d.models;
        renderModelList();
      }
    }).catch(function () {});
} catch (e) {}

/* ---- three setup ---- */
var canvas = document.getElementById('viewer');
var wrap = document.getElementById('viewerWrap');
var renderer, scene, camera, controls, mixer = null, clock = null;
var currentGroup = null, currentEntry = null, playing = true, actions = [];

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e14);
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 1.6, 4.5);
  controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 1, 0);
  // r147 UMD OrbitControls touch defaults: ONE finger = ROTATE, TWO = DOLLY_PAN.
  scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x1a2030, 0.9));
  var key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 6, 4);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x58a6ff, 0.5);
  rim.position.set(-4, 3, -3);
  scene.add(rim);
  var grid = new THREE.GridHelper(12, 24, 0x2a3342, 0x1a2230);
  scene.add(grid);
  clock = new THREE.Clock();
  fitViewer();
  animate();
}
function fitViewer() {
  if (!renderer) return;
  var w = wrap.clientWidth, h = wrap.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
function animate() {
  requestAnimationFrame(animate);
  var dt = clock ? Math.min(clock.getDelta(), 0.05) : 0;
  if (mixer && playing) mixer.update(dt);
  if (controls) controls.update();
  if (renderer) renderer.render(scene, camera);
}
if ('ResizeObserver' in window) new ResizeObserver(fitViewer).observe(wrap);
window.addEventListener('resize', fitViewer);
window.addEventListener('orientationchange', function () { setTimeout(fitViewer, 250); });

/* ---- model list ---- */
var listEl = document.getElementById('modelList');
var clipSel = document.getElementById('clipSelect');
var btnPlay = document.getElementById('btnModelPlay');
var loadEl = document.getElementById('modelLoading');
var loadBar = document.getElementById('modelLoadBar');
var loadPct = document.getElementById('modelLoadPct');
var teraboxCard = document.getElementById('teraboxCard');
var tbName = document.getElementById('teraboxName');
var tbNotes = document.getElementById('teraboxNotes');
var viewerHead = document.getElementById('viewerName');

function renderModelList() {
  if (!listEl) return;
  listEl.innerHTML = '';
  MODELS.forEach(function (m, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'model-chip' + (m.source === 'terabox' ? ' is-remote' : '');
    b.innerHTML = '<span class="mc-name"></span>' +
      (m.source === 'terabox' ? '<span class="mc-badge">TeraBox</span>' : '<span class="mc-badge is-local">3D</span>');
    b.querySelector('.mc-name').textContent = m.name;
    b.setAttribute('aria-label', m.name + (m.source === 'terabox' ? ' (in TeraBox)' : ' (3D model)'));
    b.addEventListener('click', function () { selectModel(i); });
    listEl.appendChild(b);
  });
}

function clearScene() {
  if (currentGroup) { scene.remove(currentGroup); currentGroup = null; }
  mixer = null; actions = [];
  clipSel.innerHTML = '';
  clipSel.disabled = true;
}

function frameObject(obj) {
  var box = new THREE.Box3().setFromObject(obj);
  var size = box.getSize(new THREE.Vector3());
  var center = box.getCenter(new THREE.Vector3());
  var maxDim = Math.max(size.x, size.y, size.z) || 1;
  var dist = maxDim * 2.2;
  camera.position.set(center.x + dist * 0.55, center.y + dist * 0.35, center.z + dist);
  controls.target.copy(center);
  controls.update();
}

function playClip(idx) {
  if (!mixer || !actions.length) return;
  actions.forEach(function (a) { a.stop(); });
  var a = actions[idx] || actions[0];
  if (a) { a.reset().play(); }
  clipSel.selectedIndex = actions.indexOf(a);
}

function onModelLoaded(obj, entry) {
  clearScene();
  currentGroup = obj;
  currentEntry = entry;
  var meshes = 0, bones = 0;
  obj.traverse(function (o) { if (o.isMesh) { meshes++; o.castShadow = false; } if (o.isBone) bones++; });
  scene.add(obj);
  frameObject(obj);
  var clips = obj.animations || [];
  if (clips.length && window.THREE.AnimationMixer) {
    mixer = new THREE.AnimationMixer(obj);
    actions = clips.map(function (c) { return mixer.clipAction(c); });
    clips.forEach(function (c, i) {
      var opt = document.createElement('option');
      opt.value = i; opt.textContent = c.name.replace(/^.*\|/, '');
      clipSel.appendChild(opt);
    });
    clipSel.disabled = false;
    var idleIdx = clips.findIndex(function (c) { return /idle/i.test(c.name); });
    playClip(idleIdx >= 0 ? idleIdx : 0);
  }
  playing = true;
  btnPlay.textContent = 'Pause';
  btnPlay.setAttribute('aria-pressed', 'true');
  if (viewerHead) viewerHead.textContent = entry.name + ' — ' + meshes + ' meshes, ' + clips.length + ' clips';
  loadEl.classList.add('is-hidden');
  mtoast(entry.name + ' loaded');
}

function selectModel(i) {
  var entry = MODELS[i];
  if (!entry) return;
  Array.prototype.forEach.call(listEl.children, function (c, j) {
    c.classList.toggle('is-active', j === i);
  });
  if (entry.source === 'terabox') {
    clearScene();
    if (viewerHead) viewerHead.textContent = entry.name;
    tbName.textContent = entry.name + '.' + entry.kind;
    tbNotes.textContent = entry.notes + ' Folder: ' + TERABOX_FOLDER;
    teraboxCard.classList.remove('is-hidden');
    loadEl.classList.add('is-hidden');
    return;
  }
  teraboxCard.classList.add('is-hidden');
  loadEl.classList.remove('is-hidden');
  loadBar.style.width = '0%'; loadPct.textContent = '0%';
  if (viewerHead) viewerHead.textContent = 'Loading ' + entry.name + '…';
  var loader = new THREE.FBXLoader();
  loader.load(MODELS_BASE + entry.file,
    function (obj) { onModelLoaded(obj, entry); },
    function (xhr) {
      if (xhr.total) {
        var p = Math.round(xhr.loaded / xhr.total * 100);
        loadBar.style.width = p + '%'; loadPct.textContent = p + '%';
      }
    },
    function (err) {
      loadEl.classList.add('is-hidden');
      mtoast('Could not load ' + entry.name);
      if (viewerHead) viewerHead.textContent = 'Load failed';
    });
}

btnPlay.addEventListener('click', function () {
  if (!mixer) return;
  playing = !playing;
  btnPlay.textContent = playing ? 'Pause' : 'Play';
  btnPlay.setAttribute('aria-pressed', String(playing));
});
clipSel.addEventListener('change', function () { playClip(parseInt(clipSel.value, 10) || 0); });
document.getElementById('btnTerabox').addEventListener('click', function () {
  window.open(TERABOX_URL, '_blank', 'noopener');
});

/* headless test hook: parse an ArrayBuffer, report counts */
window.__viewerTest = {
  parseBuffer: function (buffer, name) {
    try {
      var loader = new THREE.FBXLoader();
      var obj = loader.parse(buffer, '');
      var meshes = 0, bones = 0;
      obj.traverse(function (o) { if (o.isMesh) meshes++; if (o.isBone) bones++; });
      var clips = (obj.animations || []).map(function (c) { return c.name; });
      return { ok: true, meshes: meshes, bones: bones, clips: clips };
    } catch (e) {
      return { ok: false, error: String((e && e.message) || e) };
    }
  },
  showBuffer: function (buffer, name) {
    try {
      var loader = new THREE.FBXLoader();
      var obj = loader.parse(buffer, '');
      onModelLoaded(obj, { name: name, kind: 'fbx', source: 'local', file: name });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String((e && e.message) || e) };
    }
  },
  modelCount: function () { return MODELS.length; }
};

initThree();
renderModelList();
if (MODELS.length) selectModel(0);
window.__viewerFit = fitViewer;
})();
