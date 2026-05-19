// 九界修真百科系统 - Service Worker
const CACHE_NAME = 'nine-realm-wiki-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/app.js',
    '/manifest.json',
    'https://cdn.tailwindcss.com'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
    console.log('[SW] 安装中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] 缓存资源');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('[SW] 激活中...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// 请求拦截 - 缓存优先策略
self.addEventListener('fetch', (event) => {
    // 只处理同源请求
    if (!event.request.url.startsWith(self.location.origin) && 
        !event.request.url.startsWith('https://cdn.tailwindcss.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request)
                    .then((response) => {
                        // 不缓存非成功响应
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // 缓存新资源
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});

// 后台同步更新缓存
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-content') {
        console.log('[SW] 后台同步内容...');
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    keys.forEach(async (request) => {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response);
        }
    });
}