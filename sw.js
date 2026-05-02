const CACHE='pokertime-v2';
const ASSETS=[
  '/pokertime-1.2/',
  '/pokertime-1.2/index.html',
  '/pokertime-1.2/manifest.json',
  '/pokertime-1.2/icon-192.png',
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const fetchPromise=fetch(e.request).then(resp=>{
        if(resp.ok){
          const clone=resp.clone();
          caches.open(CACHE).then(cache=>cache.put(e.request,clone));
        }
        return resp;
      }).catch(()=>cached);
      return cached||fetchPromise;
    })
  );
});
