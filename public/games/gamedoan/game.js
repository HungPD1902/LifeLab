'use strict';
// All positions are percentages of the supplied Final.PNG (3089 x 2441).
const hazardText = {
 wire:{title:'Dây điện bị hở',icon:'⌁',why:'Dây điện bị hở có thể gây điện giật hoặc chập cháy.',prevention:'Tránh xa dây hỏng và báo người lớn ngắt điện, thay dây. Không tự chạm hay sửa dây điện.',hint:'Quan sát ổ điện trên tường cạnh ghế sofa.',captions:['Dây điện bị hở. Báo người lớn nhé!','Người lớn ngắt điện trước.','Người lớn thay dây điện bị hỏng.','Kiểm tra an toàn trước khi dùng lại.']},
 socket:{title:'Ổ cắm quá tải',icon:'ϟ',why:'Quá nhiều thiết bị dùng chung ổ cắm có thể làm ổ nóng lên và gây cháy.',prevention:'Báo người lớn ngắt điện và bố trí lại nguồn điện phù hợp. Không tự rút hay chạm vào ổ cắm bất thường.',hint:'Nhìn khu vực dây điện phía sau tivi và cạnh quạt.',captions:['Nhiều phích cắm chen chúc quá!','Mình báo người lớn ngắt điện trước.','Người lớn rút bớt phích cắm không cần dùng.','Ổ điện đã được sắp xếp lại.']},
 cigarette:{title:'Tàn thuốc chưa dập tắt',icon:'♨',why:'Tàn thuốc còn nóng rơi gần thảm và đồ dùng có thể gây cháy.',prevention:'Tránh xa tàn thuốc, báo người lớn xử lý và dập tắt hoàn toàn. Không tự nhặt tàn thuốc.',hint:'Quan sát mặt bàn và tấm thảm bên dưới bàn.',captions:['Có tàn thuốc. Báo người lớn nhé!','Người lớn dập bằng nước, chờ nguội hẳn.','Tàn thuốc đã nguội được bỏ vào thùng rác.','Đặt thùng rác lại dưới gầm bàn.']}
};
const CONFIG = {duration:120,penalty:5,hintPenalty:20,hintDuration:3000,lessonDuration:17000,recordedNarration:true,
 hazards:ROOM_ASSETS.hazards.map(h=>({...h,...hazardText[h.id],region:[h.bounds[0]-4,h.bounds[1]-4,h.bounds[2]+8,h.bounds[3]+8],crop:[h.bounds[0]+h.bounds[2]/2,h.bounds[1]+h.bounds[3]/2,600]})),
 normal:ROOM_ASSETS.normal
};
function styleHighlight(button,item){
  button.style.setProperty('--object-sprite',`url("${item.sprite}")`);
}
let activeObjectFeedback=null;
const warmedObjectSprites=new Set();
function warmObjectSprites(item){
 if(warmedObjectSprites.has(item.id))return;
 warmedObjectSprites.add(item.id);
 for(const src of [item.sprite,item.underlay]){const image=new Image();image.decoding='async';image.src=src;}
}
function clearObjectFeedback(){
 if(!activeObjectFeedback)return;
 clearTimeout(activeObjectFeedback.timer);
 activeObjectFeedback.nodes.forEach(node=>node.remove());
 activeObjectFeedback=null;
}
function showObjectFeedback(item){
 clearObjectFeedback();
 const [x,y,w,h]=item.bounds,art=document.querySelector('.scene-art');
 const underlay=document.createElement('img'),sprite=document.createElement('img'),label=document.createElement('div');
 underlay.src=item.underlay;underlay.className='normal-object-underlay';
 sprite.src=item.sprite;sprite.className='normal-object-lift';
 for(const node of [underlay,sprite]){
  node.alt='';node.setAttribute('aria-hidden','true');
  Object.assign(node.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
 }
 // Existing repairs stay above this temporary patch, even near the fan/cables.
 $('repairs').prepend(underlay);art.append(sprite);
 label.className='normal-object-label';label.textContent=item.title+' · Chưa phải nguy cơ';
 label.setAttribute('role','status');$('scene').append(label);
 const target=$('objects').querySelector(`[data-id="${item.id}"]`).getBoundingClientRect(),scene=$('scene').getBoundingClientRect();
 label.style.left=Math.max(12,Math.min(scene.width-label.offsetWidth-12,target.left+target.width/2-scene.left-label.offsetWidth/2))+'px';
 label.style.top=Math.max(82,Math.min(scene.height-label.offsetHeight-20,target.top-scene.top-label.offsetHeight-18))+'px';
 activeObjectFeedback={nodes:[underlay,sprite,label],timer:setTimeout(clearObjectFeedback,950)};
}
function applyHitShape(button,item){
  const id='hit-'+item.id;
  if(!document.getElementById(id)){
    const ns='http://www.w3.org/2000/svg',clip=document.createElementNS(ns,'clipPath'),path=document.createElementNS(ns,'path');
    clip.id=id;clip.setAttribute('clipPathUnits','objectBoundingBox');path.setAttribute('d',item.hitShape);clip.append(path);document.querySelector('.svg-defs defs').append(clip);
  }
  button.style.clipPath=`url(#${id})`;
}
const $ = id => document.getElementById(id);
const SAVE_KEY = 'safe-kitchen-v1';
let profile;
try { profile = JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { profile = {}; }
profile = { plays:0, bestReward:0, coins:0, learned:[], ...profile };
if (!Array.isArray(profile.learned)) profile.learned=[];
profile.bestReward=Math.max(0,Math.min(20,Number(profile.bestReward)||0));
const save=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(profile));}catch{/* The game remains playable with session-only progress. */}};
let activeLesson=null, resolved=new Set(), gameElapsed=0, wrongClicks=0;
const gameAudio=createGameAudio();
let state='intro', remaining=CONFIG.duration, found=new Set(), wrong=new Set(), hints=0, lessonTimers=[], toastTimer, runSerial=0, soundEnabled=!gameAudio.settings.muted, lastTick=performance.now(), resultData;
const mascot='<svg class="mascot" aria-hidden="true"><use href="#bear"/></svg>';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function audio(){if(soundEnabled)gameAudio.play('pop');}
function setState(next){if(next==='search')window.LearningApp?.revealGame();state=next;gameAudio.setState(next);lastTick=performance.now();const searching=next==='search';if(!searching)clearObjectFeedback();if(next!=='hint')$('hint-region').hidden=true;$('hint').disabled=!searching;$('pause').disabled=!searching;$('notebook-button').disabled=!searching;$('state-label').textContent=({intro:'Sẵn sàng khám phá',search:'Đang khám phá căn phòng',lesson:'Đang học cùng Tí · Đồng hồ đã dừng',hint:'Gợi ý của Tí · Đồng hồ đã dừng',pause:'Tạm dừng',result:'Đã kết thúc lượt chơi',review:'Xem lại kiến thức',notebook:'Sổ tay khám phá · Đồng hồ đã dừng'})[next]||'';}
const hudSnapshot={seconds:null,progress:null,hints:null};
function updateHud(){
  const seconds=Math.max(0,Math.ceil(remaining));
  if(seconds!==hudSnapshot.seconds){
    hudSnapshot.seconds=seconds;
    $('timer').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
    $('timer').parentElement.parentElement.classList.toggle('danger',seconds<=30);
  }
  const progress=`${found.size}/${CONFIG.hazards.length}`;
  if(progress!==hudSnapshot.progress){
    hudSnapshot.progress=progress;
    $('progress').innerHTML=`${found.size} <span>/ ${CONFIG.hazards.length}</span>`;
    $('notebook-count').textContent=progress;
    $('notebook-badge').textContent=String(found.size);$('notebook-badge').hidden=found.size===0;
    $('notebook-button').setAttribute('aria-label','Sổ tay khám phá, đã tìm '+found.size+' trên '+CONFIG.hazards.length+' nguy cơ');
    $('progress-dots').innerHTML=CONFIG.hazards.map((h,i)=>`<span class="${i<found.size?'found':''}"></span>`).join('');
  }
  if(hints!==hudSnapshot.hints){
    hudSnapshot.hints=hints;
    $('hint-cost').textContent='−'+CONFIG.hintPenalty+'s';
    $('hint').setAttribute('aria-label','Gợi ý, trừ '+CONFIG.hintPenalty+' giây mỗi lần');
  }
}
function mountObjects(){const container=$('objects');container.replaceChildren();[...CONFIG.normal,...CONFIG.hazards].forEach(item=>{const button=document.createElement('button');button.className='object';button.dataset.id=item.id;applyHitShape(button,item);const [x,y,w,h]=item.hitBounds||item.bounds;Object.assign(button.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});const hazard=CONFIG.hazards.includes(item);if(!hazard)warmObjectSprites(item);if(hazard)styleHighlight(button,item);button.setAttribute('aria-label',hazard?'Quan sát vật tại '+Math.round(x)+'% chiều ngang, '+Math.round(y)+'% chiều dọc':item.title);button.addEventListener('click',event=>{event.stopPropagation();if(state!=='search')return;tick();if(state!=='search')return;if(item.id==='obj-2416'&&soundEnabled)gameAudio.play('meow');if(hazard){if(found.has(item.id))audio();discover(item);}else{wrong.add(item.id);penalize(event,item);}});container.append(button);});}
function updateNotebook(){const container=$('discoveries');container.replaceChildren();CONFIG.hazards.forEach((h,i)=>{const item=document.createElement(found.has(h.id)?'button':'div');item.className='discovery '+(found.has(h.id)?'unlocked':'');item.innerHTML=`<span class="number">${found.has(h.id)?'✓':String(i+1).padStart(2,'0')}</span><span>${found.has(h.id)?esc(h.title):'Chưa khám phá'}</span>`;if(found.has(h.id))item.addEventListener('click',()=>{if(state==='search'){tick();if(state==='search')showLesson(h,true);}});container.append(item);});}
function clearLessonTimers(){lessonTimers.forEach(clearTimeout);lessonTimers=[];activeLesson?.stop();activeLesson=null;}
function showToast(message,duration=2200){clearTimeout(toastTimer);$('scene-toast').textContent=message;$('scene-toast').hidden=false;toastTimer=setTimeout(()=>{$('scene-toast').hidden=true;},duration);$('announcer').textContent=message;}
function penalize(event,item){showObjectFeedback(item);wrongClicks++;remaining=Math.max(0,remaining-CONFIG.penalty);updateHud();audio('wrong');const marker=document.createElement('span');marker.className='penalty';marker.textContent='−5s';marker.style.left=item.bounds[0]+'%';marker.style.top=item.bounds[1]+'%';$('objects').append(marker);setTimeout(()=>marker.remove(),1200);$('timer').classList.remove('shake');void $('timer').offsetWidth;$('timer').classList.add('shake');$('announcer').textContent='Đồ vật này không phải nguy cơ trong màn chơi. Trừ 5 giây.';if(remaining<=0)finish(false);}
function discover(h){const review=found.has(h.id);if(!review){found.add(h.id);const button=$('objects').querySelector(`[data-id="${h.id}"]`);button.classList.add('found');applyResolution(h);updateHud();updateNotebook();audio();}showLesson(h,review);}
function cropStyle(h){return `background-image:url("${h.sprite}");background-size:contain;background-position:center;background-repeat:no-repeat`;}
function showLesson(h,review=false){
  clearLessonTimers();setState('lesson');$('scene-toast').hidden=true;
  $('overlay').innerHTML=`<section class="modal animation-lesson" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
    <div class="lesson-head"><span class="lesson-found-pill">${review?'↺':found.size+'/'+CONFIG.hazards.length}</span><h2 id="lesson-title">${esc(h.title)}</h2></div>
    ${lessonSceneMarkup(h)}
    <div class="lesson-meter" aria-hidden="true"><span id="lesson-fill"></span></div>
    <div class="lesson-player-controls" role="group" aria-label="Điều khiển mô phỏng">
      <button id="lesson-toggle" class="ds-button ds-secondary ds-icon" aria-label="Tạm dừng" aria-pressed="false"><img class="ds-icon-image" src="assets/design-system/pause.svg" width="24" height="24" alt=""></button>
      <button id="lesson-replay" class="ds-button ds-secondary ds-icon" aria-label="Xem lại"><img class="ds-icon-image" src="assets/design-system/retry.svg" width="24" height="24" alt=""></button>
      <button id="lesson-voice" class="ds-button ds-secondary ds-icon" aria-label="Tắt thuyết minh" aria-pressed="true"><img class="ds-icon-image" src="assets/design-system/volume.svg" width="24" height="24" alt=""></button>
      <button id="skip-lesson" class="lesson-skip ds-button ds-primary" aria-label="Tớ nhớ rồi! Tiếp tục tìm đồ vật"><span class="lesson-skip-label">Tớ nhớ rồi!</span></button>
    </div>
    <div id="lesson-status" class="sr-only" role="status">Đồng hồ đã dừng</div>
  </section>`;
  focusDialog();
  const serial=runSerial;
  const complete=(completed=false)=>{
    if(serial!==runSerial||state!=='lesson')return;
    clearLessonTimers();applyResolution(h);
    if(completed&&!profile.learned.includes(h.id)){profile.learned.push(h.id);save();}
    $('overlay').replaceChildren();
    if(found.size===CONFIG.hazards.length)finish(true);
    else {setState('search');$('camera').focus({preventScroll:true});}
  };
  $('skip-lesson').onclick=()=>complete();
  activeLesson=playLesson(h,complete);
}
function hint(){if(state!=='search')return;tick();if(state!=='search')return;const h=CONFIG.hazards.find(item=>!found.has(item.id));if(!h)return;hints++;remaining=Math.max(0,remaining-CONFIG.hintPenalty);updateHud();if(remaining<=0){finish(false);return;}setState('hint');const [x,y,w,height]=h.region;Object.assign($('hint-region').style,{left:x+'%',top:y+'%',width:w+'%',height:height+'%'});$('hint-region').hidden=false;$('announcer').textContent=h.hint+' Trừ '+CONFIG.hintPenalty+' giây.';const serial=runSerial;lessonTimers.push(setTimeout(()=>{if(serial===runSerial&&state==='hint'){setState('search');}},CONFIG.hintDuration));}
function intro(){setState('intro');const replay=profile.plays>0;$('overlay').innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="intro-title">${mascot}<p class="eyebrow">CHÀO EM, TÍ ĐÂY!</p><h2 id="intro-title">Căn phòng cần một người hùng.</h2><p>Trong căn phòng có <strong>${CONFIG.hazards.length} nguy cơ gây cháy</strong>.<br>Hãy quan sát và chạm vào những tình huống nguy hiểm. Tí sẽ giúp em hiểu cách phòng tránh!</p><div class="intro-rules"><span><strong>${CONFIG.duration}s</strong>Để khám phá</span><span><strong>${CONFIG.hazards.length} nguy cơ</strong>Cần tìm thấy</span><span><strong>−${CONFIG.penalty}s</strong>Khi chạm nhầm</span></div><button id="start" class="primary ds-button ds-primary" ${replay?'':'disabled'}>${replay?'Bắt đầu khám phá →':'Đọc nhiệm vụ nhé…'}</button></section>`;focusDialog();const serial=runSerial;if(!replay)lessonTimers.push(setTimeout(()=>{if(serial===runSerial&&state==='intro'){$('start').disabled=false;$('start').textContent='Bắt đầu khám phá →';}},3000));$('start').onclick=()=>{clearLessonTimers();$('overlay').replaceChildren();setState('search');};}
function reset(){clearObjectFeedback();cameraPinch=null;pinchSequence=false;roomZoom=1;document.querySelector('.scene-art').style.width='';$('scene').classList.remove('zoomed');window.LearningApp?.revealGame();gameElapsed=0;wrongClicks=0;runSerial++;clearLessonTimers();clearTimeout(toastTimer);remaining=CONFIG.duration;found=new Set();wrong=new Set();hints=0;resultData=null;resolved.clear();$('repairs').replaceChildren();$('scene-toast').hidden=true;$('hint-region').hidden=true;document.querySelectorAll('.confetti,.penalty,.hazard-outline').forEach(n=>n.remove());mountObjects();updateHud();updateNotebook();intro();}
function pause(){
 if(state!=='search')return;tick();if(state!=='search')return;setState('pause');
 const volumeRow=(name,label)=>`<label class="volume-row" for="volume-${name}"><span>${label}</span><output id="volume-${name}-value">${Math.round(gameAudio.settings[name]*100)}%</output><input id="volume-${name}" data-volume="${name}" type="range" min="0" max="100" value="${Math.round(gameAudio.settings[name]*100)}"></label>`;
 $('overlay').innerHTML=`<section class="modal pause-menu" role="dialog" aria-modal="true" aria-labelledby="pause-title"><div class="pause-heading">${mascot}<div><h2 id="pause-title">Nghỉ một chút nhé!</h2><p>Đồng hồ đang dừng</p></div><button id="sound" class="ds-button ds-secondary ds-icon" aria-label="${soundEnabled?'Tắt':'Bật'} âm thanh" aria-pressed="${soundEnabled}"><img id="sound-icon" class="ds-icon-image" src="assets/design-system/${soundEnabled?'volume':'mute'}.svg" width="24" height="24" alt=""></button></div><div class="audio-settings">${volumeRow('music','Nhạc nền')}${volumeRow('effects','Hiệu ứng')}${volumeRow('voice','Giọng đọc')}</div><button id="resume" class="primary ds-button ds-primary">Tiếp tục chơi</button><div class="pause-actions"><button id="restart" class="ds-button ds-secondary ds-40">Chơi lại</button><button id="pause-skills" class="ds-button ds-secondary ds-40"><img class="ds-icon-image" src="assets/design-system/back.svg" width="24" height="24" alt="">Kỹ năng</button></div></section>`;
 focusDialog();$('sound').onclick=toggleSound;$('resume').onclick=()=>{$('overlay').replaceChildren();setState('search');};$('restart').onclick=reset;$('pause-skills').onclick=()=>window.LearningApp?.navigate('fire');
 $('overlay').querySelectorAll('[data-volume]').forEach(input=>{input.oninput=()=>{const name=input.dataset.volume;gameAudio.setVolume(name,Number(input.value)/100);$('volume-'+name+'-value').textContent=input.value+'%';};input.onchange=()=>{if(input.dataset.volume==='effects'&&soundEnabled)gameAudio.play('pop');};});
}
function finish(won){clearLessonTimers();setState('result');remaining=Math.max(0,remaining);updateHud();const seconds=Math.ceil(remaining);const stars=won?(remaining>=70?3:remaining>=30?2:1):0;const reward=won?({1:10,2:15,3:20})[stars]:5;const added=Math.max(0,reward-profile.bestReward);const coin=won&&profile.bestReward>=20?1:0;profile.bestReward=Math.max(profile.bestReward,reward);profile.coins+=coin;profile.plays++;save();resultData={won,seconds,stars,added,coin,elapsed:gameElapsed,mistakes:wrongClicks};showResult();if(won){audio('correct');for(let i=0;i<35;i++){const c=document.createElement('i');c.className='confetti';c.style.left=Math.random()*100+'%';c.style.background=['#ffc969','#e98757','#83b78d','#fff5cc'][i%4];c.style.animationDelay=Math.random()*.8+'s';$('scene').append(c);setTimeout(()=>c.remove(),4000);}}}
function showResult(){if(window.LearningApp){window.LearningApp.showGameResult(resultData);return;}setState('result');const r=resultData;$('overlay').innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="result-title">${mascot}<p class="eyebrow">${r.won?'NGƯỜI HÙNG NHỎ CỦA CĂN BẾP':'MỖI LẦN CHƠI, MỘT TIẾN BỘ'}</p><h2 id="result-title">${r.won?'Em làm tốt lắm!':'Mình thử thêm lần nữa nhé!'}</h2>${r.won?`<div class="stars" aria-label="${r.stars} sao">${'★'.repeat(r.stars)}<span>${'☆'.repeat(3-r.stars)}</span></div>`:'<p>Hết giờ rồi! Em đã tìm được '+found.size+'/'+CONFIG.hazards.length+' nguy cơ. Những bí mật còn lại đang đợi em khám phá.</p>'}<div class="result-stats"><div><strong>${found.size}/${CONFIG.hazards.length}</strong><small>Nguy cơ phát hiện</small></div><div><strong>${r.seconds}s</strong><small>Thời gian còn lại</small></div></div><div class="reward">${r.coin?'＋1 xu cho Tí':'＋'+r.added+' EXP cho Tí'}<small>EXP của bài: ${profile.bestReward}/20${r.added===0?' · Em đã nhận phần thưởng thành tích này':''}</small></div><button id="replay" class="primary ds-button ds-primary">Chơi lại · Tinh mắt hơn nữa →</button><div class="modal-actions"><button id="review" class="secondary ds-button ds-secondary">▤ Xem lại kiến thức</button><button id="next" class="secondary ds-button ds-secondary">Bài tiếp theo →</button></div></section>`;focusDialog();$('replay').onclick=reset;$('review').onclick=showReview;$('next').onclick=()=>showToast('Em đã có thể học bài tiếp theo. Prototype hiện có một màn bếp; các phòng khác sẽ được bổ sung.',3500);}
function showReview(){window.LearningApp?.revealGame();setState('review');const discovered=CONFIG.hazards.filter(h=>found.has(h.id));const mistaken=CONFIG.normal.filter(n=>wrong.has(n.id));$('overlay').innerHTML=`<section class="modal review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title"><p class="eyebrow">SỔ TAY CỦA NGƯỜI HÙNG NHỎ</p><h2 id="review-title">Những điều em đã học</h2>${discovered.length?discovered.map(h=>`<article class="review-item"><div class="review-photo" style="${cropStyle(h)}" role="img" aria-label="${esc(h.title)}"></div><h3>✓ ${esc(h.title)}</h3><p>${esc(h.why)}</p><p><strong>Phòng tránh:</strong> ${esc(h.prevention)}</p></article>`).join(''):'<p>Chưa có nguy cơ nào được phát hiện. Hãy thử lại để mở những bài học mới nhé!</p>'}${mistaken.length?'<p class="eyebrow">NHỮNG ĐỒ VẬT EM ĐÃ CHẠM NHẦM</p>'+mistaken.map(n=>`<article class="review-item"><h3>${esc(n.title)}</h3><p>${esc(n.reason)}</p></article>`).join(''):''}<button id="back-result" class="primary ds-button ds-primary">Quay lại kết quả</button></section>`;focusDialog();$('back-result').onclick=showResult;}
function showNotebook(){if(state!=='search')return;tick();if(state!=='search')return;setState('notebook');const items=CONFIG.hazards.filter(h=>found.has(h.id));$('overlay').innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="notebook-title"><p class="eyebrow">SỔ TAY KHÁM PHÁ</p><h2 id="notebook-title">Những nguy cơ em đã tìm</h2>${items.length?items.map(h=>`<button class="notebook-entry ds-button ds-secondary ds-40" data-lesson="${h.id}">✓ ${esc(h.title)} →</button>`).join(''):'<p>Chạm vào những tình huống nguy hiểm trong căn phòng để mở bài học nhé!</p>'}<p>Đồng hồ đang dừng. Chạm một mục để ôn lại cùng Tí.</p><button id="close-notebook" class="primary ds-button ds-primary">Tiếp tục tìm →</button></section>`;focusDialog();$('close-notebook').onclick=()=>{$('overlay').replaceChildren();setState('search');};$('overlay').querySelectorAll('[data-lesson]').forEach(button=>{button.onclick=()=>showLesson(CONFIG.hazards.find(h=>h.id===button.dataset.lesson),true);});}
$('notebook-button').onclick=showNotebook;
function focusDialog(){const modal=$('overlay').querySelector('.modal');if(modal){modal.tabIndex=-1;modal.focus({preventScroll:true});}}
function tick(){const now=performance.now();if(state==='search'){const elapsed=Math.min(remaining,(now-lastTick)/1000);gameElapsed+=elapsed;remaining=Math.max(0,remaining-elapsed);updateHud();if(remaining<=0)finish(false);}lastTick=now;}
function toggleSound(){
 soundEnabled=!soundEnabled;
 gameAudio.setMuted(!soundEnabled);
 $('sound')?.setAttribute('aria-label',soundEnabled?'Tắt âm thanh':'Bật âm thanh');
 $('sound')?.setAttribute('aria-pressed',String(soundEnabled));
 if($('sound-icon'))$('sound-icon').src='assets/design-system/'+(soundEnabled?'volume':'mute')+'.svg';
 activeLesson?.setSound();
}
$('hint').onclick=hint;$('pause').onclick=pause;
document.addEventListener('visibilitychange',()=>{gameAudio.setHidden(document.hidden);activeLesson?.setHidden(document.hidden);if(document.hidden&&state==='search')pause();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(state==='search')pause();else if(state==='pause')$('resume').click();}if(e.key==='Tab'&&$('overlay').children.length){const buttons=[...$('overlay').querySelectorAll('button:not(:disabled),[href]')];if(!buttons.length){e.preventDefault();return;}const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('overlay').querySelector('.modal'))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!$('overlay').contains(document.activeElement))){e.preventDefault();first.focus();}}});
$('target-count').textContent=CONFIG.hazards.length+' nguy cơ gây cháy';
let roomZoom=1;
function centerCamera(){const camera=$('camera');camera.scrollLeft=(camera.scrollWidth-camera.clientWidth)/2;camera.scrollTop=(camera.scrollHeight-camera.clientHeight)/2;document.querySelector('.camera-tip').textContent='Kéo để di chuyển · Chụm/tách để zoom';}
function setRoomZoom(value,clientX,clientY){
 const camera=$('camera'),art=document.querySelector('.scene-art'),before=art.getBoundingClientRect(),viewport=camera.getBoundingClientRect();
 const anchorX=clientX??viewport.left+viewport.width/2,anchorY=clientY??viewport.top+viewport.height/2;
 const x=(anchorX-before.left)/before.width,y=(anchorY-before.top)/before.height;
 roomZoom=Math.max(1,Math.min(3,value));
 $('scene').classList.toggle('zoomed',roomZoom>1);
 const overviewWidth=camera.clientWidth*(camera.clientWidth>camera.clientHeight?.62:1);
 art.style.width=roomZoom===1?'':overviewWidth*roomZoom+'px';
 camera.scrollLeft=art.offsetLeft+x*art.offsetWidth-(anchorX-viewport.left);
 camera.scrollTop=art.offsetTop+y*art.offsetHeight-(anchorY-viewport.top);

}
function zoomRoom(value){setRoomZoom(value?2.4:1);centerCamera();}
$('camera').addEventListener('wheel',event=>{
 if(state!=='search')return;
 event.preventDefault();
 const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?$('camera').clientHeight:1);
 setRoomZoom(roomZoom*Math.exp(-Math.max(-100,Math.min(100,delta))*.002),event.clientX,event.clientY);
},{passive:false});
// One finger keeps native scrolling. Only two-finger gestures are intercepted.
let cameraPinch=null,pinchSequence=false;
function touchPair(touches){const a=touches[0],b=touches[1];return {x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2,distance:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)};}
$('camera').addEventListener('touchstart',event=>{
 if(state!=='search'||event.touches.length!==2)return;
 event.preventDefault();endCameraDrag();
 const pair=touchPair(event.touches),rect=document.querySelector('.scene-art').getBoundingClientRect();
 cameraPinch={zoom:roomZoom,distance:Math.max(1,pair.distance),x:(pair.x-rect.left)/rect.width,y:(pair.y-rect.top)/rect.height};
 pinchSequence=true;ignoreCameraClick=true;ignoreTouchClick=true;
},{passive:false});
$('camera').addEventListener('touchmove',event=>{
 if(!pinchSequence)return;
 event.preventDefault();
 if(!cameraPinch||event.touches.length!==2||state!=='search')return;
 const pair=touchPair(event.touches),camera=$('camera'),art=document.querySelector('.scene-art'),rect=camera.getBoundingClientRect();
 setRoomZoom(cameraPinch.zoom*pair.distance/cameraPinch.distance,pair.x,pair.y);
 camera.scrollLeft=art.offsetLeft+cameraPinch.x*art.offsetWidth-(pair.x-rect.left);
 camera.scrollTop=art.offsetTop+cameraPinch.y*art.offsetHeight-(pair.y-rect.top);
},{passive:false});
function finishPinch(event){if(!pinchSequence)return;cameraPinch=null;ignoreCameraClick=true;ignoreTouchClick=true;if(!event.touches.length)pinchSequence=false;}
$('camera').addEventListener('touchend',finishPinch,{passive:true});
$('camera').addEventListener('touchcancel',finishPinch,{passive:true});
$('camera').addEventListener('dblclick',event=>{if(state==='search'&&!event.target.closest('.object')){event.preventDefault();zoomRoom(!$('scene').classList.contains('zoomed'));}});
document.querySelector('.mission-target').textContent='Tìm '+CONFIG.hazards.length+' nguy cơ';
new ResizeObserver(()=>{if(roomZoom===1)centerCamera();else setRoomZoom(roomZoom);}).observe($('camera'));
// Touch uses native scrolling; only mouse/pen dragging writes scroll positions.
let cameraDrag=null,ignoreCameraClick=false,ignoreTouchClick=false;
document.addEventListener('pointerdown',()=>{ignoreTouchClick=false;},true);
document.addEventListener('click',event=>{if(ignoreTouchClick&&event.detail!==0){ignoreTouchClick=false;event.preventDefault();event.stopPropagation();}},true);
$('camera').addEventListener('pointerdown',event=>{if(!pinchSequence&&event.isPrimary&&event.button===0&&state==='search'){endCameraDrag();ignoreCameraClick=false;cameraDrag={id:event.pointerId,type:event.pointerType,target:event.target,x:event.clientX,y:event.clientY,left:$('camera').scrollLeft,top:$('camera').scrollTop,moved:false};}});
document.addEventListener('pointermove',event=>{
  if(!cameraDrag||event.pointerId!==cameraDrag.id)return;
  if(state!=='search'){endCameraDrag();return;}
  const dx=event.clientX-cameraDrag.x,dy=event.clientY-cameraDrag.y;
  if(cameraDrag.type==='touch'){
    // Observe the tap threshold without blocking the browser's scrolling thread.
    if(Math.hypot(dx,dy)>6)cameraDrag.moved=true;
    return;
  }
  if(!(event.buttons&1)){endCameraDrag();return;}
  if(Math.hypot(dx,dy)>6&&!cameraDrag.moved){cameraDrag.moved=true;$('camera').setPointerCapture(event.pointerId);$('camera').classList.add('dragging');}
  if(cameraDrag.moved){$('camera').scrollLeft=cameraDrag.left-dx;$('camera').scrollTop=cameraDrag.top-dy;}
},{passive:true});
function endCameraDrag(event){
  if(!cameraDrag||(event?.pointerId!==undefined&&event.pointerId!==cameraDrag.id))return;
  const drag=cameraDrag;
  cameraDrag=null;
  const cancelled=event?.type==='pointercancel';
  if(drag.moved||cancelled)ignoreCameraClick=true;
  $('camera').classList.remove('dragging');
  if(drag.moved&&$('camera').hasPointerCapture(drag.id))$('camera').releasePointerCapture(drag.id);
  // Native taps deliver one click; a swipe/cancel must never select an object.
  if(drag.type==='touch'&&(drag.moved||cancelled))ignoreTouchClick=true;
}
document.addEventListener('pointerup',endCameraDrag,true);
document.addEventListener('pointercancel',endCameraDrag,true);
$('camera').addEventListener('lostpointercapture',endCameraDrag);
window.addEventListener('blur',()=>endCameraDrag());
document.addEventListener('visibilitychange',()=>{if(document.hidden)endCameraDrag();});
$('camera').addEventListener('click',event=>{if(ignoreCameraClick&&event.detail!==0){ignoreCameraClick=false;event.preventDefault();event.stopPropagation();}},true);
new MutationObserver(()=>{if(state==='intro')centerCamera();}).observe($('overlay'),{childList:true});
new MutationObserver(()=>{if(!$('hint-region').hidden){zoomRoom(true);const region=$('hint-region');const camera=$('camera');camera.scrollTo({left:region.offsetLeft+region.offsetWidth/2-camera.clientWidth/2,top:region.offsetTop+region.offsetHeight/2-camera.clientHeight/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}).observe($('hint-region'),{attributes:true,attributeFilter:['hidden']});
setInterval(tick,100);reset();
