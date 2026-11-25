// Dashboard tone, chosen by the admin (Settings → Appearance).
// The last known tone is cached so the page paints in it straight away,
// then the live setting is fetched and applied if it changed.
import { API_BASE_URL, STATIC_BASE_URL } from '../api/config';

export const THEMES = ['amber', 'classic-blue', 'navy', 'gold', 'silver'];
const KEY = 'app:theme';

export function applyTheme(theme) {
  const t = THEMES.includes(theme) ? theme : 'amber';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(KEY, t); } catch { /* private mode */ }
  return t;
}

/* ---------------- Light / dark mode (the user's choice, dark by default) ---------------- */
const MODE_KEY = 'app:mode';
const modeListeners = new Set();

export function getMode() {
  try { return localStorage.getItem(MODE_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
}

/** Paint the page in `mode` ('light' | 'dark'). Public pages pass force='dark'. */
export function paintMode(mode) {
  const root = document.documentElement;
  if (root.dataset.mode === mode) return;
  root.classList.add('mode-switching');
  root.dataset.mode = mode;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', mode === 'light' ? '#f3f2f0' : '#161617');
  clearTimeout(paintMode.t);
  paintMode.t = setTimeout(() => root.classList.remove('mode-switching'), 360);
}

export function setMode(mode) {
  const m = mode === 'light' ? 'light' : 'dark';
  try { localStorage.setItem(MODE_KEY, m); } catch { /* private mode */ }
  paintMode(m);
  modeListeners.forEach((fn) => fn(m));
  return m;
}

export function onModeChange(fn) {
  modeListeners.add(fn);
  return () => modeListeners.delete(fn);
}

export function initTheme() {
  const p = window.location.pathname;
  const publicPage = p === '/' || p === '/landing' || p.startsWith('/blog') || p.startsWith('/help') || ['/auth', '/signup', '/welcome'].includes(p);
  document.documentElement.dataset.mode = publicPage ? 'dark' : getMode();
  let cached = 'amber';
  try { cached = localStorage.getItem(KEY) || 'amber'; } catch { /* private mode */ }
  applyTheme(cached);
  fetch(`${API_BASE_URL}/public/settings`)
    .then((r) => r.json())
    .then((d) => {
      const s = d?.settings || {};
      if (s.dashboardTheme) applyTheme(s.dashboardTheme);
      if (s.websiteName) document.title = s.websiteName;
      // An icon uploaded in the admin replaces the bundled company logo.
      if (s.icon) {
        const link = document.querySelector('link[rel="icon"]');
        if (link) {
          link.href = /^https?:/.test(s.icon) ? s.icon : `${STATIC_BASE_URL}${s.icon}`;
          link.removeAttribute('type');
        }
      }
    })
    .catch(() => {});
}
