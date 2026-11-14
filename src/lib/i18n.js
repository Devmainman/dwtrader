// Live page translation for the whole app.
// The app's text is spread across hundreds of components, so instead of a
// per-string dictionary we use Google's website translator on the rendered page.
// Our own flag dropdown drives it; Google's own UI is hidden.
import { useEffect, useState } from 'react';

export const LANGUAGES = [
  { label: 'English', code: 'en', countryCode: 'gb' },
  { label: 'French', code: 'fr', countryCode: 'fr' },
  { label: 'German', code: 'de', countryCode: 'de' },
  { label: 'Spanish', code: 'es', countryCode: 'es' },
  { label: 'Portuguese', code: 'pt', countryCode: 'pt' },
  { label: 'Italian', code: 'it', countryCode: 'it' },
  { label: 'Dutch', code: 'nl', countryCode: 'nl' },
  { label: 'Russian', code: 'ru', countryCode: 'ru' },
  { label: 'Turkish', code: 'tr', countryCode: 'tr' },
  { label: 'Chinese', code: 'zh-CN', countryCode: 'cn' },
  { label: 'Japanese', code: 'ja', countryCode: 'jp' },
  { label: 'Korean', code: 'ko', countryCode: 'kr' },
  { label: 'Hindi', code: 'hi', countryCode: 'in' }
];

export const flagUrl = (countryCode) => `https://flagcdn.com/w40/${countryCode}.png`;

const STORAGE_KEY = 'app:language';
const listeners = new Set();
let current = (() => {
  try { return localStorage.getItem(STORAGE_KEY) || 'en'; } catch { return 'en'; }
})();
if (!LANGUAGES.some((l) => l.code === current)) current = 'en';

let scriptPromise = null;

/** Google's translator rewrites text nodes, which can confuse React; make removals tolerant. */
function patchDomForTranslation() {
  if (typeof Node === 'undefined' || Node.prototype.__translatePatched) return;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function patchedRemoveChild(child) {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child);
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function patchedInsertBefore(node, ref) {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref);
  };
  Node.prototype.__translatePatched = true;
}

function setCookie(lang) {
  const host = window.location.hostname;
  const value = lang === 'en' ? '' : `/en/${lang}`;
  const expires = lang === 'en' ? 'Thu, 01 Jan 1970 00:00:00 GMT' : 'Fri, 31 Dec 9999 23:59:59 GMT';
  document.cookie = `googtrans=${value}; expires=${expires}; path=/`;
  if (host.includes('.')) document.cookie = `googtrans=${value}; expires=${expires}; path=/; domain=.${host.replace(/^www\./, '')}`;
}

function loadTranslator() {
  if (scriptPromise) return scriptPromise;
  patchDomForTranslation();
  scriptPromise = new Promise((resolve, reject) => {
    if (!document.getElementById('google_translate_element')) {
      const holder = document.createElement('div');
      holder.id = 'google_translate_element';
      holder.style.display = 'none';
      document.body.appendChild(holder);
    }
    window.__gtInit = () => {
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: LANGUAGES.map((l) => l.code).join(','),
        autoDisplay: false
      }, 'google_translate_element');
      resolve();
    };
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=__gtInit';
    s.async = true;
    s.onerror = () => { scriptPromise = null; reject(new Error('Translation service unavailable')); };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Wait for Google's hidden language <select> and switch it. */
function applyWithCombo(lang, tries = 40) {
  return new Promise((resolve, reject) => {
    const tick = (n) => {
      const combo = document.querySelector('select.goog-te-combo');
      if (combo && combo.options.length > 1) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
        resolve();
      } else if (n <= 0) {
        reject(new Error('Translation service did not start'));
      } else {
        setTimeout(() => tick(n - 1), 150);
      }
    };
    tick(tries);
  });
}

export const getLanguage = () => current;
export const getLanguageInfo = (code = current) => LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];

/** Switch the whole app to `lang`. Resolves once the request has been applied. */
export async function setLanguage(lang) {
  if (!LANGUAGES.some((l) => l.code === lang)) return;
  const previous = current;
  current = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* private mode */ }
  document.documentElement.lang = lang;
  listeners.forEach((fn) => fn(lang));
  setCookie(lang);

  if (lang === 'en') {
    // Restoring the original text cleanly is most reliable with a reload.
    if (previous !== 'en') window.location.reload();
    return;
  }
  await loadTranslator();
  await applyWithCombo(lang);
}

/** Call once on startup: re-applies the saved language. */
export function initLanguage() {
  document.documentElement.lang = current;
  if (current !== 'en') {
    setCookie(current);
    loadTranslator().then(() => applyWithCombo(current)).catch(() => {});
  }
}

export function useLanguage() {
  const [lang, setLang] = useState(current);
  useEffect(() => {
    listeners.add(setLang);
    return () => listeners.delete(setLang);
  }, []);
  return { language: getLanguageInfo(lang), languages: LANGUAGES, setLanguage };
}
