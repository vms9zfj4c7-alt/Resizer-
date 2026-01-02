const CACHE_NAME = 'omega-suite-v2'; // Bump version to force update
const ASSETS = [
  './',
  './index.html',
  './png%20fichier.html',
  './pixelart.html',
  './64.html',
  './dossier.html',
  './trieur.html',
  './icon-dark.png',
  './icon-light.png',
  './manifest-dark.json',
  './manifest-light.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Omega SW: Caching all assets');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Omega SW: Cleaning old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim(); // Take control of all pages immediately
});

self.addEventListener('fetch', (event) => {
  // Navigation requests: Network first, fall back to cache (ensure fresh index)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Asset requests: Cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
