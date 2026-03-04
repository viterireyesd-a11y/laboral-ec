// --- PROTOCOLO DE AUTODESTRUCCIÓN DEL SERVICE WORKER ---
// Este código obliga a los celulares a borrar la caché vieja y eliminar este archivo.

self.addEventListener('install', function(e) {
  self.skipWaiting(); // Fuerza la activación inmediata de este limpiador
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Borrando caché corrupta:', cacheName);
          return caches.delete(cacheName); // Aniquila la memoria secuestrada
        })
      );
    }).then(function() {
      console.log('Service Worker desinstalado con éxito.');
      return self.registration.unregister(); // Se autodestruye
    })
  );
});

// Intercepta las peticiones y las deja pasar directo a internet sin bloquearlas
self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request));
});
