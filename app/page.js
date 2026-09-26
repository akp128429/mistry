"use client";

import { useMemo, useState } from "react";
import "./globals.css";

function reduceNumber(n, keepMaster=true){
  let x = String(n).replace(/\D/g,"").split("").reduce((a,b)=>a+Number(b),0);
  while(x>9 && !(keepMaster && [11,22,33].includes(x))){
    x = String(x).split("").reduce((a,b)=>a+Number(b),0);
  }
  return x;
}

function dobProfile(dob){
  if(!dob) return null;
  const [y,m,d] = dob.split("-").map(Number);
  const life = reduceNumber(`${d}${m}${y}`);
  const birth = reduceNumber(String(d));
  const attitude = reduceNumber(String(d+m));
  const year = reduceNumber(String(new Date().getFullYear()+m+d));
  const meanings = {
    1:"independence, initiative, leadership",2:"cooperation, sensitivity, diplomacy",
    3:"expression, creativity, communication",4:"structure, discipline, reliability",
    5:"change, exploration, adaptability",6:"responsibility, care, harmony",
    7:"analysis, introspection, depth",8:"ambition, organisation, material execution",
    9:"service, idealism, broad perspective",11:"intuition, inspiration, heightened sensitivity",
    22:"large-scale building, systems, execution",33:"service-oriented communication and mentorship"
  };
  return {text:`Life Path ${life}: ${meanings[life] || ""}\nBirth Number ${birth}: ${meanings[birth] || ""}\nAttitude Number ${attitude}: ${meanings[attitude] || ""}\nPersonal Year ${year}: a symbolic yearly theme, not a scientific prediction.`};
}

async function palmStats(file){
  const bitmap=await createImageBitmap(file);
  const c=document.createElement("canvas"); c.width=160;c.height=160;
  const x=c.getContext("2d",{willReadFrequently:true});
  x.drawImage(bitmap,0,0,160,160);
  const d=x.getImageData(0,0,160,160).data;
  let mean=0,n=0; const gray=[];
  for(let i=0;i<d.length;i+=4){const g=.299*d[i]+.587*d[i+1]+.114*d[i+2];gray.push(g);mean+=g;n++}
  mean/=n;
  let edge=0,varr=0;
  for(let yy=1;yy<159;yy++)for(let xx=1;xx<159;xx++){
    const i=yy*160+xx,gx=Math.abs(gray[i+1]-gray[i-1]),gy=Math.abs(gray[i+160]-gray[i-160]);
    edge+=gx+gy>42?1:0; varr+=(gray[i]-mean)**2;
  }
  return {edgeDensity:edge/(158*158),contrast:Math.sqrt(varr/(158*158))/255,brightness:mean/255};
}

export default function Page(){
  const [dob,setDob]=useState("");
  const [palm,setPalm]=useState(null),[palmResult,setPalmResult]=useState("");
  const profile=useMemo(()=>dobProfile(dob),[dob]);

  async function readPalm(){
    if(!palm) return setPalmResult("Please select a clear palm image.");
    setPalmResult("Analysing…");
    try{
      const s=await palmStats(palm);
      const line=s.edgeDensity>.18?"dense/fine-line pattern":s.edgeDensity>.11?"balanced line density":"cleaner/lower line density";
      const contrast=s.contrast>.25?"strong visual contrast":"soft visual contrast";
      const symbolic=s.edgeDensity>.18?"Traditional palmistry would associate many fine lines with sensitivity and mental activity.":s.edgeDensity>.11?"Traditional palmistry would describe this as a balanced mix of practicality and responsiveness.":"Traditional palmistry would often describe fewer dominant lines as directness and focus.";
      setPalmResult(`Image metrics\n• Line-edge density: ${(s.edgeDensity*100).toFixed(1)}%\n• Contrast index: ${(s.contrast*100).toFixed(1)}%\n• Brightness: ${(s.brightness*100).toFixed(1)}%\n\nPattern: ${line}, ${contrast}.\n\nPalmistry interpretation: ${symbolic}\n\nPalmistry is a cultural/entertainment interpretation and is not scientifically validated for predicting personality or future events.`);
    }catch(e){setPalmResult("Could not analyse this palm image.");}
  }

  return <main className="wrap">
    <section className="hero">
      <div className="eyebrow">MISTRY · PALM & DOB INSIGHT LAB</div>
      <h1 className="title">Palm. DOB.<br/>One analysis desk.</h1>
      <p className="sub">A privacy-first browser prototype combining palm-image statistics and DOB-derived symbolic profiles. Palm images stay in your browser in this version.</p>
      <div><span className="pill">Client-side palm analysis</span><span className="pill">No image upload server</span><span className="pill">Explainable metrics</span></div>
    </section>
    <section className="grid">
      <article className="card">
        <h2>Palm Scan</h2>
        <p className="fine">Uses grayscale contrast and edge-density statistics, then keeps traditional palmistry interpretation clearly separate from measured image features.</p>
        <input className="input" type="file" accept="image/*" onChange={e=>setPalm(e.target.files?.[0]||null)}/>
        <button onClick={readPalm}>Analyse Palm</button>
        {palmResult && <div className="result">{palmResult}</div>}
      </article>
      <article className="card">
        <h2>DOB Profile</h2>
        <p className="fine">Deterministic numerology-style calculation, presented as symbolic interpretation—not statistical evidence of future outcomes.</p>
        <input className="input" type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
        {profile && <div className="result">{profile.text}</div>}
      </article>
    </section>
    <section className="card" style={{marginTop:18}}>
      <h2>What “statistical” means here</h2>
      <p className="fine">Measured palm-image outputs such as brightness, contrast and edge density are algorithmic. Palmistry and numerology are separate interpretive traditions and are not used for medical, legal, employment, credit, insurance or other high-impact decisions.</p>
    </section>
  </main>;
}