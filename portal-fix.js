(() => {
  'use strict';

  const BUILD = '2026.09.28.4';

  function ensureCaptchaVisible() {
    const code = document.getElementById('captchaCode');
    const input = document.getElementById('captchaInput');
    const refresh = document.getElementById('refreshCaptcha');
    if (!code || !input || !refresh) return;

    code.style.visibility = 'visible';
    input.style.visibility = 'visible';
    refresh.style.visibility = 'visible';
  }

  /*
   * Important: this deployment helper must never clear Supabase auth storage.
   * The application module owns the session. Clearing it after enter() caused
   * authenticated screens to issue PostgREST requests as the anon role.
   */
  document.addEventListener('DOMContentLoaded', () => {
    ensureCaptchaVisible();
    document.documentElement.dataset.portalBuild = BUILD;
  });
})();
