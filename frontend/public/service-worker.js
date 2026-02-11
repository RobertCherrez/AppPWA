// Ultimate service worker for true offline functionality
const CACHE_NAME = 'ecommerce-pwa-ultimate';

// Cache everything needed for offline
const OFFLINE_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css'
];

// Install event - cache everything
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching for offline');
        return cache.addAll(OFFLINE_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Fetch event - serve from cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Always try cache first
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }
        
        // If not in cache, try network
        return fetch(event.request)
          .then(response => {
            // Cache successful responses
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
            // Network failed, serve index.html for navigation
            if (event.request.mode === 'navigate') {
              console.log('Navigation failed, serving index.html from cache');
              return caches.match('/index.html');
            }
            
            // For other requests, try cache one more time
            console.log('Request failed, trying cache:', event.request.url);
            return caches.match(event.request);
          });
      })
  );
});

// Activate event - clean old caches
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
