const cacheName = 'stfu-1';

const urlsToCache = [
  '/',
  'https://opencache.statkart.no/gatekeeper/gk/',
];

self.addEventListener('install', event =>
  event.waitUntil(
    caches.open(cacheName).then(cache =>
      cache.addAll(urlsToCache)
    )
  )
);

self.addEventListener('fetch', event =>
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
            const responseToCache = response.clone();
            caches.open(cacheName).then(cache =>
              cache.put(event.request, responseToCache)
            );

            return response;
          }
        );
      })
  )
);