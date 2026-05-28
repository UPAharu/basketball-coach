const CACHE_NAME = 'ai-coach-v7-cache'; // 最新のindex.htmlを反映するためにv7に！

// オフラインにするために先回りしてスマホに保存するファイルのリスト
const ASSETS = [
  './index.html',
  'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
  // AIの脳みそにあたる重要なデータ群も指定
  'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose_solution_packed_assets_loader.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose_solution_simd_wasm_bin.js'
];

// 1. インストール時にすべてキャッシュに保存
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. 【超重要】新しいバージョンが起動したとき、古いキャッシュを自動で削除する
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // 今のキャッシュ名（v7）以外の古い箱を見つけたら削除する
          if (key !== CACHE_NAME) {
            console.log('古いキャッシュを削除しました:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. オフライン時はネットではなく保存したデータから返す
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
