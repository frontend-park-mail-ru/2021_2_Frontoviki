import 'regenerator-runtime/runtime';
const {assets} = global.serviceWorkerOption;
const CACHE_NAME = 'volchockApp';

const cacheUrls = [
  ...assets,
];

self.addEventListener('install', (event) => {
  // задержим обработку события',
  // если произойдёт ошибка, serviceWorker не установится'
  event.waitUntil(
      // находим в глобальном хранилище Cache-объект с нашим именем'
      // если такого не существует, то он будет создан'
      caches.open(CACHE_NAME)
          .then((cache) => {
            // загружаем в наш cache необходимые файлы'
            return cache.addAll(cacheUrls);
          })
          .catch((err) => {
            console.error('smth went wrong with caches.open: ', err);
          }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    if (navigator.onLine === true) {
      const response = await fetch(event.request);
      if (event.request.method !== 'GET') {
        return response;
      }
      const responseClone = response.clone();
      caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
      return response;
    }
    const response = await caches.match(event.request);
    return response || new Response(null, {status: 500});
  })());
});
