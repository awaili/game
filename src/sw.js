/* Service Worker for Slowpapa Games - PWA support */
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `slowpapa-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `slowpapa-dynamic-${CACHE_VERSION}`;

// 静态资源列表
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/site.css',
  '/assets/app.js',
  '/assets/game.css',
  '/assets/game.js',
];

// 安装 SW
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 激活 SW，清理旧缓存
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key.startsWith('slowpapa-') && key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) return;

  // 静态资源：缓存优先
  if (request.url.includes('/assets/') || request.url.includes('/games/')) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) return response;
        return fetch(request).then(fetchResponse => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // 离线时返回占位
        if (request.destination === 'document') {
          return caches.match('/');
        }
      })
    );
  } else {
    // 其他请求：网络优先
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});
