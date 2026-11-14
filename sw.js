// Simple cache-first service worker for offline use (after first online visit).
const CACHE = "leaf-app-v1";
const PRECACHE = ["./", "./index.html", "./my-model/model.json", "./my-model/metadata.json", "./my-model/weights.bin"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));   // also caches CDN libraries
    return res;
  })));
});
