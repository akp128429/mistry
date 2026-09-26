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
    1:"independence, initiative, leadership",
    2:"cooperation, sensitivity, diplomacy",
    3:"expression, creativity, communication",
    4:"structure, discipline, reliability",
    5:"change, exploration, adaptability",
    6:"responsibility, care, harmony",
    7:"analysis, introspection, depth",
    8:"ambition, organisation, material execution",
    9:"service, idealism, broad perspective",
    11:"intuition, inspiration, heightened sensitivity",
    22:"large-scale building, systems, execution",
    33:"service-oriented communication and mentorship"
  };
  return {
    life,birth,attitude,year,
    text:`Life Path ${life}: ${meanings[life] || ""}\nBirth Number ${birth}: ${meanings[birth] || ""}\nAttitude Number ${attitude}: ${meanings[attitude] || ""}\nPersonal Year ${year}: a symbolic yearly theme, not a scientific prediction.`
  };
}

function cosine(a,b){
  let dot=0, aa=0, bb=0;
  for(let i=0;i<a.length;i++){ dot+=a[i]*b[i]; aa+=a[i]*a[i]; bb+=b[i]*b[i]; }
  return dot/(Math.sqrt(aa)*Math.sqrt(bb)||1);
}

async function imageVector(file, mode="face"){
  const bitmap = await createImageBitmap(file);
  const c = document.createElement("canvas");
  const s = 32; c.width=s; c.height=s;
  const ctx=c.getContext("2d",{willReadFrequently:true});
  let sx=0,sy=0,sw=bitmap.width,sh=bitmap.height;

  if(mode==="face"){
    try{
      if("FaceDetector" in window){
        const fd = new FaceDetector({fastMode:false,maxDetectedFaces:1});
        const faces = await fd.detect(bitmap);
        if(faces[0]?.boundingBox){
          const b=faces[0].boundingBox;
          sx=Math.max(0,b.x); sy=Math.max(0,b.y); sw=Math.min(bitmap.width-sx,b.width); sh=Math.min(bitmap.height-sy,b.height);
        }
      } else {
        const side=Math.min(bitmap.width,bitmap.height)*0.72;
        sx=(bitmap.width-side)/2; sy=(bitmap.height-side)/2; sw=sh=side;
      }
    }catch{}
  }

  ctx.drawImage(bitmap,sx,sy,sw,sh,0,0,s,s);
  const data=ctx.getImageData(0,0,s,s).data;
  const v=[];
  for(let y=0;y<s;y+=4){
    for(let x=0;x<s;x+=4){
      const i=(y*s+x)*4;
      const r=data[i]/255,g=data[i+1]/255,b=data[i+2]/255;
      v.push((r+g+b)/3, r-g, g-b);
    }
  }
  return v;
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
  let edge=0, varr=0;
  for(let yy=1;yy<159;yy++)for(let xx=1;xx<159;xx++){
    const i=yy*160+xx, gx=Math.abs(gray[i+1]-gray[i-1]), gy=Math.abs(gray[i+160]-gray[i-160]);
    edge += gx+gy>42 ? 1:0; varr+=(gray[i]-mean)**2;
  }
  const edgeDensity=edge/(158*158), contrast=Math.sqrt(varr/(158*158))/255;
  return {edgeDensity,contrast,brightness:mean/255};
}

