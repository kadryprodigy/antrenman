// Uygulamayı çevrimdışı çalıştırır. Önce önbellekten açar, arka planda yeni sürümü indirir
// (güncellemeler bir sonraki açılışta görünür). Dosyaları değiştirince C'deki sürümü artır.
const C='antrenman-v48';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).hostname.endsWith('.workers.dev'))return;
e.respondWith(caches.open(C).then(async c=>{const hit=await c.match(e.request,{ignoreSearch:true});
const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>hit);
if(hit){e.waitUntil(net.catch(()=>{}));return hit}return net}))});
// Bildirim sunucusundan gelen (dinlenme bitti) bildirimi gösterir; dokununca açık uygulamaya geçer ya da açar.
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){}
e.waitUntil(self.registration.showNotification(d.title||'Antrenman',{body:d.body||'',tag:d.tag||'antrenman',renotify:true,icon:'icon-192.png'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();
e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs)if('focus' in c)return c.focus();return self.clients.openWindow('./')}))});
