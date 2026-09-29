// Service Worker - Cache disabled for development
self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Only handle same-origin requests (the app's own files). Cross-origin API
  // calls (CoinGecko, Binance, Finnhub, Supabase...) are left alone so the
  // browser handles them directly — routing them through the service worker
  // added a second, redundant fetch attempt (and a second console error) on
  // top of every failed price request, which was part of what made things
  // feel slow when a price source was blocked.
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request));
});
