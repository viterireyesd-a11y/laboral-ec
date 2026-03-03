// ACTUALIZACION DE CACHE V2
self.addEventListener('install', (e) => {
  console.log('LaboralEc App Instalada');
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});
