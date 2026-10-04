const CACHE='handy-remote-pro-v5';
const ASSETS=['./','./index.html','./app-v4.html','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method==='PUT'&&u.pathname.endsWith('/hsp/add')){
    e.respondWith((async()=>{
      try{
        const body=await e.request.clone().json();
        if(Array.isArray(body?.points)) body.points=body.points.map(p=>({...p,t:Math.max(0,Math.round(Number(p.t)||0)),x:Math.max(0,Math.min(100,Math.round(Number(p.x)||0)))}));
        const req=new Request(e.request,{body:JSON.stringify(body)});
        return fetch(req);
      }catch(err){return fetch(e.request)}
    })());
    return;
  }
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});