// Public landing page for new visitors.
// A fixed WebGL stage (scene.js) sits behind the page. Scroll is turned into one
// eased timeline value t (0 to 5, one unit per chapter) that drives the 3D camera
// and each chapter's copy. Real screens of the app appear in one chapter, inside a phone.
// Type: Geist (light for headlines), Geist Mono for prices.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, ChevronDown, Lock, Fingerprint, PenLine, Bell, Signal, Wifi, BatteryFull,
  LineChart, Copy, Coins, Building2, Cpu, Plus, Menu, X, Wallet, ArrowLeftRight, QrCode, BadgeCheck, Send, Bitcoin,
} from 'lucide-react';
import logo from '../assets/Group.svg';
import { API_BASE_URL } from '../api/config';
import { HelpCategoryCard } from './Help';
import './landing.css';

const IMG = (name) => `/landing/${name}.webp`;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const band = (x, a, b, c, d) => clamp((x - a) / (b - a)) * (1 - clamp((x - c) / (d - c))); // fade in a..b, out c..d
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------ content */

const PRODUCTS = [
  { icon: Wallet, title: 'Crypto wallets', text: 'Deposit Bitcoin, Ethereum and more, each in its own wallet.' },
  { icon: ArrowLeftRight, title: 'Convert', text: 'Swap crypto and cash instantly at live prices.' },
  { icon: LineChart, title: 'Live trading', text: 'Go long or short with take-profit and stop-loss.' },
  { icon: Copy, title: 'Copy trading', text: 'Mirror the positions of traders you choose.' },
  { icon: Coins, title: 'Staking', text: 'Lock coins for a term and earn daily rewards.' },
  { icon: Building2, title: 'Real estate', text: 'Own a share of real projects from a set minimum.' },
  { icon: Cpu, title: 'Cloud mining', text: 'Rent a rig and get its output paid to you.' },
  { icon: Lock, title: 'Cold storage', text: 'Vaults with a waiting period before money leaves.' },
];

const SCREENS = [
  { img: 'assets', title: 'Everything you own', text: 'Crypto, cash, stakes, stocks, property and vaults, valued together in your own currency.' },
  { img: 'trade', title: 'Trade long or short', text: 'Pick a market, set your size, then let take-profit and stop-loss do the watching.' },
  { img: 'copy', title: 'Copy proven traders', text: 'Follow a trader’s record, set an amount, and mirror every position they open.' },
  { img: 'staking', title: 'Stake and earn', text: 'Lock coins for a fixed term and watch the rewards add up each day.' },
  { img: 'realestate', title: 'Own a share of real buildings', text: 'Back real-estate projects from a set minimum and collect the returns.' },
  { img: 'mining', title: 'Rent mining power', text: 'Start a rig in a tap. Output is paid into your balance as it is mined.' },
];

const SECURITY = [
  { icon: Lock, title: 'Cold storage', text: 'Savings sit in vaults with a waiting period before anything leaves.' },
  { icon: PenLine, title: 'Wallets by signature', text: 'Connect by signing a message. We never ask for a seed phrase.' },
  { icon: Fingerprint, title: 'Verified accounts', text: 'Identity and address checks before money moves out.' },
  { icon: Bell, title: 'Every move, notified', text: 'Each deposit, withdrawal, trade and payout is reported to you.' },
];


const TICKER = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX', 'LINK', 'DOT', 'TRX', 'TON', 'LTC', 'SHIB', 'NEAR', 'UNI', 'ATOM', 'APT'];
const CARD_COINS = [['BTC', 'Bitcoin'], ['ETH', 'Ethereum'], ['SOL', 'Solana'], ['BNB', 'BNB'], ['XRP', 'XRP'], ['DOGE', 'Dogecoin'], ['ADA', 'Cardano'], ['AVAX', 'Avalanche']];

const CRYPTO_STEPS = [
  { icon: QrCode, title: 'Pick a coin', text: 'Choose Bitcoin, Ethereum, USDT or any coin we support and scan its address.' },
  { icon: Send, title: 'Send it from any wallet', text: 'Paste your transaction hash, or add a screenshot of the transfer.' },
  { icon: BadgeCheck, title: 'Credited to that coin', text: 'Once verified it lands in that coin’s own wallet, valued live in your currency.' },
];

