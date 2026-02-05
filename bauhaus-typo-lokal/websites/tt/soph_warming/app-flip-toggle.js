(() => {
  const CLASS = 'is-inverted';
  const KEY   = 'isInverted';

  function loadState() {
    try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
  }

  function saveState(on) {
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {}
  }

  function apply(state) {
    document.documentElement.classList.toggle(CLASS, state);
  }

  function toggle() {
    const next = !document.documentElement.classList.contains(CLASS);
    apply(next);
    saveState(next);
  }

  function init() {
    // Apply saved state on load
    apply(loadState());

    // Hook up the button
    const btn = document.getElementById('flip-btn') || document.querySelector('.cta-flip');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggle();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();