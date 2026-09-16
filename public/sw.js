const CACHE = "forma-v0.1.0-assets-2";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/brand-logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/favicon.png",
];
self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))),
);
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  ),
);
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return r;
      })
      .catch(() =>
        caches.match(e.request).then((r) => r || caches.match("/index.html")),
      ),
  );
});
