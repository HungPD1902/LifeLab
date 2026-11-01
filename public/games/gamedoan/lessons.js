'use strict';
const LESSON_VOICE = {
 cigarette:['Tàn thuốc còn nóng! Em tránh xa và báo người lớn nhé.', 'Người lớn dập bằng nước, chờ nguội hẳn.', 'Bỏ tàn thuốc đã nguội vào thùng rác kim loại.', 'Đặt thùng rác lại dưới gầm bàn. Em không tự nhặt tàn thuốc nhé.'],
 wire:['Dây điện bị hở rồi! Em tránh xa và báo người lớn nhé.', 'Người lớn ngắt nguồn điện trước.', 'Người lớn thay dây điện bị hỏng.', 'Người lớn kiểm tra an toàn trước khi dùng lại.'],
 socket:['Ổ cắm quá nhiều thiết bị rồi! Em báo người lớn nhé.', 'Người lớn ngắt điện và kiểm tra công suất.', 'Người lớn rút bớt phích cắm của các thiết bị không cần dùng, để tránh quá tải.', 'Gọn gàng rồi! Em không tự thao tác với ổ điện nhé.']
};
const unit = (p,a,b) => Math.max(0,Math.min(1,(p-a)/(b-a)));
const smooth = p => p*p*(3-2*p);
function demoGeometry(h){
 const [x,y,w,t]=h.bounds;
 return {x,y,w,t,toolX:x+w+4,toolY:y+4,view:h.id==='cigarette'?[x-13,y-4,34,25]:[x-5,y-4,Math.max(25,w+17),Math.max(24,t+9)]};
}
function lessonSceneMarkup(h){
 const {x,y,w,t,toolX,toolY,view}=demoGeometry(h);
 const clip=`<clipPath id="repair-${h.id}"><rect x="${x}" y="${y}" width="${w}" height="${t}"/></clipPath>`;
 let action='';
 if(h.id==='cigarette')action=`<image class="demo-bin" href="assets/demo/trash.svg" x="${toolX}" y="${toolY}" width="4.4" height="5.72"/><g class="demo-water" fill="#73c6ed" stroke="#3b91be" stroke-width=".12"><path d="M${x+1} ${y-1}q-1 1.8 0 1.8t0-1.8"/><path d="M${x+2.5} ${y-2}q-1 1.8 0 1.8t0-1.8"/></g><g class="demo-moving-prop"><image href="${h.sprite}" x="${x}" y="${y}" width="${w}" height="${t}" preserveAspectRatio="none"/></g>`;
 if(h.id==='socket')action=[0,1].map(i=>`<g class="demo-unplugged-plug" data-plug="${i}"><image href="assets/demo/plug.svg" width="2.2" height="2.93"/></g>`).join('');
 return `<div class="lesson-stage room-lesson demo-${h.id}" data-phase="0" role="img" aria-label="Mô phỏng người lớn xử lý: ${esc(h.title)}">
 <svg class="lesson-film" viewBox="${view.join(' ')}" aria-hidden="true"><defs>${clip}</defs>
 <image href="assets/visual/final.png" width="100" height="100" preserveAspectRatio="none"/>
 <image class="demo-clean" href="assets/visual/safe.png" width="100" height="100" preserveAspectRatio="none" clip-path="url(#repair-${h.id})"/>
 ${action}
 <g class="demo-power" transform="translate(${x-2} ${y+1})"><circle r="1.8" fill="#fff9ed" stroke="#8fb6cb" stroke-width=".2"/><path d="M0 -1v1.1m-.8-.7a1 1 0 1 0 1.6 0" fill="none" stroke="#3284b0" stroke-width=".25" stroke-linecap="round"/><path class="demo-power-check" d="m.9 1.1 .4 .4 .8-.9" stroke="#50966c" stroke-width=".25" fill="none"/></g>
 <g class="lesson-success-mark" transform="translate(${toolX+2} ${toolY+10})"><circle r="1.8" fill="#eff8ee" stroke="#7fa67b" stroke-width=".2"/><path d="m-.8 0 .6 .6 1.1-1.3" fill="none" stroke="#51804f" stroke-width=".35" stroke-linecap="round"/></g>
 </svg></div><p id="lesson-caption" class="demo-caption" hidden></p>`;
}
function renderResolution(stage,h,p){
 const {x,y,w,t,toolX,toolY}=demoGeometry(h);
 stage.querySelector('.demo-clean').style.opacity=h.id==='wire'?String(smooth(unit(p,.4,.7))):p>=.36?'1':'0';
 stage.querySelector('.demo-power').style.opacity=h.id==='cigarette'?'0':p>=.18?'1':'0';
 stage.querySelector('.demo-power-check').style.opacity=p>=.28?'1':'0';
 stage.querySelector('.lesson-success-mark').style.opacity=p>=.86?'1':'0';
 if(h.id==='cigarette'){
  const moving=stage.querySelector('.demo-moving-prop'),q=smooth(unit(p,.38,.7)),scale=1-.93*unit(p,.64,.73);
  const cx=x+w/2,cy=y+t/2,tx=toolX+2.2,ty=toolY+.8;
  moving.style.opacity=p>=.36&&p<.75?'1':'0';
  moving.setAttribute('transform',`translate(${cx+(tx-cx)*q} ${cy+(ty-cy)*q-Math.sin(q*Math.PI)*3}) scale(${scale}) translate(${-cx} ${-cy})`);
  const water=stage.querySelector('.demo-water');water.style.opacity=p>=.2&&p<.36?'1':'0';water.setAttribute('transform',`translate(0 ${unit(p,.2,.36)*2.5})`);
  const putBack=smooth(unit(p,.77,.95)),bx=toolX+(40.2-toolX)*putBack,by=toolY+(61.3-toolY)*putBack;
  stage.querySelector('.demo-bin').setAttribute('transform',`translate(${bx} ${by}) scale(${1-.2*putBack}) translate(${-toolX} ${-toolY})`);
  stage.querySelector('.lesson-success-mark').setAttribute('transform',`translate(${bx+2} ${by+7})`);
 }
 if(h.id==='socket'){
  stage.querySelectorAll('.demo-unplugged-plug').forEach((plug,i)=>{
   const start=.36+i*.08,q=smooth(unit(p,start,start+.3));
   plug.style.opacity=p>=start&&p<.83?String(1-unit(p,.72,.83)):'0';
   plug.setAttribute('transform',`translate(${x+w*.47+i*.9+q*4} ${y+t*.24-i*.6-Math.sin(q*Math.PI)*2.5+q*4}) rotate(${q*30})`);
  });
 }
}
function applyResolution(h){
 if(resolved.has(h.id))return;
 resolved.add(h.id);
 const [x,y,w,t]=h.bounds,patch=document.createElement('div');
 patch.className='repair-patch';patch.dataset.repair=h.id;
 Object.assign(patch.style,{left:x+'%',top:y+'%',width:w+'%',height:t+'%',backgroundImage:'url("assets/visual/safe.png")',backgroundSize:`${10000/w}% ${10000/t}%`,backgroundPosition:`${x/(100-w)*100}% ${y/(100-t)*100}%`});
 $('repairs').append(patch);
 if(h.id==='cigarette'){
  const bin=document.createElement('img');bin.src='assets/demo/trash.svg';bin.className='room-bin';bin.alt='';
  Object.assign(bin.style,{position:'absolute',left:'40.2%',top:'61.3%',width:'3.5%',height:'5.75%'});$('repairs').append(bin);
 }
 const button=$('objects').querySelector(`[data-id="${h.id}"]`);button.classList.add('resolved');button.setAttribute('aria-label','Đã xử lý. Xem lại: '+h.title);
 if(h.id==='cigarette')button.disabled=true;
}
function playLesson(h,complete){
 const stage=$('overlay').querySelector('.lesson-stage'),duration=Math.max(1,CONFIG.lessonDuration),ends=[.18,.36,.86,1];
 let elapsed=0,last=performance.now(),frameId=0,stopped=false,userPaused=false,hidden=document.hidden,phase=-1,voiceReady=false;
 const narrator=createLessonVoice(available=>{voiceReady=available;updateCaptions();});
 const speakPhase=()=>narrator.speak(LESSON_VOICE[h.id][Math.max(0,phase)],CONFIG.recordedNarration?`assets/audio/voice/${h.id}-${Math.max(0,phase)}.mp3`:undefined);
 function updateCaptions(){
  const caption=$('lesson-caption');if(!caption||stopped)return;
  caption.hidden=soundEnabled&&gameAudio.settings.voice>0&&voiceReady;caption.textContent=h.captions[Math.max(0,phase)];
  const button=$('lesson-voice');button.setAttribute('aria-pressed',String(soundEnabled));button.setAttribute('aria-label',soundEnabled?'Tắt thuyết minh':'Bật thuyết minh');
  button.innerHTML=`<img class="ds-icon-image" src="assets/design-system/${soundEnabled?'volume':'mute'}.svg" width="24" height="24" alt="">`;
  $('lesson-status').textContent=soundEnabled&&!voiceReady?'Thuyết minh chưa sẵn sàng; có phụ đề.':'Đồng hồ đã dừng.';
 }
 function render(){
  const p=elapsed/duration,next=p<ends[0]?0:p<ends[1]?1:p<ends[2]?2:3;
  if(next!==phase){phase=next;stage.dataset.phase=String(phase);speakPhase();updateCaptions();}
  renderResolution(stage,h,p);$('lesson-fill').style.width=Math.min(100,p*100)+'%';
 }
 function schedule(){if(!stopped&&!userPaused&&!hidden&&!frameId)frameId=requestAnimationFrame(frame);}
 function frame(now){
  frameId=0;if(stopped)return;
  const next=Math.min(duration,elapsed+Math.max(0,now-last));last=now;
  const boundary=ends[Math.max(0,phase)]*duration;
  elapsed=Math.min(next,narrator.pending?boundary-.001:boundary);
  render();if(elapsed>=duration){complete(true);return;}schedule();
 }
 function sync(restartVoice=true){
  last=performance.now();$('lesson-toggle').innerHTML=`<img class="ds-icon-image" src="assets/design-system/${userPaused?'play':'pause'}.svg" width="24" height="24" alt="">`;
  $('lesson-toggle').setAttribute('aria-label',userPaused?'Xem tiếp':'Tạm dừng');$('lesson-toggle').setAttribute('aria-pressed',String(userPaused));
  if(userPaused||hidden){cancelAnimationFrame(frameId);frameId=0;narrator.cancel();}else{if(restartVoice)speakPhase();schedule();}
 }
 const controller={stop(){stopped=true;cancelAnimationFrame(frameId);narrator.cancel();},setHidden(value){hidden=value;sync();},setSound(){if(soundEnabled&&!userPaused&&!hidden)speakPhase();else narrator.cancel();updateCaptions();}};
 $('lesson-toggle').onclick=()=>{userPaused=!userPaused;sync();};
 $('lesson-replay').onclick=()=>{narrator.cancel();elapsed=0;phase=-1;userPaused=false;last=performance.now();render();sync(false);};
 $('lesson-voice').onclick=toggleSound;
 const voicesChanged=()=>{if(!stopped&&!voiceReady&&soundEnabled&&!hidden&&!userPaused&&!narrator.pending)speakPhase();};
 window.speechSynthesis?.addEventListener('voiceschanged',voicesChanged);
 const stop=controller.stop;controller.stop=()=>{window.speechSynthesis?.removeEventListener('voiceschanged',voicesChanged);stop();};
 render();schedule();return controller;
}
