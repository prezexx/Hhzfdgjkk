const CACHE='handy-remote-pro-v7';
const ASSETS=['./','./index.html','./app-v4.html','./manifest.webmanifest','./patterns/magichandy/catalog.json'];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function pchipSlopes(t,x){
  const n=t.length,m=new Array(n).fill(0),h=[],d=[];
  for(let i=0;i<n-1;i++){h[i]=t[i+1]-t[i];d[i]=(x[i+1]-x[i])/h[i]}
  if(n===2){m[0]=m[1]=d[0];return m}
  const endpoint=(h0,h1,d0,d1)=>{let v=((2*h0+h1)*d0-h0*d1)/(h0+h1);if(Math.sign(v)!==Math.sign(d0))v=0;else if(Math.sign(d0)!==Math.sign(d1)&&Math.abs(v)>Math.abs(3*d0))v=3*d0;return v};
  m[0]=endpoint(h[0],h[1],d[0],d[1]);m[n-1]=endpoint(h[n-2],h[n-3],d[n-2],d[n-3]);
  for(let i=1;i<n-1;i++){if(d[i-1]===0||d[i]===0||d[i-1]*d[i]<=0){m[i]=0;continue}const w1=2*h[i]+h[i-1],w2=h[i]+2*h[i-1];m[i]=(w1+w2)/(w1/d[i-1]+w2/d[i])}
  return m;
}
function pchipEval(q,t,x,m){let i=0;while(i<t.length-2&&q>t[i+1])i++;const h=t[i+1]-t[i],s=clamp((q-t[i])/h,0,1),s2=s*s,s3=s2*s;return(2*s3-3*s2+1)*x[i]+(s3-2*s2+s)*h*m[i]+(-2*s3+3*s2)*x[i+1]+(s3-s2)*h*m[i+1]}
function smoothHspPoints(points){let src=(Array.isArray(points)?points:[]).map(p=>({t:Math.max(0,Math.round(Number(p.t)||0)),x:clamp(Number(p.x)||0,0,100)})).sort((a,b)=>a.t-b.t);src=src.filter((p,i)=>i===0||p.t>src[i-1].t);if(src.length<2)return src.map(p=>({t:p.t,x:Math.round(p.x)}));src[src.length-1].x=src[0].x;const t=src.map(p=>p.t),x=src.map(p=>p.x),duration=t[t.length-1]-t[0];if(duration<=0)return src.map(p=>({t:p.t,x:Math.round(p.x)}));const m=pchipSlopes(t,x),step=Math.max(25,Math.ceil((duration/99)/5)*5),raw=[];for(let q=t[0];q<t[t.length-1];q+=step)raw.push({t:Math.round(q),x:Math.round(clamp(pchipEval(q,t,x,m),0,100))});raw.push({t:t[t.length-1],x:Math.round(src[0].x)});const out=[];for(let i=0;i<raw.length;i++){const p=raw[i],prev=raw[i-1],next=raw[i+1];if(i>0&&i<raw.length-1&&prev.x===p.x&&next.x===p.x)continue;out.push(p)}return out.slice(0,100)}

self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method==='PUT'&&u.pathname.endsWith('/hsp/add')){
    e.respondWith((async()=>{try{const body=await e.request.clone().json();if(Array.isArray(body?.points)){body.points=smoothHspPoints(body.points);body.tail_point_stream_index=body.points.length;body.tail_point_threshold=Math.max(1,body.points.length-2)}return fetch(new Request(e.request,{body:JSON.stringify(body)}))}catch{return fetch(e.request)}})());return;
  }
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
