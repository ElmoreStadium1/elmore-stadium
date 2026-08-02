// Service Worker سایت Elmore Stadium
// نسخه رو هر بار که تغییر بزرگی توی سایت میدی عوض کن تا کش قدیمی کاربرها پاک بشه
const CACHE_VERSION = 'elmore-v1';
const STATIC_CACHE = CACHE_VERSION + '-static';

const PRECACHE_ASSETS = [
  '/manifest.json',
  '/assets/images/logo.jpg',
  '/assets/images/icons/icon-192.png',
  '/assets/images/icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.addAll(PRECACHE_ASSETS).catch(function () { /* اگر یکی نبود کل نصب خراب نشه */ });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key.indexOf(CACHE_VERSION) !== 0; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // درخواست‌های Supabase و بقیه‌ی سرویس‌های خارجی دست‌نخورده باقی بمونن

  const isImage = req.destination === 'image';

  if (isImage) {
    // تصاویر: اول کش، بعد شبکه (چون کمتر عوض می‌شن و سرعت مهم‌تره)
    event.respondWith(
      caches.match(req).then(function (cached) {
        if (cached) return cached;
        return fetch(req).then(function (res) {
          const resClone = res.clone();
          caches.open(STATIC_CACHE).then(function (cache) { cache.put(req, resClone); });
          return res;
        }).catch(function () { return cached; });
      })
    );
    return;
  }

  // صفحات HTML و فایل‌های CSS/JS: اول شبکه، اگه آفلاین بودی از کش (چون سایت مدام آپدیت می‌شه و نباید نسخه‌ی قدیمی گیر بمونه)
  event.respondWith(
    fetch(req).then(function (res) {
      const resClone = res.clone();
      caches.open(STATIC_CACHE).then(function (cache) { cache.put(req, resClone); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (cached) { return cached || caches.match('/public/index.html'); });
    })
  );
});
