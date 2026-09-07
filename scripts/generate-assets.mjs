import { mkdir, writeFile } from 'node:fs/promises';
import { frame, text, rect, line, dot, pill, icon, mono } from './svg.mjs';
const out = new URL('../assets/',import.meta.url);
await mkdir(out,{recursive:true});
const save = (name,content) => writeFile(new URL(name,out),content);

// A luminous identity panel with real technology logos around an orbital motif.
for (const mobile of [false,true]) {
  const w=mobile?600:1000, h=mobile?390:340, cx=w/2;
  let body = `<g opacity=".38"><ellipse cx="${cx}" cy="${h*.5}" rx="${w*.41}" ry="${h*.39}" fill="none" stroke="#416287"/><ellipse cx="${cx}" cy="${h*.5}" rx="${w*.34}" ry="${h*.48}" fill="none" stroke="#7860c9" stroke-dasharray="4 13"/></g>
  ${line(`M30 80V30H100M${w-100} 30H${w-30}V80M30 ${h-80}V${h-30}H100M${w-100} ${h-30}H${w-30}V${h-80}`,'url(#neon)','stroke-width="2"')}
  ${text(cx,46,'BINHPHANBP  /  DIGITAL WORKSHOP',mobile?12:13,'#95a8ce',`${mono} text-anchor="middle" letter-spacing="2.5"`)}
  ${text(cx,mobile?125:120,'BÌNH PHAN',mobile?64:84,'#f6f8ff','text-anchor="middle" font-weight="800" letter-spacing="-2"')}
  ${text(cx,mobile?175:173,'FULL STACK DEVELOPER',mobile?23:26,'#50ddff',`${mono} text-anchor="middle" letter-spacing="3"`)}
  ${text(cx,mobile?214:215,'From the first pixel to the last endpoint.',mobile?19:22,'#b6c4e3','text-anchor="middle"')}
  ${pill(cx-180,mobile?242:247,111,'INTERFACES')}${pill(cx-56,mobile?242:247,112,'APIs & DATA','#ad8bff')}${pill(cx+69,mobile?242:247,111,'PRODUCTS','#f38fc9')}
  ${dot(cx-85,h-28,3,'#65f4bb','class="pulse"')}${text(cx-73,h-24,'CRAFTED IN VIETNAM',11,'#99accb',`${mono} letter-spacing="1.5"`)}`;
  const positions = mobile ? [[95,310,'react','#61dafb'],[205,310,'typescript','#3178c6'],[315,310,'nestjs','#ef4770'],[425,310,'postgresql','#729ac0']] : [[56,89,'react','#61dafb'],[137,228,'typescript','#3178c6'],[891,89,'nestjs','#ef4770'],[814,228,'postgresql','#729ac0']];
  for(const [x,y,name,color] of positions) body += `<g class="float" style="animation-delay:-${x%5}s">${rect(x,y,mobile?64:58,mobile?48:58,'#101b34',color,13,'stroke-opacity=".6"')}${await icon(name,x+(mobile?17:13),y+(mobile?9:13),32)}</g>`;
  body+=line(`M18 1H${w-18}Q${w-1} 1 ${w-1} 18V${h-18}Q${w-1} ${h-1} ${w-18} ${h-1}H18Q1 ${h-1} 1 ${h-18}V18Q1 1 18 1`,'#5bdaff','class="trace" stroke-width="2" filter="url(#glow)"');
  await save(`hero${mobile?'-mobile':''}.svg`,frame(w,h,'Bình Phan — Full Stack Developer from Vietnam',body));
}

const phrases = ['Designing interfaces people enjoy.','Engineering APIs that connect it all.','Turning useful ideas into web products.'];
for(const mobile of [false,true]) {
const lines=mobile?['Thoughtful interfaces.','Connected APIs & data.','Useful web products.']:phrases;
await save(`typing${mobile?'-mobile':''}.svg`,frame(mobile?600:900,mobile?66:58,'Designing interfaces, engineering APIs, building web products',`<style>
.phrase{animation:phrase 12s infinite}.p2{opacity:0;animation-delay:4s}.p3{opacity:0;animation-delay:8s}.type{animation:typing 4s steps(38,end) infinite}
@keyframes phrase{0%,30%{opacity:1}33%,100%{opacity:0}}@keyframes typing{0%{clip-path:inset(0 100% 0 0)}65%,90%{clip-path:inset(0 0 0 0)}100%{clip-path:inset(0 100% 0 0)}}
@media(prefers-color-scheme:light){.p1 text{fill:#067c99}.p2 text{fill:#6941c6}.p3 text{fill:#087e5b}}
@media(prefers-reduced-motion:reduce){.phrase,.type{animation:none}.p2,.p3{display:none}}
</style>${lines.map((s,i)=>`<g class="phrase p${i+1}"><g class="type">${text(mobile?300:450,mobile?41:37,s,mobile?26:25,['#50ddff','#b496ff','#68edc0'][i],`${mono} text-anchor="middle"`)}</g></g>`).join('')}`,{background:false}));
}

