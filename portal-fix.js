(() => {
  'use strict';

  const BUILD = '2026.09.28.3';
  const AUTH_STORAGE_PREFIX = 'sb-uzqlqihvgxnepmfjgxlh-auth-token';

  function clearPersistedSession() {
    try {
      Object.keys(localStorage)
        .filter((key) => key === AUTH_STORAGE_PREFIX || (key.startsWith('sb-') && key.endsWith('-auth-token')))
        .forEach((key) => localStorage.removeItem(key));
    } catch (_) {
      // Storage can be unavailable in strict/private browser modes.
    }
  }

  function setHidden(element, hidden) {
    if (!element) return;
    element.classList.toggle('hide', hidden);
  }

  function forceFreshLogin() {
    clearPersistedSession();

    const auth = document.getElementById('auth');
    const portalHome = document.getElementById('portalHome');
    const app = document.getElementById('app');
    const decision = document.getElementById('decisionSection');
    const logout = document.getElementById('logout');

    document.body.classList.add('portal-login');
    setHidden(auth, false);
    setHidden(portalHome, true);
    setHidden(app, true);
    setHidden(decision, true);
    setHidden(logout, true);
  }

  function ensureCaptchaVisible() {
    const password = document.getElementById('password');
    if (!password) return;

    let code = document.getElementById('captchaCode');
    let input = document.getElementById('captchaInput');
    let refresh = document.getElementById('refreshCaptcha');

    if (!code || !input || !refresh) {
      const wrapper = document.createElement('div');
      wrapper.id = 'forcedCaptchaWrap';
      wrapper.className = 'forced-captcha-wrap';
      wrapper.innerHTML = `
        <label for="captchaInput">رمز التحقق</label>
        <div class="forced-captcha-row">
          <div id="captchaCode" class="forced-captcha-code" aria-label="رمز التحقق"></div>
          <button type="button" id="refreshCaptcha" class="forced-captcha-refresh" title="تغيير الرمز">↻</button>
          <input id="captchaInput" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="أدخل رمز التحقق" />
        </div>`;
      password.insertAdjacentElement('afterend', wrapper);
      code = document.getElementById('captchaCode');
      input = document.getElementById('captchaInput');
      refresh = document.getElementById('refreshCaptcha');
    }

    const makeCode = () => {
      const value = String(Math.floor(100000 + Math.random() * 900000));
      code.textContent = value;
      code.dataset.value = value;
      input.value = '';
    };

    if (!code.textContent || code.textContent === '000000') makeCode();
    refresh.onclick = makeCode;
  }

  function goHome() {
    const auth = document.getElementById('auth');
    const portalHome = document.getElementById('portalHome');
    const app = document.getElementById('app');
    const detail = document.getElementById('detail');
    const decision = document.getElementById('decisionSection');

    if (auth && !auth.classList.contains('hide')) return;

    setHidden(app, true);
    setHidden(detail, true);
    setHidden(decision, true);
    setHidden(portalHome, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function ensureGlobalHomeButton() {
    let button = document.getElementById('globalPortalHome');
    if (!button) {
      button = document.createElement('button');
      button.id = 'globalPortalHome';
      button.type = 'button';
      button.innerHTML = '<span aria-hidden="true">⌂</span> الشاشة الرئيسية';
      button.onclick = goHome;
      document.body.appendChild(button);
    }

    const auth = document.getElementById('auth');
    const refresh = () => {
      const loggedOut = !auth || !auth.classList.contains('hide');
      button.hidden = loggedOut;
    };
    refresh();

    if (auth) {
      new MutationObserver(refresh).observe(auth, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function ensureBuildBadge() {
    if (document.getElementById('portalBuildBadge')) return;
    const badge = document.createElement('div');
    badge.id = 'portalBuildBadge';
    badge.textContent = `الإصدار ${BUILD}`;
    document.body.appendChild(badge);
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureCaptchaVisible();
    ensureGlobalHomeButton();
    ensureBuildBadge();
    forceFreshLogin();
  });
})();
