// Welcome moments:
//  • playWelcome({ name, kind: 'login' | 'new' }) shows a short full-screen splash.
//  • queueOnboarding(userKey) marks a brand-new account; the tour opens the
//    first time that user reaches the app (after profile setup).
// Both respect prefers-reduced-motion and can be skipped with a tap or Escape.
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, TrendingUp, Building2, Coins, ShieldCheck, Lock, Bot, Copy, ArrowRight, Sparkles } from 'lucide-react';
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

  const finish = useCallback(() => setLeaving(true), []);
  useEffect(() => {
    const t = setTimeout(finish, reduced() ? 900 : isNew ? 2300 : 1900);
    const onKey = (e) => e.key === 'Escape' && finish();
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [finish, isNew]);
  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(onDone, 520);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={finish}
      className={`fixed inset-0 z-[12000] flex items-center justify-center bg-[#0b0b0c] overflow-hidden cursor-pointer ${leaving ? 'wx-lift' : ''}`}
    >
      <div className="absolute w-[520px] h-[520px] rounded-full wx-glow bg-[radial-gradient(closest-side,rgba(235,37,198,0.28),rgba(245,133,47,0.18)_55%,transparent)]" />
      <div className="relative flex flex-col items-center text-center px-6">
        <div className="relative w-20 h-20 mb-7">
          <span className="absolute inset-0 rounded-full wx-ring" />
          <span className="absolute inset-0 rounded-full wx-ring wx-ring-2" />
          <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center wx-logo shadow-[0_8px_50px_rgba(232,116,42,0.55)]">
            <img src={logo} alt="" className="w-12 h-12" />
          </div>
        </div>
        <h1 className="text-[28px] md:text-4xl font-semibold tracking-tight text-white" aria-label={line}>
          {line.split(' ').map((w, i) => (
            <span key={`${w}-${i}`} className="inline-block wx-word" style={{ animationDelay: `${380 + i * 90}ms` }}>{w}&nbsp;</span>
          ))}
        </h1>
        <p className="mt-2 text-sm text-neutral-400 wx-word" style={{ animationDelay: `${520 + line.split(' ').length * 90}ms` }}>{sub}</p>
        <div className="mt-8 h-[3px] w-40 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#EB25C6,#F5852F)] wx-bar" style={{ animationDuration: isNew ? '2.1s' : '1.7s' }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ onboarding */

const SLIDES = [
  {
    title: 'Everything in one place',
    text: 'Your cash, investments, stakes and vaults add up on the Assets page, in your own currency.',
    icon: PieChart,
    orbit: [Coins, Building2, Lock],
    tint: 'from-fuchsia-500 to-blue-500',
    cta: { label: 'Open Assets', to: '/assets' }
  },
  {
    title: 'Grow your money',
    text: 'Buy stocks, own a share of real-estate projects, or stake crypto and earn every cycle.',
    icon: TrendingUp,
    orbit: [Building2, Coins, PieChart],
    tint: 'from-emerald-400 to-teal-500',
    cta: { label: 'Explore investing', to: '/invest' }
  },
  {
    title: 'Trade your way',
    text: 'Live crypto and forex markets, automated bots, or copy the experts you trust.',
    icon: Bot,
    orbit: [TrendingUp, Copy, Sparkles],
    tint: 'from-indigo-400 to-violet-500',
    cta: { label: 'See markets', to: '/trademain' }
  },
  {
    title: 'Protected by design',
    text: 'Verify your identity once, keep long-term savings in cold storage and turn on notifications for every move.',
    icon: ShieldCheck,
    orbit: [Lock, ShieldCheck, Sparkles],
    tint: 'from-sky-400 to-cyan-400',
    cta: { label: 'Get started', to: '/dashboard' }
  }
];

function Onboarding({ onClose }) {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const [touchX, setTouchX] = useState(null);
  const s = SLIDES[i];
  const last = i === SLIDES.length - 1;

  const close = useCallback((to) => {
    setLeaving(true);
    setTimeout(() => { onClose(); if (to) navigate(to); }, 260);
  }, [navigate, onClose]);
  const go = useCallback((n) => {
    if (n < 0 || n >= SLIDES.length) return;
    setDir(n > i ? 1 : -1);
    setI(n);
  }, [i]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go, i]);

  const Icon = s.icon;
  return (
    <div className={`fixed inset-0 z-[11000] flex items-end md:items-center justify-center ${leaving ? 'wx-fade-out' : ''}`} role="dialog" aria-modal="true" aria-label="Welcome tour">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md wx-fade" onClick={() => close()} />
      <div
        className="relative w-full md:max-w-[420px] bg-[#161617] border border-white/10 rounded-t-[32px] md:rounded-[32px] shadow-2xl overflow-hidden wx-sheet"
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX == null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (dx < -40) go(i + 1);
          if (dx > 40) go(i - 1);
          setTouchX(null);
        }}
      >
        <button type="button" onClick={() => close()} className="absolute top-4 right-4 z-10 text-xs text-neutral-400 hover:text-white px-2 py-1">Skip</button>

        <div key={i} className={`px-7 pt-10 pb-6 ${dir > 0 ? 'wx-slide-next' : 'wx-slide-prev'}`}>
          <div className="relative mx-auto w-44 h-44 mb-6">
            <div className={`absolute inset-6 rounded-full bg-gradient-to-br ${s.tint} opacity-25 blur-2xl`} />
            <div className="absolute inset-0 wx-orbit">
              {s.orbit.map((O, k) => (
                <span key={k} className="absolute w-10 h-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center text-neutral-200"
                  style={{ top: `${50 - 44 * Math.cos((k * 2 * Math.PI) / 3)}%`, left: `${50 + 44 * Math.sin((k * 2 * Math.PI) / 3)}%`, transform: 'translate(-50%,-50%)' }}>
                  <span className="wx-counter"><O className="w-4 h-4" /></span>
                </span>
              ))}
            </div>
            <div className={`absolute inset-[30%] rounded-[28px] bg-gradient-to-br ${s.tint} flex items-center justify-center shadow-xl wx-pop`}>
              <Icon className="w-9 h-9 text-white" strokeWidth={1.8} />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white text-center tracking-tight">{s.title}</h2>
          <p className="text-sm text-neutral-400 text-center mt-2 leading-relaxed">{s.text}</p>
        </div>

        <div className="flex justify-center gap-1.5 pb-5">
          {SLIDES.map((_, k) => (
            <button key={k} type="button" onClick={() => go(k)} aria-label={`Slide ${k + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? 'w-6 bg-white' : 'w-1.5 bg-white/25'}`} />
          ))}
        </div>

        <div className="flex gap-2 px-6 pb-[calc(env(safe-area-inset-bottom)+24px)]">
          {last ? (
            <button type="button" onClick={() => close(s.cta.to)} className="flex-1 h-11 rounded-full bg-[linear-gradient(80deg,#EB25C6,#F5852F)] text-white text-sm font-semibold active:scale-[0.97] transition">
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
