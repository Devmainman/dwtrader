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

/* ---------------- Light / dark mode ----------------
   The user picks 'system' (default: follow the device), 'light' or 'dark'.
   getMode() is what is on screen; getModePref() is the choice. */
const MODE_KEY = 'app:mode';
const modeListeners = new Set();
const mq = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null);
let forcedDark = false; // public pages always paint dark

export function getModePref() {
  try { const v = localStorage.getItem(MODE_KEY); return v === 'light' || v === 'dark' ? v : 'system'; } catch { return 'system'; }
}
export function getMode() {
  const p = getModePref();
  if (p !== 'system') return p;
  return mq()?.matches ? 'light' : 'dark';
}

/** Paint the page in the given mode ('light' | 'dark'). */
export function paintMode(mode, { force } = {}) {
  if (force !== undefined) forcedDark = force;
  const m = forcedDark ? 'dark' : mode;
  const root = document.documentElement;
  if (root.dataset.mode === m) return;
  root.classList.add('mode-switching');
  root.dataset.mode = m;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', m === 'light' ? '#f3f2f0' : '#161617');
  clearTimeout(paintMode.t);
  paintMode.t = setTimeout(() => root.classList.remove('mode-switching'), 360);
}

const emit = () => { const m = getMode(); const p = getModePref(); modeListeners.forEach((fn) => fn(m, p)); };

export function setMode(pref) {
  const p = pref === 'light' || pref === 'dark' ? pref : 'system';
  try { if (p === 'system') localStorage.removeItem(MODE_KEY); else localStorage.setItem(MODE_KEY, p); } catch { /* private mode */ }
  paintMode(getMode());
  emit();
  return p;
}

export function onModeChange(fn) {
  modeListeners.add(fn);
  return () => modeListeners.delete(fn);
}

// When following the device, repaint as soon as the device switches.
if (typeof window !== 'undefined') {
  const m = mq();
  const onSys = () => { if (getModePref() === 'system') { paintMode(getMode()); emit(); } };
  if (m?.addEventListener) m.addEventListener('change', onSys); else m?.addListener?.(onSys);
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
