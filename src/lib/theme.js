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

export function initTheme() {
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
