"use client";

import { useMemo, useState } from "react";
import "./globals.css";

const meanings={1:["Leader","initiative, independence and self-direction"],2:["Diplomat","cooperation, sensitivity and partnership"],3:["Communicator","expression, creativity and sociability"],4:["Builder","structure, discipline and reliability"],5:["Explorer","change, adaptability and freedom"],6:["Nurturer","responsibility, care and harmony"],7:["Analyst","introspection, research and depth"],8:["Executive","ambition, organisation and material execution"],9:["Humanitarian","service, idealism and broad perspective"],11:["Intuitive","inspiration and heightened sensitivity"],22:["Master Builder","large-scale systems and execution"],33:["Mentor","service-oriented communication and guidance"]};
const letters={A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,E:5,N:5,W:5,F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9};
const vowels=new Set(["A","E","I","O","U"]);

function reduceNumber(v,master=true){let x=String(v).replace(/\D/g,"").split("").reduce((a,b)=>a+Number(b),0);while(x>9&&!(master&&[11,22,33].includes(x)))x=String(x).split("").reduce((a,b)=>a+Number(b),0);return x}
function nameNumber(name,mode="all"){return reduceNumber(name.toUpperCase().split("").filter(c=>letters[c]&&(mode==="all"||(mode==="vowel"?vowels.has(c):!vowels.has(c)))).reduce((a,c)=>a+letters[c],0))}
function zodiac(m,d){const z=[["Capricorn",1,19],["Aquarius",2,18],["Pisces",3,20],["Aries",4,19],["Taurus",5,20],["Gemini",6,20],["Cancer",7,22],["Leo",8,22],["Virgo",9,22],["Libra",10,22],["Scorpio",11,21],["Sagittarius",12,21],["Capricorn",12,31]];return z.find(([_,mm,dd])=>m<mm||(m===mm&&d<=dd))?.[0]||"Capricorn"}
function profile(name,dob){
 if(!dob)return null;const[y,m,d]=dob.split("-").map(Number),life=reduceNumber(`${d}${m}${y}`),birth=reduceNumber(d),attitude=reduceNumber(d+m),personal=reduceNumber(new Date().getFullYear()+m+d),expression=name?nameNumber(name):null,soul=name?nameNumber(name,"vowel"):null,personality=name?nameNumber(name,"consonant"):null;
 return{y,m,d,life,birth,attitude,personal,expression,soul,personality,zodiac:zodiac(m,d)};
}
function theme(n){return meanings[n]||["Pattern","mixed symbolic themes"]}
function pseudoAstrology(p,timeKnown,place){
 if(!p)return[];const moonSeed=reduceNumber(p.d+p.m+p.y,false),nak=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
 const approx=nak[(p.y+p.m*3+p.d*7)%27];
 return[
  {label:"Sun-sign layer",value:p.zodiac,type:"Calculated",why:"Derived from calendar date using tropical zodiac date ranges."},
  {label:"Date-cycle index",value:`${moonSeed} · ${theme(moonSeed)[0]}`,type:"Calculated",why:"Deterministic DOB reduction used by Mistry's symbolic date layer."},
  {label:"Nakshatra / Moon",value:timeKnown?"Requires astronomical ephemeris engine":"Not claimed without exact ephemeris/time",type:"Limited",why:"A real Vedic Moon degree and Nakshatra require astronomical position calculation. Mistry will not invent them."},
  {label:"Lagna & 12 houses",value:timeKnown&&place?"Pending ephemeris-grade calculation":"Unavailable without reliable birth time + place",type:"Limited",why:"Ascendant changes through the day and depends on location."},
  {label:"Exploratory date archetype",value:approx,type:"Traditional",why:"A deterministic symbolic index for exploration only; it is not presented as the person's actual Nakshatra."}
 ];
}
async function palmStats(file){
 const bitmap=await createImageBitmap(file),c=document.createElement("canvas");c.width=240;c.height=240;const x=c.getContext("2d",{willReadFrequently:true});x.drawImage(bitmap,0,0,240,240);const px=x.getImageData(0,0,240,240).data,g=[];let mean=0;
 for(let i=0;i<px.length;i+=4){const v=.299*px[i]+.587*px[i+1]+.114*px[i+2];g.push(v);mean+=v}mean/=g.length;
 let edge=0,variance=0,horiz=0,vert=0;for(let yy=1;yy<239;yy++)for(let xx=1;xx<239;xx++){const i=yy*240+xx,gx=Math.abs(g[i+1]-g[i-1]),gy=Math.abs(g[i+240]-g[i-240]);if(gx+gy>42)edge++;if(gx>gy)vert++;else horiz++;variance+=(g[i]-mean)**2}
 const total=238*238;return{edge:edge/total,contrast:Math.sqrt(variance/total)/255,brightness:mean/255,orientation:(horiz-vert)/total};
}
function palmInterpret(s,side){
 const density=s.edge>.18?"high":s.edge>.11?"medium":"low",quality=s.contrast>.18&&s.brightness>.18&&s.brightness<.9?"Good":"Retake recommended";
 return{side,quality,metrics:[["Edge density",(s.edge*100).toFixed(1)+"%"],["Contrast",(s.contrast*100).toFixed(1)+"%"],["Brightness",(s.brightness*100).toFixed(1)+"%"],["Orientation index",s.orientation.toFixed(2)]],symbolic:density==="high"?"Traditional palmistry often associates many visible fine-line structures with sensitivity and mental activity.":density==="medium"?"Traditional palmistry often interprets moderate line density as a balance of responsiveness and practicality.":"Traditional palmistry often interprets fewer dominant visible edges as a more direct or focused pattern."};
}
function agreement(p,palms){
 if(!p)return null;let leadership=[1,8,22].includes(p.life)?1:0,analysis=[4,7,8].includes(p.life)?1:0,people=[2,3,6,9,33].includes(p.life)?1:0;
 if(p.expression){leadership+=[1,8,22].includes(p.expression)?1:0;analysis+=[4,7,8].includes(p.expression)?1:0;people+=[2,3,6,9,33].includes(p.expression)?1:0}
 if(palms.length){const avg=palms.reduce((a,b)=>a+Number(b.metrics[0][1].replace("%","")),0)/palms.length;analysis+=avg>11?1:0;people+=avg>18?1:0}
 return[{name:"Leadership / execution",score:leadership},{name:"Analysis / structure",score:analysis},{name:"People / expression",score:people}].sort((a,b)=>b.score-a.score);
}

