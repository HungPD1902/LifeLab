'use strict';

// Screen navigation is separate from the kitchen's camera and animation player.
window.LearningApp = (() => {
  const root = $('learning-app');
  const courseKey = 'safe-kitchen-course-v1';
  const lessonNames = ['Nhận biết', 'Kỹ năng thoát hiểm cơ bản', 'Xử lý tình huống', 'Kiểm tra'];
  const paths = {
    back:'M15 18l-6-6 6-6M9 12h12', arrow:'M5 12h14m-5-5 5 5-5 5',
    chevron:'m9 6 6 6-6 6', home:'m3 10 9-7 9 7v10H3zM9 20v-7h6v7',
    shield:'m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z',
    heart:'M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-6 6 8 16 8 16S26 11 20 5z',
    people:'M3 21v-3c0-5 12-5 12 0v3M17 13c4 0 5 2 5 5v3M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M17 4a3 3 0 0 1 0 6',
    flame:'M12 2c2 7 7 6 7 13a7 7 0 0 1-14 0c0-3 2-5 4-7-1 5 3 5 3 1z',
    book:'M12 5v16M12 6C9 3 5 3 2 5v14c3-2 7-2 10 1 3-3 7-3 10-1V5c-3-2-7-2-10 1z',
    user:'M4 21v-3c0-6 16-6 16 0v3M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
    check:'m5 12 4 4L19 6', checked:'M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M7 11l4 4L21 3',
    lock:'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4M12 14v3',
    play:'m8 4 12 8-12 8z', search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',
    bookmark:'M6 3h12v18l-6-4-6 4z', clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 4v5l3 2',
    gift:'M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9C3 9 4 1 9 3c2 1 3 6 3 6s1-5 3-6c5-2 6 6-3 6',
    bolt:'m13 2-9 12h7l-1 8 10-13h-7z', chart:'M4 21V3M4 21h17M7 15l5-5 4 3 5-7',
    trophy:'M7 3h10v7c0 6-10 6-10 0zM7 5H3v3c0 4 4 4 4 4M17 5h4v3c0 4-4 4-4 4M12 15v6M8 21h8',
    replay:'M4 9a9 9 0 1 1 0 7M4 3v6h6', exit:'M10 3H3v18h7M9 12h12m-5-5 5 5-5 5'
  };
  const icon = name => `<svg class="learn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`;
  const round = name => `<span class="learn-round-icon">${icon(name)}</span>`;
  const meter = value => `<div class="learn-progress" role="progressbar" aria-label="Tiến độ học" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><span style="width:${value}%"></span></div>`;
  let course;
  try { course = JSON.parse(localStorage.getItem(courseKey)); } catch { /* Session-only fallback. */ }
  if (!course || typeof course !== 'object' || Array.isArray(course)) course = {};
  course.completed = [...new Set((Array.isArray(course.completed) ? course.completed : []).filter(n => Number.isInteger(n) && n >= 1 && n <= 4))];
  course.bookmarked = course.bookmarked === true;
  course.gameBestScore = Math.max(0, Math.min(100, Number(course.gameBestScore) || 0));
  course.quizBestReward = Math.max(0, Math.min(20, Number(course.quizBestReward) || 0));
  let route = 'library', currentResult = null, readingPage = 0, readingLesson = 1;
  let quizIndex = 0, quizAnswers = [], quizStarted = 0, quizFinished = false, comingTitle = '';
  const persist = () => { try { localStorage.setItem(courseKey, JSON.stringify(course)); } catch { /* Keep the UI usable without storage. */ } };
  const progress = () => Math.round(course.completed.length / 4 * 100);
  const nextLesson = () => [1, 2, 3, 4].find(n => !course.completed.includes(n)) || 4;
  const unlocked = n => n <= nextLesson() || course.completed.includes(n);
  const completeLesson = n => { if (!course.completed.includes(n)) course.completed.push(n); persist(); };
  const action = (name, text, secondary = false) => `<button class="${secondary ? 'learn-secondary ds-button ds-secondary' : 'learn-primary ds-button ds-primary'}" data-action="${name}">${text}</button>`;
  const clockText = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const header = (title, back = 'library', right = '', subtitle = '') => `<header class="learn-header"><button class="learn-icon-button" data-route="${back}" aria-label="Quay lại">${icon('back')}</button>${subtitle ? `<div class="header-label"><small>${subtitle}</small><h1 tabindex="-1">${title}</h1></div>` : `<h1 tabindex="-1">${title}</h1>`}${right || '<span class="learn-icon-button" aria-hidden="true"></span>'}</header>`;
  const nav = active => `<nav class="learn-bottom" aria-label="Điều hướng chính">${[['home','home','Trang đầu'],['library','shield','Kỹ năng'],['saved','book','Đã lưu'],['profile','user','Của em']].map(([name,glyph,label])=>`<button data-route="${name}" ${active === name ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${label}</span></button>`).join('')}</nav>`;
  const frame = (head, content, actions = '', bottom = '') => `${head}<div class="learn-content">${content}</div>${actions ? `<div class="learn-actions">${actions}</div>` : ''}${bottom}`;
  const fireHero = label => `<div class="learn-hero"><img src="assets/visual/final.png" alt="Căn phòng trong trò chơi nhận biết nguy cơ cháy"><div>${round('flame')}<span>${label}</span></div></div>`;
  const skillCard = (title, description, percent, status, available = false) => `<button class="learn-skill" ${available ? 'data-route="fire"' : `data-coming="${esc(title)}"`}><h3>${title}</h3><p>${description}</p><div class="learn-inline-progress">${meter(percent)}<span class="learn-muted">${percent}%</span><span class="learn-badge">${status}</span></div>${icon('chevron')}</button>`;
  const continueCard = () => `<div class="learn-continue">${round('flame')}<div><small>${progress() ? 'ĐANG HỌC' : 'CÙNG KHÁM PHÁ'}</small><strong>An toàn khi có cháy</strong><div class="learn-inline-progress">${meter(progress())}<span>${progress()}%</span></div></div><button class="learn-small-button ds-button ds-primary ds-32" data-route="fire">${progress() ? 'Tiếp tục' : 'Bắt đầu'}</button></div>`;

  function library() {
    const categories = [['home','Tự lập'],['shield','An toàn'],['heart','Sức khỏe'],['people','Xã hội']];
    return frame(header('Thư viện','home'), `<div class="learn-categories">${categories.map(([glyph,title])=>`<button class="learn-category" ${title === 'An toàn' ? 'data-route="safety"' : `data-coming="${title}"`}><span class="learn-category-top">${round(glyph)}${icon('chevron')}</span><strong>${title}</strong><span class="learn-muted">${title === 'An toàn' ? '1 kỹ năng · 4 bài học' : 'Sắp có kỹ năng mới'}</span>${meter(title === 'An toàn' ? progress() : 0)}</button>`).join('')}</div><section><div class="learn-section-title"><h2>Gợi ý cho bạn</h2><button class="learn-text-button" data-route="safety">Xem tất cả</button></div><div class="learn-recommendations"><button class="learn-recommendation" data-route="fire">${round('flame')}<h3>An toàn khi có cháy</h3><p>Nhìn ra nguy cơ, cùng Tí giữ căn phòng an toàn.</p><footer><span>${progress() ? progress()+'% đã học' : 'Khám phá ngay'}</span>→</footer></button><button class="learn-recommendation" data-action="escape-detail">${round('exit')}<h3>Thoát hiểm an toàn</h3><p>Học cách tìm lối ra và nhờ người lớn giúp đỡ.</p><footer><span>Bài 2 · An toàn</span>→</footer></button></div></section>${continueCard()}`, '', nav('library'));
  }
  function safety() {
    return frame(header('An toàn','library',`<button class="learn-icon-button" data-action="search" aria-label="Tìm kỹ năng">${icon('search')}</button>`), `<section class="learn-summary"><div class="learn-summary-head">${round('shield')}<div><h2>An toàn</h2><p>Nhận biết nguy hiểm và biết cách xử lý trong các tình huống thường gặp.</p></div></div>${meter(progress())}<p class="learn-muted">${course.completed.length}/4 bài học đã hoàn thành</p></section><section><h2 style="margin-bottom:10px">Danh sách kỹ năng</h2><div id="skill-search" class="learn-search" hidden><label class="sr-only" for="skill-query">Tên kỹ năng</label><input id="skill-query" type="search" placeholder="Tìm kỹ năng…" autocomplete="off"></div><div class="learn-skill-list">${skillCard('An toàn khi có cháy','Nhận biết và xử lý tình huống cháy nổ',progress(),progress() === 100 ? 'Hoàn thành' : progress() ? 'Đang học' : 'Chưa học',true)}${skillCard('An toàn khi ở nhà một mình','Kỹ năng tự bảo vệ khi ở nhà',0,'Sắp có')}${skillCard('An toàn giao thông','Quy tắc an toàn khi tham gia giao thông',0,'Sắp có')}${skillCard('An toàn trên Internet','Bảo vệ bản thân trên không gian mạng',0,'Sắp có')}</div><p id="skill-no-results" class="learn-muted" hidden>Chưa tìm thấy kỹ năng phù hợp.</p></section>`, '', nav('library'));
  }
  function detail() {
    const current = nextLesson();
    const outcomes = ['Nhận biết nguy cơ cháy','Biết cách xử lý khi phát hiện nguy cơ','Biết cách tìm lối thoát hiểm','Biết cách nhờ người lớn trợ giúp'];
    return frame(header('An toàn khi có cháy','safety',`<button class="learn-icon-button" data-action="bookmark" aria-label="${course.bookmarked ? 'Bỏ lưu kỹ năng' : 'Lưu kỹ năng'}" aria-pressed="${course.bookmarked}">${icon('bookmark')}</button>`,'Kỹ năng'), `<section>${fireHero('AN TOÀN KHI CÓ CHÁY')}<p class="learn-description" style="margin-top:10px">Luyện nhận biết nguy hiểm, tìm lối thoát và gọi trợ giúp an toàn qua các tình huống trong game.</p><div class="learn-course-progress">${meter(progress())}<span>${course.completed.length}/4 bài</span></div></section><section><h2>Bạn sẽ học được</h2><ul class="learn-outcomes">${outcomes.map(text=>`<li>${icon('checked')}${text}</li>`).join('')}</ul></section><section><h2>Bài học</h2><div class="learn-lessons">${lessonNames.map((name,index)=>{const n=index+1,done=course.completed.includes(n),locked=!unlocked(n);return `<button class="learn-lesson-row ${done ? 'done' : n === current ? 'current' : ''}" data-lesson="${n}" ${locked ? 'disabled' : ''}><span class="learn-lesson-number">${done ? '✓' : n}</span><span><strong>${name}</strong><small>${done ? 'Đã hoàn thành' : locked ? 'Hoàn thành bài trước để mở' : 'Sẵn sàng học'}</small></span>${icon(done ? 'checked' : locked ? 'lock' : 'play')}</button>`;}).join('')}</div></section>`, action('start-lesson',progress() === 100 ? 'Ôn lại kỹ năng' : progress() ? 'Tiếp tục học' : 'Bắt đầu học'));
  }
  function briefing() {
    return frame(header('Xử lý tình huống','fire','','Bài 3'), `${fireHero('CÙNG TÍ KHÁM PHÁ CĂN PHÒNG')}<section><h2>${icon('checked')} Mục tiêu</h2><p class="learn-description" style="margin-top:7px">Tìm 3 nguy cơ gây cháy trong căn phòng và quan sát cách người lớn xử lý an toàn.</p></section><section class="learn-instructions"><h2>CÁCH CHƠI</h2><ol><li>Quan sát, kéo hoặc vuốt để khám phá.</li><li>Chạm vào đồ vật có nguy cơ gây cháy.</li><li>Xem hoạt cảnh giải thích và xử lý.</li><li>Tiếp tục tìm đủ 3 nguy cơ.</li></ol><p class="learn-muted" style="margin-top:12px">Chạm nhầm trừ 5 giây. Đồng hồ dừng khi xem hoạt cảnh.</p></section><section><h2 style="font-size:10px;letter-spacing:.7px;color:#7b8574">THÔNG TIN TRÒ CHƠI</h2><div class="learn-game-meta"><div>${icon('clock')} 2 phút<small>Thời gian</small></div><div>●●○<small>Độ khó: Vừa</small></div><div>Đến +20 EXP<small>Phần thưởng · 1–3 sao</small></div></div></section>`, action('play-game','Bắt đầu'));
  }

  const escapeCards = [
    ['exit','Cùng người lớn tìm lối ra','Cùng gia đình tìm hai lối ra an toàn và tập trước cách thoát hiểm. Khi có cháy, đi theo lối thoát an toàn; dùng cầu thang bộ, không dùng thang máy.'],
    ['shield','Tránh khói, ra ngoài an toàn','Nếu có khói trên đường thoát, hạ thấp người khi di chuyển tới lối ra an toàn. Không trốn trong tủ hay dưới giường. Nếu lối ra bị chặn, tìm lối khác và gọi trợ giúp.'],
    ['people','Đến điểm hẹn, ở ngoài','Ra điểm hẹn bên ngoài đã thống nhất với gia đình. Báo ngay cho người lớn để gọi cứu hỏa. Không quay vào nhà lấy đồ chơi hay bất kỳ món đồ nào.']
  ];
  function reading() {
    const count = readingLesson === 1 ? CONFIG.hazards.length : escapeCards.length;
    const h = CONFIG.hazards[readingPage], card = escapeCards[readingPage];
    const body = readingLesson === 1 ? `<div class="learn-reading-photo" style="${cropStyle(h)}" role="img" aria-label="${esc(h.title)}"></div><h2>${esc(h.title)}</h2><p>${esc(h.why)}</p><p style="margin-top:12px"><strong>Cùng Tí ghi nhớ:</strong> ${esc(h.prevention)}</p>` : `<div class="learn-reading-art">${icon(card[0])}</div><h2>${card[1]}</h2><p>${card[2]}</p>`;
    return frame(header(lessonNames[readingLesson-1],'fire','',`Bài ${readingLesson}`), `<section class="learn-reading-card">${body}</section><div>${meter(Math.round((readingPage+1)/count*100))}<p class="learn-reading-count">${readingPage+1}/${count} điều cần nhớ</p></div>`, action('reading-next',readingPage === count-1 ? 'Tớ nhớ rồi! Hoàn thành bài học ✓' : 'Tiếp tục →')+(readingPage ? action('reading-prev','← Xem điều trước',true) : ''));
  }

  const questions = [
    ['Ổ cắm đang dùng quá nhiều thiết bị. Em làm gì?', ['Báo người lớn kiểm tra và bố trí lại nguồn điện','Tự rút phích cắm ở ổ điện bất thường'],0,'Không chạm vào ổ điện bất thường; nhờ người lớn kiểm tra và xử lý.'],
    ['Thấy dây điện hỏng, em nên…',['Chạm vào dây để kiểm tra','Tránh xa và báo người lớn'],1,'Không sờ hay tự sửa dây hỏng. Báo người lớn ngắt điện và thay dây.'],
    ['Thấy tàn thuốc trên thảm, em nên…',['Tự nhặt tàn thuốc lên','Tránh xa và báo người lớn xử lý'],1,'Tàn thuốc có thể còn nóng; báo người lớn xử lý và dập tắt hoàn toàn.'],
    ['Khi thoát khỏi nhà đang cháy, em dùng…',['Cầu thang bộ theo lối thoát an toàn','Thang máy cho nhanh'],0,'Dùng cầu thang bộ, không dùng thang máy khi có cháy.'],
    ['Đã ra ngoài an toàn nhưng quên đồ chơi. Em…',['Quay vào lấy đồ chơi','Ở điểm hẹn bên ngoài và báo người lớn'],1,'Ở ngoài và không quay vào nhà đang cháy vì bất kỳ món đồ nào.']
  ];
  function quiz() {
    const q = questions[quizIndex], answered = quizAnswers.length > quizIndex, chosen = quizAnswers[quizIndex];
    return frame(header('Kiểm tra kỹ năng','fire','','Bài 4'), `<div>${meter(Math.round(quizIndex/questions.length*100))}<p class="learn-reading-count">Câu ${quizIndex+1}/${questions.length}</p></div><section><h2 style="font-size:19px">${q[0]}</h2><div class="learn-quiz-answers">${q[1].map((text,i)=>`<button data-answer="${i}" ${answered ? 'disabled' : ''} class="${answered && i === q[2] ? 'correct' : answered && i === chosen ? 'chosen' : ''}">${text}${answered && i === q[2] ? ' ✓' : ''}</button>`).join('')}</div></section>${answered ? `<p class="learn-feedback" role="status">${chosen === q[2] ? 'Đúng rồi! ' : 'Cùng Tí ghi nhớ nhé: '}${q[3]}</p>` : '<p class="learn-muted">Chọn một hành động em thấy an toàn nhất.</p>'}`, answered ? action('quiz-next',quizIndex === questions.length-1 ? 'Xem kết quả' : 'Câu tiếp theo →') : '');
  }
  function resultScreen() {
    const r = currentResult;
    if (!r) return detail();
    const pass = r.completed;
    return frame(header('Kết quả','fire'), `<section class="learn-result"><div class="learn-score-label">Điểm của bạn</div><strong class="learn-score">${r.score}</strong><p>${icon('trophy')} Điểm tốt nhất: ${r.best}/100</p><p>${pass ? `Bạn đã hoàn thành Bài ${r.lesson}: ${lessonNames[r.lesson-1]}` : 'Mỗi lần thử, mình lại tiến bộ thêm một chút!'}</p></section><div class="learn-stats"><div><strong>${r.correct}/${r.total}</strong><small>${r.kind === 'game' ? 'Nguy cơ tìm thấy' : 'Câu đúng'}</small></div><div><strong>${r.mistakes}</strong><small>${r.kind === 'game' ? 'Lần chạm nhầm' : 'Câu chưa đúng'}</small></div><div><strong>${clockText(r.elapsed)}</strong><small>Thời gian chơi</small></div></div><div class="learn-result-body"><section><h2>Kết quả học tập</h2><div class="learn-result-outcomes"><p>${icon(pass ? 'checked' : 'book')}${pass ? 'Hoàn thành '+lessonNames[r.lesson-1].toLowerCase()+'.' : 'Cùng ôn lại và thử thêm lần nữa nhé.'}</p><p>${icon('shield')}${r.kind === 'game' ? 'Nhận biết nguy cơ và quan sát cách xử lý an toàn.' : 'Ôn cách nhận biết nguy cơ và thoát hiểm an toàn.'}</p><button class="ds-button ds-text ds-32" data-action="result-review">${icon('replay')}Xem lại những tình huống trong lượt này.</button></div></section><section><h2>${icon('gift')} Phần thưởng nhận được</h2><div class="learn-rewards"><div class="learn-reward">${icon('bolt')}<strong>+${r.xp} EXP</strong><small>${r.xp ? 'Tiến bộ mới của em' : 'Đã nhận EXP thành tích này'}</small></div><div class="learn-reward">${icon(r.kind === 'game' ? 'trophy' : 'chart')}<strong>${r.kind === 'game' ? r.stars+' / 3 sao' : r.score+' / 100'}</strong><small>${r.coin ? '+1 xu cho Tí' : r.kind === 'game' ? 'Thành tích lượt chơi' : 'Điểm kiểm tra'}</small></div></div></section><section><div class="learn-heading-row" style="margin-bottom:8px"><h2>Tiến độ bài học</h2><small>${course.completed.length}/4 bài hoàn thành</small></div><div class="learn-track">${lessonNames.map((name,i)=>`<div><span class="learn-lesson-number ${course.completed.includes(i+1) ? 'done' : ''}">${course.completed.includes(i+1) ? icon('check') : unlocked(i+1) ? i+1 : icon('lock')}</span><span>Bài ${i+1}</span></div>`).join('')}</div></section></div>`,action('result-next',pass ? course.completed.length === 4 ? 'Về thư viện kỹ năng' : 'Tiếp tục bài tiếp theo' : 'Cùng Tí thử lại')+action('result-replay',`${icon('replay')} Chơi lại để cải thiện điểm`,true));
  }
  function reviewScreen() {
    const r = currentResult;
    if (!r) return detail();
    let cards;
    if (r.kind === 'game') {
      cards = CONFIG.hazards.filter(h=>r.foundIDs.includes(h.id)).map(h=>`<article class="learn-review-card"><h2>✓ ${esc(h.title)}</h2><p>${esc(h.why)}</p><p><strong>Phòng tránh:</strong> ${esc(h.prevention)}</p></article>`).join('');
      cards += CONFIG.normal.filter(n=>r.wrongIDs.includes(n.id)).map(n=>`<article class="learn-review-card"><h2>${esc(n.title)}</h2><p>${esc(n.reason)}</p></article>`).join('');
    } else cards = questions.map((q,i)=>`<article class="learn-review-card"><h2>${r.answers[i] === q[2] ? '✓' : '↺'} ${q[0]}</h2><p>Em chọn: ${esc(q[1][r.answers[i]] || 'Chưa chọn')}</p><p><strong>Cùng ghi nhớ:</strong> ${q[3]}</p></article>`).join('');
    return frame(header('Cùng Tí xem lại','results'),`<div class="learn-review-list">${cards || '<p class="learn-muted">Chưa có đồ vật nào được chọn trong lượt này. Hãy thử lại cùng Tí nhé!</p>'}</div>`,action('back-results','Quay lại kết quả'));
  }
  function home() {
    return frame(header('Biệt đội an toàn','library'),`<section class="learn-profile-mascot">${mascot}<h2>Chào em, Tí đây!</h2><p class="learn-description" style="margin-top:8px">Mỗi bài học nhỏ, thêm một kỹ năng hay.</p></section>${continueCard()}<section class="learn-summary"><h2>Hành trình của em</h2><p>${course.completed.length}/4 bài an toàn khi có cháy đã hoàn thành.</p><div style="margin-top:12px">${meter(progress())}</div></section>`,action('open-library','Khám phá thư viện'),nav('home'));
  }
  function saved() {
    return frame(header('Kỹ năng đã lưu','library'),course.bookmarked ? skillCard('An toàn khi có cháy','Kỹ năng em muốn xem lại',progress(),progress() === 100 ? 'Hoàn thành' : 'Đã lưu',true) : `<div class="learn-empty">${round('bookmark')}<h2>Sổ tay đang đợi em!</h2><p>Nhấn biểu tượng lưu ở trang chi tiết kỹ năng để thêm vào đây.</p></div>`, '', nav('saved'));
  }
  function profileScreen() {
    return frame(header('Hành trình của em','library'),`<section class="learn-profile-mascot">${mascot}<h2>Người hùng nhỏ của Tí</h2><p class="learn-description">Cùng học, cùng chơi, cùng an toàn.</p></section><div class="learn-stats"><div><strong>${course.completed.length}/4</strong><small>Bài đã học</small></div><div><strong>${profile.bestReward+(Number(profile.skillXp)||0)}</strong><small>EXP tích lũy</small></div><div><strong>${profile.coins}</strong><small>Xu cho Tí</small></div></div>${continueCard()}${currentResult ? action('back-results','Xem kết quả gần nhất',true) : ''}`, '', nav('profile'));
  }
  function revealGame() {
    root.hidden = true;
    $('game-screen').hidden = false;
  }
  function render(name) {
    if (name === 'play') { if (state === 'intro') startGame(false); else revealGame(); return; }
    clearLessonTimers();
    $('overlay').replaceChildren();
    $('hint-region').hidden = true;
    $('scene-toast').hidden = true;
    setState(name === 'results' ? 'result' : 'hub');
    root.hidden = false;
    $('game-screen').hidden = true;
    route = name;
    root.dataset.screen = name;
    const screens = {library,safety,fire:detail,briefing,reading,quiz,results:resultScreen,'result-review':reviewScreen,home,saved,profile:profileScreen};
    root.innerHTML = name === 'coming' ? frame(header(esc(comingTitle || 'Kỹ năng mới'),'library'),`<div class="learn-empty">${round('book')}<h2>Kỹ năng mới đang được chuẩn bị</h2><p>Trong lúc chờ, mình cùng Tí học an toàn khi có cháy nhé!</p></div>`,action('open-fire','Học an toàn khi có cháy')) : (screens[name] || library)();
    root.querySelector('h1')?.focus({preventScroll:true});
  }
  function navigate(name, replace = false) {
    if ((name === 'briefing' && !unlocked(3)) || (name === 'quiz' && !unlocked(4))) name = 'fire';
    if (location.hash !== '#'+name) history[replace ? 'replaceState' : 'pushState'](null,'','#'+name);
    render(name);
  }
  function openLesson(n) {
    if (!unlocked(n)) return;
    if (n <= 2) { readingPage=0; readingLesson=n; navigate('reading'); }
    if (n === 3) navigate('briefing');
    if (n === 4) { quizIndex=0; quizAnswers=[]; quizStarted=performance.now(); quizFinished=false; navigate('quiz'); }
  }
  function startGame(updateHistory = true) {
    revealGame(); reset(); clearLessonTimers(); $('overlay').replaceChildren(); setState('search'); centerCamera();
    route = 'play';
    if (updateHistory && location.hash !== '#play') history.pushState(null,'','#play');
  }
  function showGameResult(r, lesson = 3) {
    const score = Math.max(0, Math.round(found.size / CONFIG.hazards.length * 100) - r.mistakes * 10);
    course.gameBestScore = Math.max(course.gameBestScore,score);
    if (r.won) completeLesson(lesson);
    currentResult = {kind:'game',lesson,score,best:course.gameBestScore,correct:found.size,total:CONFIG.hazards.length,mistakes:r.mistakes,elapsed:Math.round(r.elapsed),xp:r.added,coin:r.coin,stars:r.stars,completed:r.won,foundIDs:[...found],wrongIDs:[...wrong]};
    // Snapshot the values, so revisiting results never grants rewards again.
    navigate('results'); persist();
  }
  function finishQuiz() {
    if (quizFinished) return;
    quizFinished = true;
    const correct = questions.filter((q,i)=>quizAnswers[i] === q[2]).length, score = Math.round(correct/questions.length*100);
    const reward = correct*4, xp = Math.max(0,reward-course.quizBestReward);
    course.quizBestReward = Math.max(course.quizBestReward,reward);
    course.quizBestScore = Math.max(Number(course.quizBestScore)||0,score);
    profile.skillXp = (Number(profile.skillXp)||0)+xp; save();
    if (score >= 80) completeLesson(4);
    currentResult = {kind:'quiz',lesson:4,score,best:course.quizBestScore,correct,total:questions.length,mistakes:questions.length-correct,elapsed:Math.round((performance.now()-quizStarted)/1000),xp,coin:0,completed:score>=80,answers:[...quizAnswers]};
    navigate('results'); persist();
  }
  root.addEventListener('click',event=>{
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.route) { navigate(button.dataset.route); return; }
    if (button.dataset.coming) { comingTitle=button.dataset.coming; navigate('coming'); return; }
    if (button.dataset.lesson) { openLesson(Number(button.dataset.lesson)); return; }
    if (button.dataset.answer !== undefined) {
      if (route === 'quiz' && quizAnswers.length === quizIndex) { quizAnswers.push(Number(button.dataset.answer)); render('quiz'); }
      return;
    }
    switch (button.dataset.action) {
      case 'open-library': navigate('library'); break;
      case 'open-fire': case 'escape-detail': navigate('fire'); break;
      case 'start-lesson': openLesson(nextLesson()); break;
      case 'bookmark': course.bookmarked=!course.bookmarked; persist(); render('fire'); break;
      case 'search': { const field=$('skill-search'); field.hidden=!field.hidden; if (!field.hidden) $('skill-query').focus(); break; }
      case 'play-game': startGame(); break;
      case 'reading-prev': readingPage=Math.max(0,readingPage-1); render('reading'); break;
      case 'reading-next': {
        const total=readingLesson === 1 ? CONFIG.hazards.length : escapeCards.length;
        if (readingPage < total-1) { readingPage++; render('reading'); }
        else { completeLesson(readingLesson); navigate('fire'); }
        break;
      }
      case 'quiz-next': if (quizAnswers.length !== quizIndex+1) break; if (quizIndex < questions.length-1) { quizIndex++; render('quiz'); } else finishQuiz(); break;
      case 'result-review': navigate('result-review'); break;
      case 'back-results': navigate('results'); break;
      case 'result-next': if (!currentResult.completed) openLesson(currentResult.lesson); else if (course.completed.length === 4) navigate('library'); else openLesson(nextLesson()); break;
      case 'result-replay': openLesson(currentResult.lesson); break;
    }
  });
  root.addEventListener('input',event=>{
    if (event.target.id !== 'skill-query') return;
    const normalize = value => value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
    const query=normalize(event.target.value.trim());
    root.querySelectorAll('.learn-skill').forEach(card=>{card.hidden=!normalize(card.textContent).includes(query);});
    $('skill-no-results').hidden=!!root.querySelector('.learn-skill:not([hidden])');
  });
  window.addEventListener('popstate',()=>{
    const name=location.hash.slice(1) || 'library';
    if (name === 'play' && state !== 'search' && state !== 'pause') { navigate('briefing',true); return; }
    if (name === 'play') { revealGame(); pause(); return; }
    navigate(name,true);
  });
  // Loading a screen URL never assumes a finished lesson or an ongoing attempt.
  const initial=location.hash.slice(1);
  navigate(['library','safety','fire','home','saved','profile','briefing'].includes(initial) ? initial : 'library',true);
  return {revealGame,showGameResult,navigate,startGame};
})();
