// Ultimate service worker with POST support for checkout
const CACHE_NAME = 'ecommerce-pwa-complete';

// Cache everything needed for offline
const OFFLINE_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css',
  // Cache all local images from backend
  'https://apppwa-1.onrender.com/images/laptop-pro.jpg',
  'https://apppwa-1.onrender.com/images/mouse-inalambrico.jpg',
  'https://apppwa-1.onrender.com/images/teclado-mecanico.jpg',
  'https://apppwa-1.onrender.com/images/monitor-4k.jpg',
  'https://apppwa-1.onrender.com/images/hub-usb-c.jpg',
  'https://apppwa-1.onrender.com/images/webcam-hd.jpg',
  'https://apppwa-1.onrender.com/images/lampara-escritorio.jpg',
  'https://apppwa-1.onrender.com/images/soporte-telefono.jpg'
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

// Fetch event - handle both GET and POST
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
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
  
  // Handle GET requests
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
