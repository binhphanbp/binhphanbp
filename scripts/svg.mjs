import { readFile } from 'node:fs/promises';
export const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const mono = 'font-family="Consolas,Menlo,monospace"';
export const text = (x,y,label,size=16,color='#edf4ff',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(label)}</text>`;
export const rect = (x,y,w,h,fill='#10192e',stroke='#293757',r=12,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
export const line = (d,color='#31d9ff',extra='') => `<path d="${d}" fill="none" stroke="${color}" ${extra}/>`;
export const dot = (x,y,r=4,color='#31d9ff',extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${extra}/>`;
export const pill = (x,y,w,label,color='#31d9ff') => `${rect(x,y,w,28,'#101a30',color,14,'stroke-opacity=".5"')}${text(x+w/2,y+19,label,11,color,`${mono} text-anchor="middle" letter-spacing=".7"`)}`;
export async function icon(name,x,y,size=40) {
  let raw = await readFile(new URL(`../assets/icons/${name}.svg`,import.meta.url),'utf8');
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 128 128';
  const prefix = `${name}-${x}-${y}-`;
  raw = raw.slice(raw.indexOf('>')+1,raw.lastIndexOf('</svg>'));
  raw = raw.replace(/id="([^"]+)"/g, (_,id)=>`id="${prefix}${id}"`).replace(/url\(#([^\)]+)\)/g,(_,id)=>`url(#${prefix}${id})`).replace(/(?:xlink:)?href="#([^"]+)"/g,(_,id)=>`href="#${prefix}${id}"`);
  if (['express','prisma'].includes(name)) raw=raw.replace(/#000000|#000\b|black|#2d3748/gi,'#e7efff');
  if (name==='mysql') raw=raw.replace(/#00618a/gi,'#69bce4');
  if (name==='jest') raw=raw.replace(/#99425b/gi,'#e17b9b');
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${viewBox}" fill="${['express','prisma'].includes(name)?'#e7efff':'currentColor'}">${raw}</svg>`;
}
export function frame(w,h,title,body,{accent='#31d9ff',background=true}={}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title>
<defs>
 <linearGradient id="neon"><stop stop-color="${accent}"/><stop offset=".5" stop-color="#8185ff"/><stop offset="1" stop-color="#d779ff"/></linearGradient>
 <radialGradient id="halo"><stop stop-color="${accent}" stop-opacity=".17"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
 <radialGradient id="violet"><stop stop-color="#9860ff" stop-opacity=".21"/><stop offset="1" stop-color="#9860ff" stop-opacity="0"/></radialGradient>
 <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#8caaff" stroke-opacity=".06"/></pattern>
 <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <clipPath id="edge"><rect width="${w}" height="${h}" rx="18"/></clipPath>
</defs>
<style>
svg{font-family:'Segoe UI',Arial,sans-serif}.spin{transform-box:fill-box;transform-origin:center;animation:spin 22s linear infinite}.reverse{animation-direction:reverse}.float{animation:float 5s ease-in-out infinite}.pulse{animation:pulse 3s ease-in-out infinite}.flow{stroke-dasharray:7 20;animation:flow 5s linear infinite}.trace{stroke-dasharray:100 1500;animation:trace 9s linear infinite}.cursor{animation:blink 1.2s steps(2,end) infinite}
@keyframes spin{to{transform:rotate(360deg)}}@keyframes float{50%{transform:translateY(-9px)}}@keyframes pulse{50%{opacity:.4}}@keyframes flow{to{stroke-dashoffset:-108}}@keyframes trace{to{stroke-dashoffset:-1600}}@keyframes blink{50%{opacity:0}}
@media(prefers-reduced-motion:reduce){.spin,.float,.pulse,.flow,.trace,.cursor{animation:none}}
</style>
<g clip-path="url(#edge)">${background?`${rect(0,0,w,h,'#080e20','none',18)}${rect(0,0,w,h,'url(#grid)','none',0)}<ellipse cx="${w*.2}" cy="${h*.35}" rx="${w*.5}" ry="${h*.9}" fill="url(#halo)"/><ellipse cx="${w*.8}" cy="${h*.6}" rx="${w*.45}" ry="${h}" fill="url(#violet)"/>`:''}${body}</g>
${background?`${rect(.7,.7,w-1.4,h-1.4,'none','#293555',18)}${line(`M1 66V18Q1 1 18 1H${w*.32}M${w*.69} ${h-1}H${w-18}Q${w-1} ${h-1} ${w-1} ${h-18}V${h-65}`,'url(#neon)','stroke-width="1.5"')}`:''}</svg>\n`;
}
