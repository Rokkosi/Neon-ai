// Neon AI service worker: network first, falls back to the saved copy. Only touches files from this site.
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open('neonai-v1').then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
