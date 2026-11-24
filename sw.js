const V="beme-v106";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(["./","index.html","assets/beme-logo-white.svg","assets/img/bongard-logo.png","assets/img/riyadh-night.webp","assets/login.js","assets/login-b.js","assets/login-b.css","assets/login-c.js","assets/login-c.css","assets/login-d.js","assets/login-d.css","assets/beme-orn.svg","assets/beme-word-white.svg","assets/img/hero-oven.jpg"]).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))))});