await save('divider.svg',frame(1000,64,'',`${line('M0 32H330L370 12H630L670 32H1000','#25344c','stroke-width="4"')}${line('M0 32H330L370 12H630L670 32H1000','url(#neon)','class="trace" stroke-width="3" filter="url(#glow)"')}${rect(460,23,80,25,'#0e182c','#344264',13)}${dot(479,35,4,'#3edcfa','class="pulse"')}${dot(500,35,4,'#9975ff','class="pulse" style="animation-delay:1s"')}${dot(521,35,4,'#ed83c7','class="pulse" style="animation-delay:2s"')}`,{background:false}));

const contacts = [ ['contact-email','EMAIL ME','↗','#42d9ff'],['contact-linkedin','LINKEDIN','in','#95aaff'],['contact-projects','PROJECTS','⌘','#bb91ff'],['contact-github','GITHUB','{ }','#70efbd'] ];
for(const [name,label,mark,color] of contacts) await save(`${name}.svg`,frame(184,48,label,`${rect(1,1,182,46,'#0f1a30','#334463',10)}${rect(10,10,29,28,color,'none',7)}${text(24.5,30,mark,17,'#091122',`text-anchor="middle" font-weight="800" ${mono}`)}${text(108,29,label,13,color,`${mono} text-anchor="middle" font-weight="700" letter-spacing="1"`)}`,{background:false}));

const skills = [
 ['FRONTEND','Interfaces with intent.','#4ad7ff',[['typescript','TypeScript'],['javascript','JavaScript'],['react','React'],['nextjs','Next.js'],['tailwindcss','Tailwind']]],
 ['BACKEND','The logic behind the experience.','#ab8bff',[['nodejs','Node.js'],['nestjs','NestJS'],['express','Express'],['prisma','Prisma'],['postman','Postman']]],
 ['DATA & CLOUD','Model. Store. Connect.','#5ee5af',[['postgresql','PostgreSQL'],['supabase','Supabase'],['mongodb','MongoDB'],['mysql','MySQL'],['firebase','Firebase']]],
 ['TOOLS & DELIVERY','Build with a feedback loop.','#f39ace',[['docker','Docker'],['git','Git'],['githubactions','GH Actions'],['jest','Jest'],['figma','Figma']]],
];
for(const mobile of [false,true]) {
  const w=mobile?600:1000, h=mobile?944:520;
  let body='';
  for(let index=0;index<skills.length;index++) {
    const [label,tagline,color,items]=skills[index];
    const x=mobile?20:22+(index%2)*490,y=mobile?20+index*231:20+Math.floor(index/2)*250,cw=mobile?560:466;
    body+=`${rect(x,y,cw,230,'#0c1529','#2a3857',14)}${line(`M${x+15} ${y}H${x+140}`,color,'stroke-width="2"')}${dot(x+22,y+29,4,color)}${text(x+36,y+34,label,15,color,`${mono} font-weight="700" letter-spacing="1.5"`)}${text(x+20,y+60,tagline,14,'#94a8cc')}`;
    for(let n=0;n<items.length;n++) {
      const [name,caption]=items[n],tileW=mobile?94:77,tx=x+20+n*(tileW+7),ty=y+82;
      body+=`${rect(tx,ty,tileW,124,'#111e37','#243858',10)}${await icon(name,tx+(tileW-42)/2,ty+18,42)}${text(tx+tileW/2,ty+92,caption,mobile?14:11.5,'#d6e4ff','text-anchor="middle"')}${line(`M${tx+tileW/2-10} ${ty+108}h20`,color,'stroke-width="2" opacity=".7"')}`;
    }
  }
  await save(`tech-stack${mobile?'-mobile':''}.svg`,frame(w,h,'Tech arsenal: TypeScript, JavaScript, React, Next.js, Tailwind CSS, Node.js, NestJS, Express, Prisma, Postman, PostgreSQL, Supabase, MongoDB, MySQL, Firebase, Docker, Git, GitHub Actions, Jest, Figma.',body));
}