export default function Page(){
 const[name,setName]=useState(""),[dob,setDob]=useState(""),[place,setPlace]=useState(""),[birthTime,setBirthTime]=useState(""),[unknown,setUnknown]=useState(true),[left,setLeft]=useState(null),[right,setRight]=useState(null),[palms,setPalms]=useState([]),[busy,setBusy]=useState(false),[milestones,setMilestones]=useState("");
 const p=useMemo(()=>profile(name,dob),[name,dob]),astro=useMemo(()=>pseudoAstrology(p,!unknown&&!!birthTime,place),[p,unknown,birthTime,place]),fusion=useMemo(()=>agreement(p,palms),[p,palms]);
 async function analysePalms(){setBusy(true);try{const out=[];if(left)out.push(palmInterpret(await palmStats(left),"Left palm"));if(right)out.push(palmInterpret(await palmStats(right),"Right palm"));setPalms(out)}finally{setBusy(false)}}
 return <main className="wrap">
  <header className="hero"><div className="eyebrow">MISTRY · ASTROLOGY + PALMISTRY LAB</div><h1>Know the calculation.<br/><span>Then read the interpretation.</span></h1><p>One explainable dashboard for DOB/name numerology, birth-chart readiness, palm-image measurements and cross-system symbolic themes. Nothing is presented as guaranteed future prediction.</p><div className="badges"><b>CALCULATED</b><b>IMAGE MEASURED</b><b>TRADITIONAL</b><b>ESTIMATED / LIMITED</b></div></header>
  <section className="card"><div className="sectionTitle"><span>01</span><div><h2>Birth & identity profile</h2><p>Birth time is optional. Unknown time never blocks the report.</p></div></div><div className="formGrid">
   <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter full name"/></label><label>Date of birth<input type="date" value={dob} onChange={e=>setDob(e.target.value)}/></label><label>Birth place<input value={place} onChange={e=>setPlace(e.target.value)} placeholder="City, State, Country"/></label><label>Birth time<input type="time" disabled={unknown} value={birthTime} onChange={e=>setBirthTime(e.target.value)}/></label>
  </div><label className="check"><input type="checkbox" checked={unknown} onChange={e=>setUnknown(e.target.checked)}/> I don't know my exact birth time</label></section>

  {p&&<><section className="grid stats">
   {[["Life Path",p.life],["Birth Number",p.birth],["Expression",p.expression||"—"],["Soul Urge",p.soul||"—"],["Personality",p.personality||"—"],["Personal Year",p.personal]].map(([a,b])=><article className="mini" key={a}><small>CALCULATED</small><strong>{b}</strong><span>{a}</span>{b!=="—"&&<p>{theme(b)[1]}</p>}</article>)}
  </section><section className="card"><div className="sectionTitle"><span>02</span><div><h2>Astrology calculation desk</h2><p>We explicitly separate real calculable prerequisites from symbolic exploration.</p></div></div><div className="rows">{astro.map(x=><div className="row" key={x.label}><div><em className={x.type.toLowerCase()}>{x.type}</em><h3>{x.label}</h3><strong>{x.value}</strong></div><details><summary>Why this result?</summary><p>{x.why}</p></details></div>)}</div></section></>}

  {unknown&&<section className="card accent"><div className="sectionTitle"><span>03</span><div><h2>Birth Time Rectification workspace</h2><p>Known milestones can narrow candidate windows in a future ephemeris-backed rectification engine; they cannot scientifically recover an exact forgotten time.</p></div></div><textarea value={milestones} onChange={e=>setMilestones(e.target.value)} placeholder={"Add dated milestones, one per line\n2018 — graduation\n2021 — first job\n2024 — major relocation"}/><div className="notice">STATUS · {milestones.trim()?milestones.trim().split("\n").length+" milestones captured for candidate-time comparison":"Add dated life events to prepare rectification."}</div></section>}

  <section className="card"><div className="sectionTitle"><span>04</span><div><h2>Dual-palm vision scan</h2><p>Upload clear, evenly lit palm photos. Images are processed locally in this browser prototype.</p></div></div><div className="formGrid"><label>Left palm<input type="file" accept="image/*" onChange={e=>setLeft(e.target.files?.[0]||null)}/></label><label>Right palm<input type="file" accept="image/*" onChange={e=>setRight(e.target.files?.[0]||null)}/></label></div><button onClick={analysePalms} disabled={busy||(!left&&!right)}>{busy?"Analysing image geometry…":"Analyse palm image(s)"}</button>
  {palms.length>0&&<div className="grid palmGrid">{palms.map(q=><article className="palm" key={q.side}><em className="image">IMAGE MEASURED</em><h3>{q.side}</h3><b>Image quality: {q.quality}</b>{q.metrics.map(([a,b])=><div className="metric" key={a}><span>{a}</span><strong>{b}</strong></div>)}<em className="traditional">TRADITIONAL</em><p>{q.symbolic}</p></article>)}</div>}</section>

  {p&&<section className="card"><div className="sectionTitle"><span>05</span><div><h2>Mistry Fusion Engine</h2><p>Agreement score means agreement between Mistry's symbolic layers—not probability that a life prediction will occur.</p></div></div><div className="fusion">{fusion?.map((f,i)=><div className="bar" key={f.name}><div><span>{f.name}</span><b>{f.score}/3 signals</b></div><progress max="3" value={f.score}/>{i===0&&<small>Current strongest combined theme</small>}</div>)}</div>
  <div className="timeline"><h3>Symbolic life-cycle explorer</h3>{[18,21,24,27,30,33,36,40,45,50].map(age=>{const n=reduceNumber(p.life+age);return <div className="age" key={age}><b>{age}</b><span>{theme(n)[0]}</span><small>{theme(n)[1]}</small></div>})}</div></section>}

  <section className="card boundary"><h2>What Mistry can—and cannot—tell you</h2><div className="two"><div><h3>✓ Transparent outputs</h3><p>DOB/name arithmetic, image brightness/contrast/edge measurements and clearly identified prerequisites for astronomical chart calculations.</p></div><div><h3>⚠ Interpretive outputs</h3><p>Astrology, palmistry and numerology are traditional symbolic systems, not scientifically validated methods for predicting job, marriage, lifespan, health, wealth or future events. Mistry does not invent exact spouse names, death ages, companies, salaries or guaranteed dates.</p></div></div></section>
 </main>
}