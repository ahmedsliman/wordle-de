/* Wörtle service worker — network-first for HTML/JSON (so deploys always show up),
   cache-first for static assets (icons). */
const CACHE = 'wortle-v8';

const PRECACHE = [
  './',
  './index.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './words/a1.json',
  './words/a2.json',
  './words/b1.json',
  './words/b2.json',
  './words/business.json',
  './words/medical.json',
  './words/software.json',
  './words/engineering.json',
  './words/legal.json',
  './words/komposita.json',
  './nicos-sentences.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// HTML and JSON change often (app code, word/sentence data) — always try the network
// first so updates show up immediately; fall back to cache when offline.
const NETWORK_FIRST = /\.(html|json)$/;

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Only cache same-origin requests; skip Firebase/CDN/fonts (handled by browser cache)
  if (url.origin !== self.location.origin) return;

  const networkFirst = e.request.mode === 'navigate' ||
    NETWORK_FIRST.test(url.pathname) ||
    url.pathname.endsWith('/');

  if (networkFirst) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
