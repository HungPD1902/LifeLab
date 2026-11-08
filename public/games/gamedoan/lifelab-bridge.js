// LifeLab adapter for direct gameplay and the native lesson flow.
(() => {
  'use strict';
  const app = window.LearningApp;
  const root = document.getElementById('learning-app');
  const requested = new URLSearchParams(location.search).get('screen') || 'library';
  if (new URLSearchParams(location.search).get('lesson') === '1') {
    const scene = document.getElementById('scene');
    scene.classList.add('lesson-one');
    scene.insertAdjacentHTML('afterbegin', `
      <header class="lesson-one-header">
        <button id="lesson-back" aria-label="Về bài 1">‹</button>
        <h1>Bài 1: Nhận biết</h1>
      </header>
      <nav class="room-arrows" aria-label="Di chuyển góc nhìn trong phòng">
        <button data-pan="-1" aria-label="Di chuyển sang trái"><img src="assets/design-system/room-arrow.png" alt=""></button>
        <button data-pan="1" aria-label="Di chuyển sang phải"><img src="assets/design-system/room-arrow.png" alt=""></button>
      </nav>
    `);
    document.getElementById('lesson-back').onclick = () => {
      window.parent.postMessage({ type: 'lifelab:gamedoan:back' }, '*');
    };
    const settings = document.getElementById('pause');
    scene.querySelector('.lesson-one-header').append(settings);
    settings.setAttribute('aria-label', 'Cài đặt');
    settings.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m10 2-1 3-3 1-3-1-2 4 2 2v3l-2 2 2 4 3-1 3 1 1 2h4l1-2 3-1 3 1 2-4-2-2v-3l2-2-2-4-3 1-3-1-1-3z"/><circle cx="12" cy="12" r="3"/></svg>';
    scene.querySelector('.progress-block small').textContent = 'Nguy cơ đã tìm';
    scene.querySelector('.hud-room-label').textContent = 'Thời gian còn lại';
    for (const arrow of scene.querySelectorAll('[data-pan]')) {
      arrow.onclick = () => {
        if (state !== 'search') return;
        const camera = document.getElementById('camera');
        camera.scrollBy({
          left: Number(arrow.dataset.pan) * camera.clientWidth * 0.4,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      };
    }

    const startGame = app.startGame;
    app.startGame = (updateHistory) => {
      startGame(updateHistory);
      setState('intro');
      const serial = runSerial;
      const overlay = document.getElementById('overlay');
      const zoom = 1.7;
      setTimeout(() => {
        if (serial !== runSerial || state !== 'intro') return;
        overlay.innerHTML = `
          <section class="modal lesson-one-intro" role="dialog" aria-modal="true" aria-labelledby="lesson-one-title">
            <div class="lesson-one-intro-heading">
              <svg class="mascot" aria-hidden="true"><use href="#bear"/></svg>
              <h2 id="lesson-one-title">Truy tìm<br>nguy cơ cháy!</h2>
            </div>
            <p>Hãy quan sát thật kỹ và chạm vào những vị trí nguy hiểm để tìm đủ <strong>${CONFIG.hazards.length} nguy cơ</strong> trước khi hết giờ nhé!</p>
            <button id="lesson-one-start" class="primary ds-button ds-primary">Bắt đầu nào!</button>
          </section>`;
        focusDialog();
        document.getElementById('lesson-one-start').onclick = () => {
          setRoomZoom(zoom);
          centerCamera();
          overlay.replaceChildren();
          setState('search');
        };
        const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
        const start = performance.now();
        function animate(now) {
          if (serial !== runSerial || state !== 'intro') return;
          const progress = duration ? Math.min(1, (now - start) / duration) : 1;
          setRoomZoom(1 + (zoom - 1) * (1 - (1 - progress) ** 3));
          centerCamera();
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }, 350);
    };
    let won = false;
    const showResult = app.showGameResult;
    app.showGameResult = (result) => {
      won = result.won;
      showResult(result, 1);
    };
    document.addEventListener('click', (event) => {
      const action = event.target.closest('button')?.dataset.action;
      if (action !== 'result-next' && action !== 'result-replay') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (action === 'result-next' && won) {
        window.parent.postMessage({ type: 'lifelab:gamedoan:continue' }, '*');
      } else app.startGame();
    }, true);
  }
  const stable = ['home', 'library', 'safety', 'fire', 'saved', 'profile', 'briefing'];
  const openLesson = (lesson) => {
    app.navigate('fire', true);
    root.querySelector(`[data-lesson="${lesson}"]:not(:disabled)`)?.click();
  };
  if (requested === 'lesson-1') openLesson(1);
  else if (requested === 'lesson-2') openLesson(2);
  else if (requested === 'quiz') openLesson(4);
  // Direct entries start a run without marking earlier lessons complete.
  else if (requested === 'play') app.startGame();
  else app.navigate(stable.includes(requested) ? requested : 'library', true);

  let previous;
  function notify() {
    const view = location.hash.slice(1) || 'library';
    if (previous === view) return;
    previous = view;
    window.parent.postMessage({ type: 'lifelab:gamedoan:screen', view }, '*');
  }
  new MutationObserver(notify).observe(root, { attributes: true, childList: true });
  window.addEventListener('popstate', notify);
  window.addEventListener('hashchange', notify);
  notify();
})();
