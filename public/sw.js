// ====================================================================
// MAI HRIS - Service Worker (PWA)
// PT. Mitra Akses Insani
// ====================================================================

// Force immediate takeover and cleanup
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Do not intercept any requests during local development
self.addEventListener('fetch', () => {
  // Let browser handle network directly
  return;
});
