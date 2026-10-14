/* Physics Playground service worker — offline app shell */
const CACHE = 'physics-playground-v2';
const ASSETS = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'model-viewer.js',
  'manifest.json',
  'vendor/matter-js/matter.min.js',
  'vendor/hammerjs/hammer.min.js',
  'vendor/marked/marked.min.js',
  'vendor/three/three.min.js',
  'vendor/three/fflate.min.js',
  'vendor/three/FBXLoader.js',
  'vendor/three/OrbitControls.js',
  'vendor/SOURCES.md',
  'content/models-data.js',
  'content/models.json',
  'content/drills/01-pose-playground.md',
  'content/drills/02-jiggle-bone-lab.md',
  'content/drills/03-cloth-softbody-rigidbody.md',
  'content/drills/04-ragdoll-lab.md',
  'content/drills/05-binding-lab.md',
  'content/drills/06-rigging-lab.md',
  'content/drills/07-softbody-deformation-lab.md',
  'icons/icon-192.svg',
  'icons/icon-512.svg',
  'icons/apple-touch-icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request))
  );
});
