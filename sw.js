// sw.js -- Service worker for Robotics Lab Photo Booth PWA
// Enables Chrome to treat the page as installable.
// Cache-first strategy: serves from cache when offline.

const CACHE_NAME = 'photo-booth-v1';
const PRECACHE = [
  '/CTE/photo-booth.html',
  '/CTE/manifest.json',
  '/CTE/icons/icon-192.svg',
  '/CTE/icons/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Remove old caches from previous versions
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