// A product-minded core panel, with a small animated network rather than generic stock graphics.
for(const mobile of [false,true]) {
 const w=mobile?600:1000,h=mobile?430:258;
 let body=`${text(30,42,'ENGINEERING MINDSET',16,'#6fe1ff',`${mono} font-weight="700" letter-spacing="2"`)}${text(30,74,'Good products connect every layer.',mobile?23:25,'#f0f4ff','font-weight="600"')}`;
 const cols=[['01','EXPERIENCE','Thoughtful UI.','Responsive interactions.','#43d9ff'],['02','FOUNDATIONS','Clear APIs.','Well-shaped data models.','#b495ff'],['03','CRAFT','Readable code.','Tests where they matter.','#67edbc']];
 for(let n=0;n<3;n++){
   const [no,title,a,b,color]=cols[n],x=mobile?28:30+n*318,y=mobile?102+n*100:102;
   body+=`${rect(x,y,mobile?544:304,mobile?86:132,'#0c162b','#2b3958',12)}${text(x+18,y+32,no,18,color,mono)}${text(x+(mobile?64:53),y+32,title,16,color,`${mono} font-weight="700"`)}${text(x+(mobile?64:18),y+(mobile?57:70),a,mobile?17:18,'#dce7fa')}${text(x+(mobile?250:18),y+(mobile?57:100),b,mobile?16:16,'#94a9ce')}`;
 }
 await save(`core${mobile?'-mobile':''}.svg`,frame(w,h,'Engineering mindset: thoughtful experiences, clear APIs and data models, readable code and meaningful tests.',body));
}

const projects=[
 {slug:'devready',name:'DevReady',label:'DEVELOPER LEARNING',tagline:'Prepare. Practice. Progress.',accent:'#42dbff',stack:['nextjs','react','typescript','supabase'],tags:['QUESTIONS','FLASHCARDS','AI MENTOR']},
 {slug:'staffup',name:'StaffUp',label:'WORKPLACE LEARNING',tagline:'Make room for growth.',accent:'#ab8bff',stack:['nextjs','express','prisma','postgresql'],tags:['COURSES','ROADMAPS','PROGRESS']},
 {slug:'upnext',name:'UpNext',label:'IT RECRUITMENT',tagline:'A next step worth taking.',accent:'#58e6b7',stack:['nextjs','nestjs','postgresql','docker'],tags:['FRONTEND','BACKEND','INFRASTRUCTURE']},
];
for(const p of projects) for(const mobile of [false,true]) {
 const w=mobile?600:1000,h=mobile?390:290;
 let art='';
 if(p.slug==='devready') art=`${rect(0,0,306,202,'#0d1931','#326a8b',14)}${dot(17,18,4,'#ff709b')}${dot(31,18,4,'#e4bd68')}${dot(45,18,4,'#57dfb0')}${text(69,22,'devready / practice',10,'#819bbc',mono)}${line('M0 35H306','#23395d')}${rect(15,49,80,138,'#101f3c','#21385b',7)}${[0,1,2,3].map((v)=>`${rect(25,62+v*27,60,17,v===1?'#14485d':'#172a48','none',4)}${line(`M32 ${71+v*27}h38`,v===1?'#53dcff':'#435e83','stroke-width="3"')}`).join('')}${text(111,70,'</> Interview practice',11,'#60dcff',mono)}${[0,1,2,3].map(v=>line(`M113 ${89+v*13}h${130-v*17}`,['#a893f6','#61c7e9','#d5a1c4','#72d9b7'][v],'stroke-width="4" stroke-linecap="round"')).join('')}${rect(112,148,126,25,'#124754','#2e8894',6)}${text(175,165,'NEXT QUESTION →',9,'#79edfa',`${mono} text-anchor="middle"`)}<g class="float">${rect(222,98,110,59,'#152744','#549ed0',9)}${text(235,120,'READYBOT',10,'#94b8ff',mono)}${dot(239,139,3,'#52dcff','class="pulse"')}${dot(253,139,3,'#9c85ff','class="pulse"')}${dot(267,139,3,'#dd8ec4','class="pulse"')}</g>`;
 if(p.slug==='staffup') art=`${rect(0,0,306,202,'#101831','#575086',14)}${text(18,27,'staffup / learning path',11,'#a994f2',mono)}${line('M0 40H306','#323258')}${line('M43 150L112 118L177 82L259 59','#5d498e','stroke-width="2"')}${line('M43 150L112 118L177 82L259 59','#b193ff','class="flow" stroke-width="2"')}${[0,1,2,3].map((n)=>`${rect(25+n*70,166-n*26,38,20+n*26,'#493a76','none',5,`opacity="${.4+n*.15}"`)}${dot(43+n*70,150-n*30,12,'#1f2545')}${dot(43+n*70,150-n*30,6,['#65d6ff','#9c87ff','#cb8bf7','#70ecc9'][n],'class="pulse"')}`).join('')}<g class="float">${rect(172,144,153,47,'#1b2546','#8173bb',9)}${text(186,164,'LEARNING ROADMAP',10,'#d1b9ff',mono)}${line('M187 178h105','#35476b','stroke-width="5" stroke-linecap="round"')}${line('M187 178h74','#a389ff','stroke-width="5" stroke-linecap="round"')}</g>`;
 if(p.slug==='upnext') art=`${rect(0,0,306,202,'#0d1d2d','#356776',14)}${text(18,27,'upnext / opportunities',11,'#8bcab9',mono)}${line('M0 40H306','#294653')}${[0,1,2].map(n=>`${rect(14,53+n*45,199,37,'#13293b','#264959',7)}${rect(23,61+n*45,22,22,['#305675','#464b78','#25675f'][n],'none',5)}${line(`M55 ${65+n*45}h110`,'#849ebb','stroke-width="3"')}${line(`M55 ${78+n*45}h75`,'#446784','stroke-width="3"')}`).join('')}<g transform="translate(255 116)"><circle r="51" fill="#11382e" stroke="#3ad6a4"/><circle class="spin" r="61" fill="none" stroke="#66dfbb" stroke-dasharray="25 72"/>${line('M-20 20L21 -21M-9 -21H21V9','#77ffcc','stroke-width="8" stroke-linecap="round" stroke-linejoin="round"')}</g>`;
 let body=`${text(28,35,p.label,12,p.accent,`${mono} letter-spacing="2"`)}${text(25,94,p.name,mobile?49:55,'#f4f7ff','font-weight="800" letter-spacing="-1.5"')}${text(28,132,p.tagline,mobile?22:25,'#b7c6e4')}`;
 for(let n=0;n<p.tags.length;n++)body+=pill(28+n*(mobile?164:155),153,mobile?152:145,p.tags[n],p.accent);
 if(mobile){body+=`<g transform="translate(275 214) scale(.78)">${art}</g>`;for(let n=0;n<p.stack.length;n++)body+=await icon(p.stack[n],30+(n%2)*72,222+Math.floor(n/2)*72,43);}
 else {body+=`<g transform="translate(637 48)">${art}</g>`;for(let n=0;n<p.stack.length;n++)body+=`${rect(28+n*59,211,46,46,'#14213b','#2b4267',10)}${await icon(p.stack[n],36+n*59,219,30)}`;}
 body+=`${line(`M${w-49} 30h20v20M${w-50} 51l20-20`,p.accent,'stroke-width="2"')}${line(`M18 ${h-1}H${w-18}`,'url(#neon)','class="trace" stroke-width="2" filter="url(#glow)"')}`;
 await save(`project-${p.slug}${mobile?'-mobile':''}.svg`,frame(w,h,`${p.name} — ${p.tagline} ${p.label}. Conceptual product illustration.`,body,{accent:p.accent}));
}

