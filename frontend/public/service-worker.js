// Simple service worker - cache for offline, don't interfere online
const CACHE_NAME = 'ecommerce-pwa-complete';

// Cache everything needed for offline (sin imágenes)
const OFFLINE_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/css/main.358c1081.css',
  '/static/js/main.56eac9c0.js',
  '/static/js/453.20359781.chunk.js',
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

// Fetch event - only cache when offline
self.addEventListener('fetch', event => {
  // Handle POST requests (checkout)
  if (event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          console.log('POST request successful:', event.request.url);
          return response;
        })
        .catch(() => {
          console.log('POST request failed offline:', event.request.url);
          // Return a mock success response for offline checkout
          const offlineResponse = {
            success: false,
            message: 'Pedido guardado localmente. Se sincronizará cuando haya conexión.',
            offline: true
          };
          
          return new Response(JSON.stringify(offlineResponse), {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
          });
        })
    );
    return;
  }
  
  // For GET requests, only use cache when offline
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If online, return response and cache it
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
        // If offline, try cache
        console.log('Offline, serving from cache:', event.request.url);
        return caches.match(event.request);
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
