const CACHE_NAME = "portfolio-v2-" + new Date().toISOString().slice(0,10);
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/logo.svg",
  "/favicon.png",
];

// Skip caching for hashed assets (Vite handles cache busting)
const shouldCache = (url) => {
  const path = new URL(url).pathname;
  // Don't cache JS/CSS with hashed filenames - Vite handles this
  if (path.match(/\.[a-f0-9]{8,}\.(js|css)$/)) return false;
  // Don't cache images in dist/assets
  if (path.startsWith("/assets/")) return false;
  return true;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  
  const url = event.request.url;
  
  // Don't cache hashed assets - let browser handle it
  if (!shouldCache(url)) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Update cache with fresh version
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
  );
});

// Listen for skip waiting messages
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
