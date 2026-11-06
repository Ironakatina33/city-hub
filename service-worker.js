const CACHE_NAME = 'city-hub-v1.0.0';
const APP_SHELL = [
  './', './index.html', './styles.css', './apps.js', './app.js',
  './manifest.webmanifest', './icons/favicon.svg',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('city-hub-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Les applications extérieures ne sont jamais mises en cache ni interceptées.
  if (url.origin !== self.location.origin) return;
  // En ligne, toujours privilégier la dernière version publiée, y compris apps.js.
  // Hors ligne, afficher l'interface sauvegardée.
  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request).then(cached => {
    if (cached) return cached;
    if (request.mode === 'navigate') return caches.match('./index.html');
    return Response.error();
  })));

});
