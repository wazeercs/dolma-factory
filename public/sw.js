// SW بسيط جداً — لا يتدخل في أي fetch
// فقط يتيح التثبيت كـ PWA

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// NO fetch handler — المتصفح يعمل بشكل طبيعي بدون تدخل
