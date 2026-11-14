// Welcome moments:
//  • playWelcome({ name, kind: 'login' | 'new' }) shows a short full-screen splash.
//  • queueOnboarding(userKey) marks a brand-new account; the tour opens the
//    first time that user reaches the app (after profile setup).
// Both respect prefers-reduced-motion and can be skipped with a tap or Escape.
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logo from '../../assets/Group.svg';

const EVENT = 'app:welcome';
const ONBOARD_KEY = 'app:onboarding-pending';
const DONE_PREFIX = 'app:onboarded:';

const safe = (fn, fallback = null) => { try { return fn(); } catch { return fallback; } };

export function playWelcome(detail = {}) {
  safe(() => sessionStorage.setItem(EVENT, JSON.stringify(detail)));
  window.dispatchEvent(new CustomEvent(EVENT, { detail }));
}

export function queueOnboarding(userKey) {
  safe(() => localStorage.setItem(ONBOARD_KEY, String(userKey || 'new')));
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const hello = () => {
  const h = new Date().getHours();
  return h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

/* ------------------------------------------------------------------ splash */

function Splash({ detail, onDone }) {
  const [leaving, setLeaving] = useState(false);
  const isNew = detail.kind === 'new';
  const first = String(detail.name || '').trim().split(/\s+/)[0];
  const line = isNew ? 'Welcome aboard' : first ? `Welcome back, ${first}` : 'Welcome back';
  const sub = isNew ? "Let's set up your account in a minute." : hello();
  const hold = reduced() ? 900 : isNew ? 2200 : 1800;

  const finish = useCallback(() => setLeaving(true), []);
  useEffect(() => {
    const t = setTimeout(finish, hold);
    const onKey = (e) => e.key === 'Escape' && finish();
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [finish, hold]);
  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(onDone, reduced() ? 0 : 700);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={finish}
      className={`fixed inset-0 z-[12000] flex items-center justify-center bg-[#0b0b0c] cursor-pointer ${leaving ? 'wx-curtain' : ''}`}
    >
      <div className="flex flex-col items-center text-center px-6">
        <img src={logo} alt="" className="w-11 h-11 mb-8 brand-logo wx-unveil" />
        <h1 className="text-[24px] md:text-[28px] font-medium tracking-tight text-white leading-tight" aria-label={line}>
          <span className="wx-line" style={{ animationDelay: '260ms' }}>{line}</span>
        </h1>
        <p className="mt-2 text-[13px] text-neutral-400 wx-soft" style={{ animationDelay: '700ms' }}>{sub}</p>
        <div className="mt-9 h-px w-28 bg-white/10 overflow-hidden">
          <div className="h-full bg-blue-500 wx-bar" style={{ animationDuration: `${hold}ms` }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ onboarding */

// Each slide shows the real screen it talks about.
const SLIDES = [
  { title: 'Everything in one place', text: 'Cash, investments, stakes and vaults add up on the Assets page, in your own currency.', shot: '/landing/assets.webp', cta: { label: 'Open Assets', to: '/assets' } },
  { title: 'Grow your money', text: 'Stake crypto and earn every day, or own a share of real-estate projects.', shot: '/landing/staking.webp', cta: { label: 'Explore staking', to: '/staking' } },
  { title: 'Trade your way', text: 'Live crypto and forex markets, with take-profit and stop-loss set before you enter.', shot: '/landing/trade.webp', cta: { label: 'See markets', to: '/trademain' } },
  { title: 'Protected by design', text: 'Keep savings in cold storage behind a waiting period, and get notified of every move.', shot: '/landing/vault.webp', cta: { label: 'Get started', to: '/dashboard' } },
];
const SLIDE_MS = 7000;

function Onboarding({ onClose }) {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [touchX, setTouchX] = useState(null);
  const s = SLIDES[i];
  const last = i === SLIDES.length - 1;

  const close = useCallback((to) => {
    setLeaving(true);
    setTimeout(() => { onClose(); if (to) navigate(to); }, 260);
  }, [navigate, onClose]);
  const go = useCallback((n) => { if (n >= 0 && n < SLIDES.length) setI(n); }, []);

  // Advance on its own like a story; holding a finger on it pauses.
  useEffect(() => {
    if (paused || last || reduced()) return undefined;
    const t = setTimeout(() => setI((n) => Math.min(n + 1, SLIDES.length - 1)), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, paused, last]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go, i]);

  return (
    <div className={`fixed inset-0 z-[11000] flex items-end md:items-center justify-center ${leaving ? 'wx-fade-out' : ''}`} role="dialog" aria-modal="true" aria-label="Welcome tour">
      <div className="absolute inset-0 bg-black/75 wx-fade" onClick={() => close()} />
      <div
        className="relative w-full md:max-w-[400px] bg-[#141414] rounded-t-[28px] md:rounded-[28px] shadow-2xl overflow-hidden wx-sheet"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX == null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (dx < -40) go(i + 1);
          if (dx > 40) go(i - 1);
          setTouchX(null);
        }}
      >
        {/* progress, story style */}
        <div className="absolute top-3 inset-x-4 z-10 flex gap-1">
          {SLIDES.map((_, k) => (
            <button key={k} type="button" onClick={() => go(k)} aria-label={`Slide ${k + 1}`} className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden">
              {k < i && <span className="block h-full bg-white" />}
              {k === i && <span key={`${i}-${paused}`} className="block h-full bg-white wx-seg" style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused || last ? 'paused' : 'running', transform: last ? 'none' : undefined }} />}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => close()} className="absolute top-7 right-4 z-10 text-xs text-neutral-300 hover:text-white px-2 py-1">Skip</button>

        {/* the real screen, slowly panning */}
        <div className="relative h-[300px] md:h-[320px] overflow-hidden bg-[#0b0b0c]">
          <div key={i} className="absolute inset-x-10 top-12 bottom-0 rounded-t-[22px] overflow-hidden ring-1 ring-white/10 wx-swap">
            <img src={s.shot} alt="" className="w-full wx-pan" draggable="false" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#141414] to-transparent" />
        </div>

        <div key={`t-${i}`} className="px-7 pt-5 pb-5 wx-text">
          <h2 className="text-lg font-semibold text-white tracking-tight">{s.title}</h2>
          <p className="text-[13px] text-neutral-400 mt-1.5 leading-relaxed">{s.text}</p>
        </div>

        <div className="flex gap-2 px-6 pb-[calc(env(safe-area-inset-bottom)+22px)]">
          {last ? (
            <button type="button" onClick={() => close(s.cta.to)} className="flex-1 h-11 rounded-full bg-blue-600 text-white text-sm font-semibold active:scale-[0.97] transition">
              {s.cta.label}
            </button>
          ) : (
            <>
              <button type="button" onClick={() => close(s.cta.to)} className="h-11 px-4 rounded-full bg-white/5 text-neutral-200 text-sm active:scale-[0.97] transition">{s.cta.label}</button>
              <button type="button" onClick={() => go(i + 1)} className="flex-1 h-11 rounded-full bg-white text-black text-sm font-semibold inline-flex items-center justify-center gap-1.5 active:scale-[0.97] transition">
                Next<ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ host */

const AUTH_PATHS = ['/auth', '/signup', '/welcome', '/login'];

export default function WelcomeExperience() {
  const location = useLocation();
  const [splash, setSplash] = useState(null);
  const [tour, setTour] = useState(false);

  useEffect(() => {
    const pending = safe(() => JSON.parse(sessionStorage.getItem(EVENT) || 'null'));
    if (pending) setSplash(pending);
    const on = (e) => setSplash(e.detail || {});
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  // Open the tour once a new user reaches the app itself (not auth / profile setup).
  useEffect(() => {
    if (splash || tour) return;
    const key = safe(() => localStorage.getItem(ONBOARD_KEY));
    const token = safe(() => localStorage.getItem('token'));
    if (key && token && !AUTH_PATHS.some((p) => location.pathname.startsWith(p))) {
      if (safe(() => localStorage.getItem(DONE_PREFIX + key))) { safe(() => localStorage.removeItem(ONBOARD_KEY)); return; }
      const t = setTimeout(() => setTour(true), 300);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [location.pathname, splash, tour]);

  const endSplash = useCallback(() => {
    safe(() => sessionStorage.removeItem(EVENT));
    setSplash(null);
  }, []);
  const endTour = useCallback(() => {
    const key = safe(() => localStorage.getItem(ONBOARD_KEY));
    if (key) safe(() => localStorage.setItem(DONE_PREFIX + key, '1'));
    safe(() => localStorage.removeItem(ONBOARD_KEY));
    setTour(false);
  }, []);

  return (
    <>
      {splash && <Splash detail={splash} onDone={endSplash} />}
      {!splash && tour && <Onboarding onClose={endTour} />}
    </>
  );
}