await save('connect.svg',frame(1000,180,'Let’s build something worth using. Connect with Bình Phan.',`<g transform="translate(135 90)"><circle r="56" fill="none" stroke="#293b5e"/><circle r="42" fill="none" stroke="#586998" stroke-dasharray="12 18" class="spin"/>${dot(-49,0,8,'#42dbff','filter="url(#glow)" class="pulse"')}${dot(49,0,8,'#b687ff','filter="url(#glow)" class="pulse"')}${line('M-20 1H20M0 -19V21','#90adff','stroke-width="3"')}</g>${text(260,58,'LET’S CONNECT',13,'#59ddff',`${mono} letter-spacing="3"`)}${text(260,102,'Build something worth using.',34,'#eef4ff','font-weight="700"')}${text(260,137,'Web products · Developer tools · Useful ideas',18,'#9dafce')}`));
await save('connect-mobile.svg',frame(600,210,'Let’s build something worth using. Connect with Bình Phan.',`<g transform="translate(85 107)"><circle r="52" fill="none" stroke="#293b5e"/><circle r="39" fill="none" stroke="#586998" stroke-dasharray="12 18" class="spin"/>${dot(-45,0,7,'#42dbff','filter="url(#glow)" class="pulse"')}${dot(45,0,7,'#b687ff','filter="url(#glow)" class="pulse"')}${line('M-17 1H17M0 -16V18','#90adff','stroke-width="3"')}</g>${text(176,48,'LET’S CONNECT',15,'#59ddff',`${mono} letter-spacing="2"`)}${text(176,95,'Build something',33,'#eef4ff','font-weight="700"')}${text(176,134,'worth using.',33,'#eef4ff','font-weight="700"')}${text(176,170,'Web products · Useful ideas',17,'#9dafce')}`));
console.log('Generated neon identity, animated panels, 20-logo stack, project visuals and contact assets.');
