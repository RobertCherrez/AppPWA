// Smart service worker for online/offline functionality
const CACHE_NAME = 'ecommerce-pwa-smart';

// Essential resources to cache
const ESSENTIAL_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching essential resources');
        return cache.addAll(ESSENTIAL_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we have a cached response, use it
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise, try network
        return fetch(event.request)
          .then(response => {
            // Cache successful responses for offline use
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  console.log('Caching for offline:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(() => {
            // If network fails, try cache as fallback
            console.log('Network failed, trying cache fallback:', event.request.url);
            return caches.match(event.request);
          });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});
