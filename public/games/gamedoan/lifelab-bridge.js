// LifeLab adapter. The imported game files are kept unchanged.
(() => {
  'use strict';
  const app = window.LearningApp;
  const root = document.getElementById('learning-app');
  const requested = new URLSearchParams(location.search).get('screen') || 'library';
  const stable = ['home', 'library', 'safety', 'fire', 'saved', 'profile', 'briefing'];
  const openLesson = (lesson) => {
    app.navigate('fire', true);
    root.querySelector(`[data-lesson="${lesson}"]:not(:disabled)`)?.click();
  };
  if (requested === 'lesson-1') openLesson(1);
  else if (requested === 'lesson-2') openLesson(2);
  else if (requested === 'quiz') openLesson(4);
  else if (requested === 'play') app.navigate('briefing', true);
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