/* ------------------------------------------------------------ data */

function useMarket() {
  const [rows, setRows] = useState({});
  const [lines, setLines] = useState({});
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const symbols = encodeURIComponent(JSON.stringify(TICKER.map((c) => `${c}USDT`)));
        const data = await (await fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbols=${symbols}`)).json();
        if (alive && Array.isArray(data)) {
          setRows(Object.fromEntries(data.map((d) => [d.symbol.replace('USDT', ''), { price: Number(d.lastPrice), change: Number(d.priceChangePercent) }])));
        }
      } catch { /* ticker hides */ }
    };
    const loadLines = async () => {
      const out = {};
      await Promise.all(CARD_COINS.map(async ([c]) => {
        try {
          const k = await (await fetch(`https://data-api.binance.vision/api/v3/klines?symbol=${c}USDT&interval=1h&limit=24`)).json();
          if (Array.isArray(k)) out[c] = k.map((r) => Number(r[4]));
        } catch { /* no line */ }
      }));
      if (alive) setLines(out);
    };
    load();
    loadLines();
    const id = setInterval(load, 15000);
    return () => { alive = false; clearInterval(id); };
  }, []);
  return { rows, lines };
}

function useCoins() {
  const [coins, setCoins] = useState({ list: [], convert: true });
  useEffect(() => {
    fetch(`${API_BASE_URL}/public/crypto`).then((r) => r.json())
      .then((d) => { if (d?.success) setCoins({ list: d.data.coins || [], convert: d.data.convertEnabled !== false }); })
      .catch(() => {});
  }, []);
  return coins;
}

function usePlans() {
  const [plans, setPlans] = useState({ list: [], currency: 'USD' });
  useEffect(() => {
    fetch(`${API_BASE_URL}/public/plans`).then((r) => r.json())
      .then((d) => { if (d?.success && Array.isArray(d.plans)) setPlans({ list: d.plans, currency: d.currency || 'USD' }); })
      .catch(() => {});
  }, []);
  return plans;
}

const fmt = (n) => (n >= 1000 ? n.toLocaleString('en-US', { maximumFractionDigits: 0 }) : n >= 1 ? n.toFixed(2) : n.toPrecision(3));
const money = (n, cur) => { try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n); } catch { return `${cur} ${n}`; } };

/* ------------------------------------------------------------ typography */

/** Headline that rises in letter by letter when it scrolls into view. Prefix a word with * to colour it. */
function Split({ text, as: Tag = 'h2', className = '', delay = 0, onLoad = false }) {
  const ref = useRef(null);
  const [on, setOn] = useState(onLoad);
  useEffect(() => {
    if (onLoad) return undefined;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [onLoad]);
  let n = 0;
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`ld-split ${on ? 'is-in' : ''} ${className}`} aria-label={text.replace(/\*/g, '')}>
      {words.map((w, wi) => {
        const accent = w.startsWith('*');
        const clean = w.replace(/\*/g, '');
        return (
          <span key={wi} className={`ld-sw ${accent ? 'is-accent' : ''}`} aria-hidden="true">
            {[...clean].map((ch, ci) => <span key={ci} className="ld-sc" style={{ transitionDelay: `${delay + (n++) * 22}ms` }}>{ch}</span>)}
            {wi < words.length - 1 && <span className="ld-sc">&nbsp;</span>}
          </span>
        );
      })}
    </Tag>
  );
}

