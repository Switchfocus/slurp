/* =============================================
   SLURP — Theme Toggle
   Runs in <head> to prevent flash of wrong theme.
   ============================================= */

(function () {
  var KEY  = 'slurp-theme';
  var html = document.documentElement;

  function preferred() {
    var saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme, animate) {
    if (animate) {
      html.classList.add('theme-transitioning');
      setTimeout(function () { html.classList.remove('theme-transitioning'); }, 380);
    }
    html.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    /* Update aria-label on all toggle buttons */
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  /* Apply immediately — no animation on first load */
  apply(preferred(), false);

  /* Wire click handlers once DOM is ready */
  document.addEventListener('DOMContentLoaded', function () {
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var current = html.getAttribute('data-theme');
        apply(current === 'dark' ? 'light' : 'dark', true);
      });
    }
  });
})();
