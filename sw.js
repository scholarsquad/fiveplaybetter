/**
 * Service Worker — injects Cross-Origin Isolation headers on this page
 * so window.crossOriginIsolated === true (needed for SharedArrayBuffer).
 */
const COI = {
  "Cross-Origin-Opener-Policy":   "same-origin",
  "Cross-Origin-Embedder-Policy": "credentialless",
};

self.addEventListener("install",  () => self.skipWaiting());
self.addEventListener("activate", e  => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Only intercept same-origin navigations (HTML pages on this GitHub Pages site)
  if (e.request.mode === "navigate" && url.origin === self.location.origin) {
    e.respondWith(injectHeaders(e.request));
  }
});

async function injectHeaders(req) {
  try {
    const res  = await fetch(req);
    const hdrs = new Headers(res.headers);
    for (const [k, v] of Object.entries(COI)) hdrs.set(k, v);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: hdrs });
  } catch {
    return Response.error();
  }
}