function Spark({ data, up }) {
  if (!data || data.length < 2) return <div className="h-[56px]" />;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 200},${54 - ((v - min) / (max - min || 1)) * 48}`).join(' ');
  return (
    <svg viewBox="0 0 200 56" className="w-full h-[56px]" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={up ? '#34d399' : '#f87171'} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="ld-spark" />
    </svg>
  );
}

/* ------------------------------------------------------------ phone mockup */

function Device({ screen, prev, swapKey }) {
  return (
    <div className="ld-device">
      {[1, 2, 3, 4, 5, 6].map((i) => <span key={i} className="ld-device-rim" style={{ transform: `translateZ(${-i * 1.6}px)` }} />)}
      <span className="ld-key ld-key-action" />
      <span className="ld-key ld-key-up" />
      <span className="ld-key ld-key-down" />
      <span className="ld-key ld-key-power" />
      <div className="ld-device-frame">
        <div className="ld-screen">
          <div className="ld-status">
            <span className="ld-status-time">9:41</span>
            <span className="ld-island" />
            <span className="ld-status-icons"><Signal strokeWidth={2.6} /><Wifi strokeWidth={2.6} /><BatteryFull strokeWidth={2} /></span>
          </div>
          <div className="ld-screen-body">
            {prev && <img key={`p-${prev}`} src={IMG(prev)} alt="" className="ld-shot" draggable="false" />}
            <img key={`c-${screen}-${swapKey}`} src={IMG(screen)} alt={`${screen} screen of the app`} className={`ld-shot ${prev ? 'ld-shot-in' : ''}`} draggable="false" />
          </div>
          <span className="ld-home-bar" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ page */

export default function Landing() {
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const chapters = useRef([]);
  const stage = useRef(null);
  const [brand, setBrand] = useState('');
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [help, setHelp] = useState([]);
  useEffect(() => { fetch(`${API_BASE_URL}/public/faq/categories`).then((r) => r.json()).then((j) => setHelp(Array.isArray(j.data) ? j.data : [])).catch(() => {}); }, []);
  const [shot, setShot] = useState({ i: 0, prev: null, n: 0 });
  const [gl, setGl] = useState(true);
  const { rows, lines } = useMarket();
  const plans = usePlans();
  const coins = useCoins();

  // Fonts for this page only (the dashboard keeps Montserrat).
  useEffect(() => {
    const hrefs = [
      'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap',
    ];
    const links = hrefs.map((href) => {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      document.head.appendChild(l);
      return l;
    });
    return () => links.forEach((l) => l.remove());
  }, []);

  // 3D stage
  useEffect(() => {
    let disposed = false;
    const mobile = window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches;
    import('./scene.js').then(({ createStage }) => {
      if (disposed || !canvasRef.current) return;
      try {
        stage.current = createStage(canvasRef.current, { mobile });
        if (reducedMotion()) stage.current.setStill(true);
      } catch { setGl(false); }
    }).catch(() => setGl(false));
    return () => { disposed = true; stage.current?.dispose(); stage.current = null; };
  }, []);

  // Scroll timeline
  useEffect(() => {
    const still = reducedMotion();
    let raf, cur = 0, lastShot = 0;
    const root = rootRef.current;
    const tick = () => {
      const vh = window.innerHeight;
      let t = 0;
      chapters.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const last = i === chapters.current.length - 1;
        t += last ? clamp((vh - r.top) / Math.max(1, el.offsetHeight)) : clamp(-r.top / Math.max(1, el.offsetHeight - vh));
      });
      cur = still ? t : cur + (t - cur) * 0.09;
      if (Math.abs(t - cur) < 0.0004) cur = t;
      root.style.setProperty('--t', cur.toFixed(4));
      stage.current?.setTimeline(cur);

      const c0 = clamp(cur), c1 = clamp(cur - 1), c2 = clamp(cur - 2), c3 = clamp(cur - 3);
      root.style.setProperty('--h1', (1 - clamp((c0 - 0.12) / 0.3)).toFixed(3));
      root.style.setProperty('--h2', band(c0, 0.5, 0.68, 0.9, 1.02).toFixed(3));
      root.style.setProperty('--m1', band(c1, 0.04, 0.2, 0.46, 0.58).toFixed(3));
      root.style.setProperty('--m2', band(c1, 0.6, 0.74, 0.95, 1.05).toFixed(3));
      root.style.setProperty('--s0', band(c2, 0.0, 0.08, 0.95, 1.0).toFixed(3));
      root.style.setProperty('--sp', c2.toFixed(4));
      root.style.setProperty('--v1', band(c3, 0.04, 0.18, 0.92, 1.0).toFixed(3));
      root.style.setProperty('--v2', band(c3, 0.72, 0.86, 0.97, 1.02).toFixed(3));
      root.style.setProperty('--scrim', clamp((cur - 4) * 12).toFixed(3));

      const k = Math.min(SCREENS.length - 1, Math.floor(clamp((c2 - 0.06) / 0.88) * SCREENS.length));
      if (k !== lastShot) { setShot((s) => ({ i: k, prev: SCREENS[lastShot].img, n: s.n + 1 })); lastShot = k; }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.ld-reveal:not(.is-in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [plans.list.length]);

  useEffect(() => {
    const onScroll = () => { setSolid(window.scrollY > 30); setMega(false); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    fetch(`${API_BASE_URL}/public/settings`).then((r) => r.json()).then((d) => setBrand(d?.settings?.websiteName || '')).catch(() => {});
    SCREENS.forEach(({ img }) => { const i = new Image(); i.src = IMG(img); });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menu]);

  const ch = (i) => (el) => { chapters.current[i] = el; };
  const go = (id) => (e) => {
    e.preventDefault();
    setMenu(false);
    setMega(false);
    const el = document.getElementById(id);
    if (!el) return;
    const sticky = ['top', 'markets', 'app', 'security'].includes(id);
    const extra = id === 'markets' ? el.offsetHeight * 0.18 : id === 'security' ? el.offsetHeight * 0.55 : 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + extra - (sticky ? 0 : 90), behavior: 'smooth' });
  };
  const year = new Date().getFullYear();
  const active = SCREENS[shot.i];
  const tickerItems = useMemo(() => TICKER.filter((c) => rows[c]).map((c) => ({ c, ...rows[c] })), [rows]);
  const showPlans = plans.list.length >= 2;

  return (
    <div ref={rootRef} className="ld">
      <canvas ref={canvasRef} className="ld-canvas" aria-hidden="true" style={{ display: gl ? 'block' : 'none' }} />
      <div className="ld-scrim" aria-hidden="true" />
      <div className="ld-grain" aria-hidden="true" />

      {/* ---------------- top bar: live ticker + nav ---------------- */}
      <header className={`ld-nav ${solid ? 'is-solid' : ''}`}>
        {tickerItems.length > 0 && (
          <div className="ld-ticker" aria-label="Live prices">
            <div className="ld-marquee">
              {[...tickerItems, ...tickerItems].map((r, i) => (
                <span key={i} className="ld-tick">
                  <b>{r.c}</b><span>${fmt(r.price)}</span>
                  <span className={r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>{r.change >= 0 ? '▲' : '▼'} {Math.abs(r.change).toFixed(2)}%</span>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="max-w-[1320px] mx-auto flex items-center justify-between h-16 md:h-[68px] px-5 md:px-8">
          <a href="#top" onClick={go('top')} className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="" className="w-8 h-8" />
            {brand && <span className="ld-brand">{brand}</span>}
          </a>
          <nav className="hidden lg:flex items-center gap-1 text-[14px]" onMouseLeave={() => setMega(false)}>
            <div className="relative">
              <button type="button" className={`ld-navlink ${mega ? 'is-on' : ''}`} onMouseEnter={() => setMega(true)} onClick={() => setMega((v) => !v)} aria-expanded={mega}>
                Products <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${mega ? 'rotate-180' : ''}`} />
              </button>
              <div className={`ld-mega ${mega ? 'is-open' : ''}`}>
                <div className="grid grid-cols-2 gap-1">
                  {PRODUCTS.map(({ title, text }) => (
                    <Link key={title} to="/signup" className="ld-mega-item">
                      <span><b>{title}</b><small>{text}</small></span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <a href="#crypto" onClick={go('crypto')} className="ld-navlink">Crypto</a>
            <a href="#markets" onClick={go('markets')} className="ld-navlink">Markets</a>
            <a href="#app" onClick={go('app')} className="ld-navlink">The app</a>
            <a href="#security" onClick={go('security')} className="ld-navlink">Security</a>
            {showPlans && <a href="#plans" onClick={go('plans')} className="ld-navlink">Plans</a>}
            {help.length ? <a href="#faq" onClick={go('faq')} className="ld-navlink">Help Center</a> : <Link to="/help" className="ld-navlink">Help Center</Link>}
            <Link to="/blog" className="ld-navlink">Blog</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="ld-btn ld-btn-ghost !h-10 !px-3 sm:!px-5 !text-[14px]">Log in</Link>
            <Link to="/signup" className="ld-btn ld-btn-light !h-10 !px-5 !text-[14px]">Get started</Link>
            <button type="button" className="ld-burger inline-flex lg:hidden" onClick={() => setMenu((v) => !v)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>
              {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div className={`ld-sheet ${menu ? 'is-open' : ''}`} aria-hidden={!menu}>
        <div className="px-6 pt-32 pb-10 h-full overflow-y-auto flex flex-col">
          {[['Crypto', 'crypto'], ['Markets', 'markets'], ['The app', 'app'], ['Security', 'security'], ...(showPlans ? [['Plans', 'plans']] : []), ...(help.length ? [['Help Center', 'faq']] : [])].map(([label, id], i) => (
            <a key={id} href={`#${id}`} onClick={go(id)} className="ld-sheet-link" style={{ transitionDelay: menu ? `${80 + i * 50}ms` : '0ms' }}>{label}<ArrowUpRight className="w-5 h-5 text-neutral-500" /></a>
          ))}
          <Link to="/blog" className="ld-sheet-link">Blog<ArrowUpRight className="w-5 h-5 text-neutral-500" /></Link>
          {!help.length && <Link to="/help" className="ld-sheet-link">Help Center<ArrowUpRight className="w-5 h-5 text-neutral-500" /></Link>}
          <p className="ld-label mt-10 mb-4">Products</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px] text-neutral-300">
            {PRODUCTS.map((p) => <Link key={p.title} to="/signup">{p.title}</Link>)}
          </div>
          <div className="mt-auto pt-10 grid grid-cols-2 gap-3">
            <Link to="/auth" className="ld-btn ld-btn-glass">Log in</Link>
            <Link to="/signup" className="ld-btn ld-btn-light">Get started</Link>
          </div>
        </div>
      </div>

      {/* ---------------- 0. hero ---------------- */}
      <section id="top" ref={ch(0)} className="relative" style={{ height: '190vh' }}>
        <div className="ld-stick">
          <div className="ld-fade absolute inset-x-0 top-[14vh] md:top-[15vh] text-center px-5" style={{ '--o': 'var(--h1, 1)', '--y': 'calc((1 - var(--h1, 1)) * -50px)' }}>
            <Split as="h1" onLoad delay={250} className="ld-display ld-shine max-w-[17ch] mx-auto" text="Your crypto, *all *in *one *place." />
          </div>
          <div className="ld-fade absolute inset-x-0 bottom-[6vh] md:bottom-[6vh] text-center px-6" style={{ '--o': 'var(--h1, 1)' }}>
            <p className="ld-lead max-w-[480px] mx-auto ld-rise" style={{ animationDelay: '1100ms' }}>Deposit Bitcoin, Ethereum and more, convert to cash at live prices, then trade, copy expert traders, stake and mine. One account.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 ld-rise" style={{ animationDelay: '1250ms' }}>
              <Link to="/signup" className="ld-btn ld-btn-light">Open a free account<ArrowRight className="w-4 h-4" /></Link>
              <Link to="/auth" className="ld-btn ld-btn-glass">Log in</Link>
            </div>
          </div>
          <div className="ld-fade absolute inset-x-0 top-[16vh] md:top-[17vh] text-center px-6" style={{ '--o': 'var(--h2, 0)', '--y': 'calc((1 - var(--h2, 0)) * 30px)' }}>
            <h2 className="ld-display">Every coin. <em>One balance.</em></h2>
          </div>
        </div>
      </section>

      {/* ---------------- 1. markets ---------------- */}
      <section id="markets" ref={ch(1)} className="relative" style={{ height: '240vh' }}>
        <div className="ld-stick">
          <div className="ld-fade absolute inset-x-0 top-[17vh] text-center px-6" style={{ '--o': 'var(--m1, 0)', '--y': 'calc((1 - var(--m1, 0)) * 30px)' }}>
            <h2 className="ld-display max-w-[16ch] mx-auto">Crypto that <em>never sleeps.</em></h2>
            <p className="ld-lead mt-5 max-w-[460px] mx-auto">Bitcoin, Ethereum and the coins you follow, priced live around the clock. Stocks and forex too.</p>
          </div>
          <div className="ld-fade absolute inset-x-0 bottom-[4vh] md:bottom-[8vh] px-4" style={{ '--o': 'var(--m2, 0)', '--y': 'calc((1 - var(--m2, 0)) * 30px)' }}>
            <div className="max-w-[1100px] mx-auto ld-glass rounded-[24px] px-4 py-5 md:px-8 md:py-7">
              <h3 className="ld-h3 text-center mb-6 md:mb-8">Set your exit before you enter.</h3>
              {CARD_COINS.some(([c]) => rows[c]) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-7">
                  {CARD_COINS.slice(0, 4).filter(([c]) => rows[c]).map(([c]) => (
                    <div key={c} className="text-center">
                      <p className="ld-label">{c} / USD</p>
                      <p className="ld-num text-[clamp(22px,2.6vw,38px)] mt-2">${fmt(rows[c].price)}</p>
                      <p className={`ld-mono text-[12px] mt-1 ${rows[c].change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{rows[c].change >= 0 ? '+' : ''}{rows[c].change.toFixed(2)}% today</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. inside the app ---------------- */}
      <section id="app" ref={ch(2)} className="relative" style={{ height: `${120 + SCREENS.length * 85}vh` }}>
        <div className="ld-stick">
          <div className="ld-fade absolute inset-0" style={{ '--o': 'var(--s0, 0)' }}>
            <div className="ld-show">
              <div className="ld-show-copy">
                <ol className="hidden md:block mb-10">
                  {SCREENS.map((s, i) => (
                    <li key={s.img} className={`ld-index ${i === shot.i ? 'is-on' : ''}`}>
                      <span>{String(i + 1).padStart(2, '0')}</span>{s.title}
                    </li>
                  ))}
                </ol>
                <div key={shot.i} className="ld-caption">
                  <p className="md:hidden ld-label mb-2">{String(shot.i + 1).padStart(2, '0')} / {String(SCREENS.length).padStart(2, '0')}</p>
                  <h3 className="ld-h3">{active.title}</h3>
                  <p className="ld-lead mt-3 max-w-[400px]">{active.text}</p>
                </div>
              </div>
              <div className="ld-show-stage">
                <div className="ld-orbit">
                  <Device screen={active.img} prev={shot.prev} swapKey={shot.n} />
                </div>
                <div className="ld-floor-shadow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. vault ---------------- */}
      <section id="security" ref={ch(3)} className="relative" style={{ height: '300vh' }}>
        <div className="ld-stick">
          <div className="ld-fade absolute inset-x-0 top-[15vh] md:top-[16vh] text-center px-6" style={{ '--o': 'var(--v1, 0)', '--y': 'calc((1 - var(--v1, 0)) * 30px)' }}>
            <h2 className="ld-display">Built like a <em>vault.</em></h2>
          </div>
          <div className="ld-fade absolute inset-x-0 bottom-[5vh] md:bottom-[6vh] px-4" style={{ '--o': 'var(--v2, 0)', '--y': 'calc((1 - var(--v2, 0)) * 30px)' }}>
            <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
              {SECURITY.map(({ icon: Icon, title, text }) => (
                <div key={title} className="ld-glass rounded-[18px] p-3.5 md:p-4">
                  <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-[#fb9b4b] shrink-0" strokeWidth={1.8} /><p className="text-[13px] md:text-[14px] font-medium">{title}</p></div>
                  <p className="hidden md:block text-[12px] text-[#a1a1aa] mt-1.5 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. the rest (camera pulls wide behind it) ---------------- */}
      <div ref={ch(4)} className="relative">
        {/* live market cards */}
        <section id="live" className="relative px-5 md:px-8 pt-32 md:pt-44 pb-20 md:pb-28">
          <div className="max-w-[1240px] mx-auto">
            <Split className="ld-h2 mb-8 md:mb-12" text="Live *prices." />
            <div className="ld-cards">
              {CARD_COINS.map(([c, label], i) => {
                const r = rows[c];
                const up = (r?.change ?? 0) >= 0;
                return (
                  <article key={c} className="ld-coin ld-glass ld-reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={`https://assets.coincap.io/assets/icons/${c.toLowerCase()}@2x.png`} alt="" className="w-8 h-8 rounded-full" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                        <div><p className="font-medium text-[14px] leading-tight">{c}</p><p className="text-[11px] text-[#71717a]">{label}</p></div>
                      </div>
                      {r && <span className={`ld-mono text-[12px] ${up ? 'text-emerald-400' : 'text-red-400'}`}>{up ? '+' : ''}{r.change.toFixed(2)}%</span>}
                    </div>
                    <div className="mt-5"><Spark data={lines[c]} up={up} /></div>
                    <p className="ld-num text-[20px] mt-4">{r ? `$${fmt(r.price)}` : '—'}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* crypto, made simple */}
        <section id="crypto" className="relative px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-[1240px] mx-auto">
            <p className="ld-label">Crypto</p>
            <Split className="ld-h2 mt-3 mb-4" text="Crypto, made *simple." />
            <p className="ld-lead max-w-[560px] ld-reveal">Hold real coins, see them valued live in your own currency, and move between crypto and cash whenever you like.</p>

            <div className="grid md:grid-cols-3 gap-4 mt-10">
              {[
                { icon: Wallet, title: 'A wallet for every coin', text: 'Each coin you deposit sits in its own wallet, shown with its live price and 24-hour change.' },
                ...(coins.convert ? [{ icon: ArrowLeftRight, title: 'Convert in seconds', text: 'Swap crypto to cash or cash to crypto at the live rate. You see the amount, rate and fee before you confirm.' }] : []),
                { icon: Coins, title: 'Make it work', text: 'Use your balance to trade, copy expert traders, stake for daily rewards or rent mining power.' },
              ].map(({ icon: Icon, title, text }, i) => (
                <article key={title} className="ld-glass ld-reveal rounded-[22px] p-6" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="ld-feat-icon"><Icon className="w-5 h-5" strokeWidth={1.8} /></span>
                  <h3 className="text-[17px] font-medium mt-5">{title}</h3>
                  <p className="text-[13px] text-[#a1a1aa] mt-2 leading-relaxed">{text}</p>
                </article>
              ))}
            </div>

            <div className="mt-14 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 items-center">
              <div>
                <p className="ld-label">Depositing crypto</p>
                <h3 className="ld-h3 mt-3">Three steps from your wallet to ours.</h3>
                <ol className="mt-7 space-y-5">
                  {CRYPTO_STEPS.map(({ icon: Icon, title, text }, i) => (
                    <li key={title} className="flex gap-4 ld-reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                      <span className="ld-step">{i + 1}</span>
                      <div><p className="text-[15px] font-medium flex items-center gap-2"><Icon className="w-4 h-4 text-[#fb9b4b]" strokeWidth={1.8} />{title}</p><p className="text-[13px] text-[#a1a1aa] mt-1 leading-relaxed max-w-[420px]">{text}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="ld-glass rounded-[26px] p-6 md:p-8 ld-reveal">
                <div className="flex items-center justify-between">
                  <p className="ld-label">{coins.list.length ? `${coins.list.length} coins supported` : 'Supported coins'}</p>
                  <Bitcoin className="w-5 h-5 text-[#fb9b4b]" strokeWidth={1.8} />
                </div>
                {coins.list.length ? (
                  <div className="ld-coinwall mt-6">
                    {coins.list.slice(0, 18).map((c, i) => (
                      <div key={c.symbol} className="ld-coinchip" style={{ animationDelay: `${(i % 6) * 0.4}s` }} title={c.name}>
                        <img src={c.icon} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                        <span>{c.symbol}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ld-coinwall mt-6">
                    {CARD_COINS.map(([c, name], i) => (
                      <div key={c} className="ld-coinchip" style={{ animationDelay: `${(i % 6) * 0.4}s` }} title={name}>
                        <img src={`https://assets.coincap.io/assets/icons/${c.toLowerCase()}@2x.png`} alt="" loading="lazy" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Link to="/signup" className="ld-btn ld-btn-light mt-8 w-full">Create a free wallet<ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </section>

        {/* plans (from the admin's active packages) */}
        {showPlans && (
          <section id="plans" className="relative px-5 md:px-8 py-20 md:py-28">
            <div className="max-w-[1240px] mx-auto">
              <Split className="ld-h2 mb-8 md:mb-12" text="Choose how you *grow." />
              <div className="ld-plans">
                {plans.list.map((p, i) => {
                  const lead = plans.list.length >= 3 && i === Math.floor(plans.list.length / 2);
                  return (
                    <article key={p.name} className={`ld-plan ld-glass ld-reveal ${lead ? 'is-lead' : ''}`} style={{ transitionDelay: `${i * 70}ms` }}>
                      <h3 className="ld-plan-name">{p.name}</h3>
                      <p className="ld-num text-[28px] mt-2">{p.amount > 0 ? money(p.amount, plans.currency) : 'Free'}</p>
                      <ul className="mt-5 space-y-2.5 text-[13px]">
                        {(p.benefits || []).slice(0, 4).map((b) => <li key={b} className="flex gap-2"><Plus className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#fb9b4b]" />{b}</li>)}
                      </ul>
                      <Link to="/signup" className={`ld-btn !h-11 mt-6 w-full ${lead ? 'ld-btn-light' : 'ld-btn-glass'}`}>Get started</Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Help Center: FAQ categories from the admin */}
        {help.length > 0 && (
          <section id="faq" className="relative px-5 md:px-8 py-20 md:py-28">
            <div className="max-w-[1320px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <p className="ld-label">Help Center</p>
                  <Split className="ld-h2 mt-3" text="Good to *know." />
                </div>
                <Link to="/help" className="ld-btn ld-btn-glass shrink-0">Visit the Help Center<ArrowUpRight className="w-4 h-4" /></Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {help.slice(0, 6).map((c, i) => <HelpCategoryCard key={c.id} c={c} i={i} />)}
              </div>
            </div>
          </section>
        )}

        {/* closing call */}
        <section className="relative px-5 md:px-8 pt-6 pb-20 md:pb-28">
          <div className="ld-cta ld-glass max-w-[860px] mx-auto text-center">
            <Split className="ld-display" text="Own your first *coin *today." />
            <p className="ld-lead mt-4 ld-reveal">Create your account, verify who you are, deposit crypto or cash and start.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 ld-reveal">
              <Link to="/signup" className="ld-btn ld-btn-light">Open a free account<ArrowRight className="w-4 h-4" /></Link>
              <Link to="/auth" className="ld-btn ld-btn-glass">Log in</Link>
            </div>
          </div>
        </section>
      </div>

      {/* ---------------- footer ---------------- */}
      <footer className="ld-footer relative px-5 md:px-8 pt-10 pb-8">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="w-7 h-7" />
            {brand && <span className="ld-brand text-[16px]">{brand}</span>}
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#a1a1aa]">
            <a href="#crypto" onClick={go('crypto')} className="hover:text-white">Crypto</a>
            <a href="#markets" onClick={go('markets')} className="hover:text-white">Markets</a>
            <a href="#app" onClick={go('app')} className="hover:text-white">The app</a>
            <a href="#security" onClick={go('security')} className="hover:text-white">Security</a>
            {showPlans && <a href="#plans" onClick={go('plans')} className="hover:text-white">Plans</a>}
            <Link to="/help" className="hover:text-white">Help Center</Link>
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <Link to="/auth" className="hover:text-white">Log in</Link>
          </nav>
        </div>
        <div className="max-w-[1240px] mx-auto mt-8 pt-6 ld-foot-base flex flex-col md:flex-row gap-3 md:justify-between text-[11px] text-[#71717a]">
          <p>© {year}{brand ? ` ${brand}` : ''}. All rights reserved.</p>
          <p className="max-w-[560px] leading-relaxed md:text-right">Crypto prices are volatile and investing involves risk. Prices can go down as well as up, and past returns do not guarantee future results.</p>
        </div>
      </footer>
    </div>
  );
}
