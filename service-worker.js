const CACHE_NAME = 'stealth-search-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/search-engine.html',
  '/blank-disguise.js',
  '/proxy-search.js',
  '/styles.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
