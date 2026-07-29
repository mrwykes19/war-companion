const CACHE_NAME = 'warhammer-companion-v1.1.0';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/rules.js',
  './js/app.js',
  './assets/brand-logo.webp',
  './assets/backgrounds/battle-bg.webp',
  './assets/backgrounds/rules-bg.webp',
  './assets/backgrounds/score-bg.webp',
  './assets/backgrounds/complete-bg.webp',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon-64.png',
  './assets/icons/phase-command.png',
  './assets/icons/phase-move.png',
  './assets/icons/phase-shoot.png',
  './assets/icons/phase-charge.png',
  './assets/icons/phase-fight.png',
  './assets/icons/vp.png',
  './assets/icons/cp.png',
  './assets/icons/round.png',
  './assets/icons/timer.png',
  './assets/icons/objective.png',
  './assets/icons/search.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (!response || response.status !== 200 || response.type === 'opaque') return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