export default function Page(){
  const [dob,setDob]=useState("");
  const [faceA,setFaceA]=useState(null), [faceB,setFaceB]=useState(null), [faceResult,setFaceResult]=useState("");
  const [palm,setPalm]=useState(null), [palmResult,setPalmResult]=useState("");
  const profile=useMemo(()=>dobProfile(dob),[dob]);

  async function compareFaces(){
    if(!faceA||!faceB) return setFaceResult("Please select two face images.");
    setFaceResult("Analysing…");
    try{
      const [a,b]=await Promise.all([imageVector(faceA),imageVector(faceB)]);
      const raw=cosine(a,b);
      const score=Math.max(0,Math.min(100,Math.round((raw*.5+.5)*100)));
      const band=score>=88?"high visual similarity":score>=76?"moderate visual similarity":"low visual similarity";
      setFaceResult(`Similarity score: ${score}/100 — ${band}.\nThis is a visual-comparison prototype, not a legally reliable biometric identity decision.`);
    }catch(e){setFaceResult("Could not analyse these images in this browser.");}
  }

  async function readPalm(){
    if(!palm) return setPalmResult("Please select a clear palm image.");
    setPalmResult("Analysing…");
    try{
      const s=await palmStats(palm);
      const line=s.edgeDensity>.18?"dense/fine-line pattern":s.edgeDensity>.11?"balanced line density":"cleaner/lower line density";
      const contrast=s.contrast>.25?"strong visual contrast":"soft visual contrast";
      const symbolic=s.edgeDensity>.18
        ?"Traditional palmistry would associate many fine lines with sensitivity and mental activity."
        :s.edgeDensity>.11
          ?"Traditional palmistry would describe this as a balanced mix of practicality and responsiveness."
          :"Traditional palmistry would often describe fewer dominant lines as directness and focus.";
      setPalmResult(`Image metrics\n• Line-edge density: ${(s.edgeDensity*100).toFixed(1)}%\n• Contrast index: ${(s.contrast*100).toFixed(1)}%\n• Brightness: ${(s.brightness*100).toFixed(1)}%\n\nPattern: ${line}, ${contrast}.\n\nPalmistry interpretation: ${symbolic}\n\nPalmistry is a cultural/entertainment interpretation and is not scientifically validated for predicting personality or future events.`);
    }catch(e){setPalmResult("Could not analyse this palm image.");}
  }

  return <main className="wrap">
    <section className="hero">
      <div className="eyebrow">MISTRY · MULTI-SIGNAL INSIGHT LAB</div>
      <h1 className="title">Face. Palm. DOB.<br/>One analysis desk.</h1>
      <p className="sub">A privacy-first browser prototype combining image statistics, visual similarity scoring and DOB-derived symbolic profiles. Images stay in your browser in this version.</p>
      <div><span className="pill">Client-side analysis</span><span className="pill">No image upload server</span><span className="pill">Explainable metrics</span></div>
    </section>

    <section className="grid">
      <article className="card">
        <h2>Face Compare</h2>
        <p className="fine">Choose two frontal images. The engine builds low-resolution visual descriptors and compares them with cosine similarity.</p>
        <input className="input" type="file" accept="image/*" onChange={e=>setFaceA(e.target.files?.[0]||null)}/>
        <input className="input" type="file" accept="image/*" onChange={e=>setFaceB(e.target.files?.[0]||null)}/>
        <button onClick={compareFaces}>Compare Faces</button>
        {faceResult && <div className="result">{faceResult}</div>}
      </article>

      <article className="card">
        <h2>Palm Scan</h2>
        <p className="fine">Uses grayscale contrast and edge-density statistics, then keeps traditional palmistry interpretation clearly separate from measured image features.</p>
        <input className="input" type="file" accept="image/*" onChange={e=>setPalm(e.target.files?.[0]||null)}/>
        <button onClick={readPalm}>Analyse Palm</button>
        {palmResult && <div className="result">{palmResult}</div>}
      </article>

      <article className="card">
        <h2>DOB Profile</h2>
        <p className="fine">Deterministic numerology-style calculation. It is reproducible from the entered date and is presented as symbolic interpretation—not statistical evidence of future outcomes.</p>
        <input className="input" type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
        {profile && <div className="result">{profile.text}</div>}
      </article>
    </section>

    <section className="card" style={{marginTop:18}}>
      <h2>What “statistical” means here</h2>
      <p className="fine">Measured outputs (image brightness, contrast, edge density, vector similarity) are algorithmic. Palmistry and numerology are separate interpretive traditions. This app does not use those traditions to make medical, legal, employment, credit, insurance, or other high-impact decisions.</p>
    </section>
  </main>;
}
