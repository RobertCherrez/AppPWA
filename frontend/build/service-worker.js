// Service Worker con cache-first strategy completa
const CACHE_NAME = 'ecommerce-pwa-v1';

// Cache todo lo necesario para offline
const OFFLINE_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/css/main.358c1081.css',
  '/static/js/main.28b48d5d.js',
  '/static/js/453.20359781.chunk.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css'
];

// Install - cache todo inmediatamente
self.addEventListener('install', event => {
  console.log('SW: Installing and caching all files...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Adding all files to cache');
        return cache.addAll(OFFLINE_CACHE);
      })
      .then(() => {
        console.log('SW: All files cached, skipping waiting');
        return self.skipWaiting();
      })
  );
});

// Activate - limpiar caches viejos y tomar control
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Taking control of all pages');
      return self.clients.claim();
    })
  );
});

// Fetch - cache-first strategy
self.addEventListener('fetch', event => {
  console.log('SW: Fetching:', event.request.url);
  
  // Solo manejar requests GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, retornarlo
        if (response) {
          console.log('SW: Serving from cache:', event.request.url);
          return response;
        }
        
        // Si no está en cache, intentar red
        console.log('SW: Not in cache, fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Si la respuesta es buena, cachearla
            if (response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  console.log('SW: Caching new resource:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(() => {
            // Si falla la red, servir página offline
            console.log('SW: Network failed, serving offline page');
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            return new Response('Offline - No connection', { status: 503 });
          });
      })
  );
});
