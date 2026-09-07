import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { frame,text,rect,mono } from './svg.mjs';

export function parseContributions(html) {
  const tips = new Map([...html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)].map(([,attrs,content])=>[attrs.match(/\bfor="([^"]+)"/)?.[1], content.trim()]));
  const days = [...html.matchAll(/<td\b[^>]*data-date="[^"]+"[^>]*>/g)].map(([tag])=>{
    const date=tag.match(/data-date="([^"]+)"/)?.[1],id=tag.match(/\bid="([^"]+)"/)?.[1],level=Number(tag.match(/data-level="(\d+)"/)?.[1]);
    const tip=tips.get(id), match=tip?.match(/^(No|[\d,]+) contributions? on /);
    if(!match || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(level) || level<0 || level>4) throw new Error('GitHub calendar format changed; keeping the previous snapshot.');
    return {date,count:match[1]==='No'?0:Number(match[1].replaceAll(',','')),level};
  }).sort((a,b)=>a.date.localeCompare(b.date));
  if(days.length<350 || days.length>380 || new Set(days.map(d=>d.date)).size!==days.length) throw new Error('Incomplete contribution calendar; keeping the previous snapshot.');
  for(let i=1;i<days.length;i++) if(Date.parse(days[i].date)-Date.parse(days[i-1].date)!==86400000) throw new Error('Non-contiguous contribution calendar.');
  const reported=html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions/);
  const total=days.reduce((sum,d)=>sum+d.count,0);
  // GitHub's summary can include the preceding partial week, which is omitted
  // from its visible cells. Report the sum for the exact displayed date range.
  if(!reported || total>Number(reported[1].replaceAll(',',''))) throw new Error('Contribution totals exceed the source summary.');
  return days;
}

export function summarize(days) {
  let longest=0,streak=0;
  for(const d of days) { streak=d.count>0?streak+1:0; longest=Math.max(longest,streak); }
  return {contributions:days.reduce((s,d)=>s+d.count,0),activeDays:days.filter(d=>d.count>0).length,longestStreak:longest};
}

export function renderActivity(data,mobile=false) {
  const w=mobile?600:1000,h=mobile?525:374, s=summarize(data.days), end=data.days.at(-1).date;
  let body=`${text(28,37,'GITHUB / CONTRIBUTION SIGNAL',mobile?16:15,'#5ce0ff',`${mono} letter-spacing="1.5"`)}${text(28,64,`${data.days[0].date} → ${end}`,mobile?16:13,'#90a8d0',mono)}`;
  const metrics=[[s.contributions.toLocaleString('en-US'),'CONTRIBUTIONS','#50deff'],[s.activeDays,'ACTIVE DAYS','#b195ff'],[s.longestStreak,'BEST STREAK · DAYS','#73efbe'],[data.publicRepos,'PUBLIC REPOSITORIES','#f59ccf']];
  for(let i=0;i<4;i++) {
    const x=28+(mobile?i%2:i)*(mobile?278:240),y=mobile?84+Math.floor(i/2)*102:84;
    body+=`${rect(x,y,mobile?266:224,90,'#101b32','#2a3b5b',10)}${text(x+17,y+43,metrics[i][0],33,metrics[i][2],'font-weight="700"')}${text(x+17,y+68,metrics[i][1],mobile?15:11,'#a4b8d7',mono)}`;
  }
  const allStart=Date.parse(data.days[0].date),weekStart=allStart-new Date(allStart).getUTCDay()*86400000;
  const weeks=Math.floor((Date.parse(end)-weekStart)/604800000)+1;
  const firstWeek=mobile?Math.max(0,weeks-27):0, cell=mobile?15:12,step=mobile?20:17,top=mobile?345:225;
  const visible=data.days.filter(d=>Math.floor((Date.parse(d.date)-weekStart)/604800000)>=firstWeek);
  body+=text(28,top-21,mobile?'LAST 27 WEEKS':'PAST YEAR',11,'#829abb',mono);
  let lastMonth='';
  for(const day of visible) {
    const date=new Date(day.date+'T00:00:00Z'),week=Math.floor((date.getTime()-weekStart)/604800000)-firstWeek,x=28+week*step,y=top+date.getUTCDay()*step;
    const color=['#17263f','#234c6b','#337f9b','#49b8d1','#89f3e0'][day.level];
    body+=`<g><title>${day.date}: ${day.count} contributions</title>${rect(x,y,cell,cell,color,'none',3)}</g>`;
    const month=day.date.slice(0,7);
    if(month!==lastMonth && date.getUTCDate()<=7 && date.getUTCDay()===0) {body+=text(x,top-6,date.toLocaleDateString('en-US',{month:'short',timeZone:'UTC'}),9,'#8fa8cc',mono);lastMonth=month;}
  }
  body+=text(28,h-18,`PUBLIC GITHUB DATA · UPDATED ${data.updatedAt.slice(0,10)} UTC`,mobile?11:10,'#829bbf',mono);
  return frame(w,h,`${s.contributions} contributions, ${s.activeDays} active days, ${s.longestStreak}-day best streak within ${data.days[0].date} to ${end}, and ${data.publicRepos} public repositories. Updated ${data.updatedAt}.`,body);
}

async function update() {
 const user='binhphanbp';
 const headers={'User-Agent':'binhphanbp-profile'};
 const apiHeaders={...headers,...(process.env.GITHUB_TOKEN?{Authorization:`Bearer ${process.env.GITHUB_TOKEN}`}:{})};
 const responses=await Promise.all([fetch(`https://github.com/users/${user}/contributions`,{headers}),fetch(`https://api.github.com/users/${user}`,{headers:apiHeaders})]);
 for(const r of responses) if(!r.ok) throw new Error(`GitHub returned ${r.status}; keeping the previous snapshot.`);
 const [calendar,profile]=await Promise.all([responses[0].text(),responses[1].json()]);
 if(profile.login!==user || !Number.isInteger(profile.public_repos)) throw new Error('Unexpected public profile response.');
 const data={username:user,updatedAt:new Date().toISOString(),publicRepos:profile.public_repos,days:parseContributions(calendar)};
 const svg=renderActivity(data),mobileSvg=renderActivity(data,true);
 const out=new URL('../assets/',import.meta.url);await mkdir(out,{recursive:true});
 await writeFile(new URL('activity.svg',out),svg);await writeFile(new URL('activity-mobile.svg',out),mobileSvg);await writeFile(new URL('activity.json',out),JSON.stringify(data,null,2)+'\n');
 console.log({...summarize(data.days),publicRepos:data.publicRepos,days:data.days.length});
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) await update();
