const CACHE_NAME = 'ubereats-simulator-v83';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './アイコン.jpg'
];

// インストール時
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// フェッチ時
self.addEventListener('fetch', event => {
  // 外部APIリクエスト（バックエンド、Supabaseなど）はService Workerを通さない
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあればそれを返す、なければネットワークから取得
        return response || fetch(event.request);
      })
      .catch(error => {
        // ネットワークエラー時はエラーを静かに処理
        console.warn('SW fetch error:', error);
        return new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// アクティベーション時（古いキャッシュの削除）
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
