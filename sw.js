const cacheName = 'stfu_2';

const urlsToCache = [
  '/',
  'https://opencache.statkart.no/gatekeeper/gk/',
];

function responseIsOk(response) {
  return response.ok && response.status >= 200 && response.status <= 299;
}

self.addEventListener('install', event =>
  event.waitUntil(
    caches.open(cacheName).then(cache =>
      cache.addAll(urlsToCache)
    )
  )
);

function fetchAndCache(request) {
  return fetch(request).then(response => {
      const responseToCache = response.clone();
      if (request.method === 'GET' && responseIsOk(response)) {
        caches.open(cacheName).then(cache =>
          cache.put(request, responseToCache)
        );
      }
      return response;
    }
  );
}

function mapTilesFromCacheRestFromOnlineOrCacheIfOffline(request) {
  if (request.url.match(/gatekeeper/i)) {
    return caches.match(request).then(response => {
      if (response && responseIsOk(response)) {
        return response;
      }
      return fetchAndCache(request);
    });
  }

  return fetchAndCache(request).catch(() => caches.match(request));
}

self.addEventListener('fetch', event =>
  event.respondWith(
    mapTilesFromCacheRestFromOnlineOrCacheIfOffline(event.request)
  )
);