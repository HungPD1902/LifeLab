// LifeLab adapter for direct gameplay and the native lesson flow.
(() => {
  'use strict';
  const app = window.LearningApp;
  const root = document.getElementById('learning-app');
  const requested = new URLSearchParams(location.search).get('screen') || 'library';
  if (new URLSearchParams(location.search).get('lesson') === '1') {
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
