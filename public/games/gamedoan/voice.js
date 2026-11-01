'use strict';
// Local Google Vietnamese recordings are preferred; browser voices are a fallback.
function createLessonVoice(onAvailability){
 const synth=window.speechSynthesis;
 const player=new Audio();
 let utterance=null,recording=null,serial=0,timer=0,pending=false,available=false;
 function releaseRecording(){if(!recording)return;recording.onplaying=recording.onended=recording.onerror=null;recording.pause();recording=null;}
 function cancel(){serial++;clearTimeout(timer);pending=false;utterance=null;releaseRecording();synth?.cancel();}
 function speak(text,clipPath){
  cancel();
  if(!soundEnabled||gameAudio.settings.voice===0){onAvailability(false);return;}
  const current=serial;
  let fallbackStarted=false;
  const finish=()=>{if(serial!==current)return;pending=false;clearTimeout(timer);utterance=null;releaseRecording();};
  const unavailable=()=>{if(serial!==current)return;cancel();available=false;onAvailability(false);};
  const started=()=>{if(serial!==current)return;clearTimeout(timer);timer=setTimeout(unavailable,18000);available=true;onAvailability(true);};
  function browserVoice(){
   if(serial!==current||fallbackStarted)return;fallbackStarted=true;clearTimeout(timer);releaseRecording();
   if(!synth||!window.SpeechSynthesisUtterance){available=false;onAvailability(false);finish();return;}
   const voices=synth.getVoices(),vietnamese=voices.filter(v=>/^vi(?:-|_|$)/i.test(v.lang));
   const voice=vietnamese.map(v=>({voice:v,score:(/natural|neural|enhanced|premium/i.test(v.name)?8:0)+(/google/i.test(v.name)?4:0)+(/hoai.?my|linh|female/i.test(v.name)?2:0)})).sort((a,b)=>b.score-a.score)[0]?.voice;
   if(voices.length&&!voice){available=false;onAvailability(false);finish();return;}
   utterance=new SpeechSynthesisUtterance(text);utterance.lang='vi-VN';utterance.rate=1.14;utterance.pitch=1.06;utterance.volume=gameAudio.settings.voice;
   if(voice)utterance.voice=voice;
   pending=true;utterance.onstart=started;utterance.onend=finish;
   utterance.onerror=event=>{if(serial!==current)return;if(!['canceled','interrupted'].includes(event.error)){available=false;onAvailability(false);}finish();};
   timer=setTimeout(unavailable,3000);
   try{synth.resume();synth.speak(utterance);}catch{unavailable();}
  }
  if(!clipPath){browserVoice();return;}
  recording=player;recording.src=clipPath;recording.preload='auto';recording.volume=gameAudio.settings.voice;
  pending=true;recording.onplaying=started;recording.onended=finish;recording.onerror=browserVoice;
  timer=setTimeout(browserVoice,3000);
  recording.play().catch(browserVoice);
 }
 return {speak,cancel,get pending(){return pending;},get available(){return available;}};
}
