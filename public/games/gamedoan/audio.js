'use strict';
function createGameAudio(){
 const key='safe-room-audio-v1',defaults={music:.3,effects:.75,voice:1,muted:false};
 let stored={};try{stored=JSON.parse(localStorage.getItem(key))||{};}catch{}
 const settings={...defaults,...stored};
 for(const name of ['music','effects','voice'])settings[name]=Math.max(0,Math.min(1,Number(settings[name])||0));
 settings.muted=Boolean(settings.muted);
 const music=new Audio('assets/audio/boba-date.mp3');music.loop=true;music.preload='none';
 const clips={pop:new Audio('assets/audio/pop.mp3'),meow:new Audio('assets/audio/meow.mp3')};
 Object.values(clips).forEach(clip=>{clip.preload='auto';});
 let state='hub',hidden=document.hidden,context=null,unlocked=false;
 const buffers=new Map(),playing=new Set(),downloads=new Map(),decoding=new Map(),attempts={pop:0,meow:0};
 let duckUntil=0,duckTimer=0;
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(settings));}catch{}};
 function sync(){
  music.volume=settings.muted?0:settings.music*(state==='lesson'?.22:1)*(performance.now()<duckUntil?.45:1);
  const active=['intro','search','hint','lesson','pause','notebook'].includes(state);
  if(active&&!hidden&&!settings.muted&&settings.music>0&&unlocked){if(music.paused)music.play().catch(()=>{});}else music.pause();
  if(!active||settings.muted||hidden){playing.forEach(sound=>{if(sound.stop){try{sound.stop();}catch{}}else sound.pause();});playing.clear();}
 }
 function fetchClip(name){
  if(!downloads.has(name))downloads.set(name,fetch(clips[name].src).then(response=>{if(!response.ok)throw Error('Missing sound');return response.arrayBuffer();}).catch(()=>{downloads.delete(name);return null;}));
  return downloads.get(name);
 }
 function prepare(name){
  if(buffers.has(name))return Promise.resolve(buffers.get(name));
  if(!context)return Promise.resolve(null);
  if(!decoding.has(name))decoding.set(name,fetchClip(name).then(data=>data?context.decodeAudioData(data.slice(0)):null).then(buffer=>{if(buffer)buffers.set(name,buffer);return buffer;}).catch(()=>null).finally(()=>decoding.delete(name)));
  return decoding.get(name);
 }
 // Fetch the two tiny effects early; decoding never waits for resume() to finish.
 Object.keys(clips).forEach(fetchClip);
 function unlock(){
  unlocked=true;
  let resumed=Promise.resolve();
  try{
   if(!context||context.state==='closed')context=new (window.AudioContext||window.webkitAudioContext)();
   // Retry inside each real click/touch gesture, including after an iOS interruption.
   if(context.state!=='running')resumed=context.resume().catch(()=>{});
   Object.keys(clips).forEach(prepare);
  }catch{}
  sync();return resumed;
 }
 function duck(duration){duckUntil=Math.max(duckUntil,performance.now()+duration*1000);clearTimeout(duckTimer);sync();duckTimer=setTimeout(sync,Math.max(0,duckUntil-performance.now())+30);}
 function allowed(){return !settings.muted&&settings.effects>0&&!hidden&&['intro','search','hint','lesson','pause','notebook'].includes(state);}
 function startBuffer(buffer){
  if(!allowed())return false;
  const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=settings.effects;
  source.connect(gain);gain.connect(context.destination);playing.add(source);
  source.onended=()=>{playing.delete(source);source.disconnect();gain.disconnect();};
  source.start();duck(buffer.duration);return true;
 }
 function play(name){
  if(!clips[name]||!allowed())return Promise.resolve(false);
  unlock();const attempt=++attempts[name],buffer=buffers.get(name);
  // A scheduled buffer starts when a suspended context resumes; do not switch to a
  // new, locked HTMLAudio element just because resume() has not resolved yet.
  if(context&&buffer){try{return Promise.resolve(startBuffer(buffer));}catch{}}
  const clip=clips[name];clip.volume=settings.effects;
  try{clip.currentTime=0;}catch{}
  playing.add(clip);clip.onended=()=>playing.delete(clip);clip.onerror=()=>playing.delete(clip);
  return clip.play().then(()=>{duck(Number.isFinite(clip.duration)?clip.duration:1);return true;}).catch(async()=>{
   playing.delete(clip);const decoded=await prepare(name);
   if(!decoded||attempt!==attempts[name]||!allowed())return false;
   try{return startBuffer(decoded);}catch{return false;}
  });
 }
 document.addEventListener('pointerdown',unlock,{passive:true});
 document.addEventListener('click',unlock,{capture:true,passive:true});
 document.addEventListener('keydown',unlock,{passive:true});
 return {settings,play,unlock,setState(value){state=value;sync();},setHidden(value){hidden=value;sync();},setMuted(value){settings.muted=value;save();sync();},setVolume(name,value){settings[name]=Math.max(0,Math.min(1,Number(value)||0));save();sync();},get music(){return music;}};
}
