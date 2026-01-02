const CACHE_NAME = 'omega-suite-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './png%20fichier.html',
  './pixelart.html',
  './64.html',
  './dossier.html',
  './trieur.html',
  './icon-dark.png',
  './manifest-dark.json'
];

// Install Event - Cache Files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Omega Service Worker: Caching files');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Omega Service Worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetch Event - Serve from Cache, fall back to Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
          // If offline and request fails, we can show a fallback page if we had one.
          // For now, we rely on cache.
      });
    })
  );
});
