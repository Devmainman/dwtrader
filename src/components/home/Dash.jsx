// Dashboard. Design rules: one accent (the primary action and the chart line), hairlines
// instead of boxes inside boxes, a light large number, small quiet labels, and only live
// data: wallets (20 s), Binance prices and price history, and the user's own ledger.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, CandlestickChart, MoreHorizontal, Eye, EyeOff, ChevronDown,
  ChevronRight, ArrowDownLeft, ArrowUpRight, Info
} from 'lucide-react';
import { useWallets, useHidden, money, currencySymbol, qty, price, CoinIcon, CurrencySheet } from '../wallet/shared';
import { AssetSheet } from '../wallet/AssetList';
import QuickActionsSheet from './QuickActionsSheet';
import { cryptoApi } from '../../api/products';
import { useUserAuth } from '../../context/UserAuthContext';

/* ================================ data hooks ================================ */

let sparkCache = {};
function useSparklines(symbols) {
  const key = symbols.join(',');
  const [lines, setLines] = useState(sparkCache);
  useEffect(() => {
    const need = symbols.filter((s) => !sparkCache[s]);
    if (!need.length) return undefined;
    let alive = true;
    cryptoApi.sparklines(need).then((d) => { sparkCache = { ...sparkCache, ...d }; if (alive) setLines(sparkCache); }).catch(() => {});
    return () => { alive = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return lines;
}

let marketsCache = null;
function useMarkets() {
  const [data, setData] = useState(marketsCache);
  useEffect(() => {
    let alive = true;
    const load = () => cryptoApi.markets().then((d) => { marketsCache = d; if (alive) setData(d); }).catch(() => {});
    load();
    const t = setInterval(() => document.visibilityState === 'visible' && load(), 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return data;
}

/**
 * Portfolio value over a range: the fiat balance plus each coin you hold now, priced at
 * each past close (scaled so the last point equals today's live value). With no crypto
 * held the line would be flat, so the chart shows Bitcoin instead and says so.
 */
const histCache = {};
function usePortfolioSeries(data, range) {
  const held = useMemo(() => (data?.assets || []).filter((a) => a.balance > 0 && a.price).slice(0, 12), [data]);
  const market = held.length === 0;
  const symbols = market ? ['BTC'] : held.map((a) => a.symbol);
  const key = `${symbols.join(',')}:${range}`;
  const [raw, setRaw] = useState(histCache[key] || null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!data) return undefined;
    let alive = true;
    // Keep the previous line on screen (dimmed) while the new range loads.
    if (histCache[key]) setRaw(histCache[key]);
    setLoading(!histCache[key]);
    cryptoApi.history(symbols, range).then((d) => { histCache[key] = d; if (alive) setRaw(d); })
      .catch(() => {}).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [key, !!data]); // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => {
    if (!data || !raw?.series) return null;
    const btcNow = (data.assets || []).find((a) => a.symbol === 'BTC')?.price;
    const list = market
      ? [{ s: 'BTC', bal: 1, now: btcNow, pts: raw.series.BTC }]
      : held.map((a) => ({ s: a.symbol, bal: a.balance, now: a.price, pts: raw.series[a.symbol] }));
    const usable = list.filter((x) => x.pts?.length > 1 && x.now);
    if (!usable.length) return null;
    const n = Math.min(...usable.map((x) => x.pts.length));
    const base = market ? 0 : data.totals.fiat + list.filter((x) => !usable.includes(x)).reduce((s, x) => s + x.bal * (x.now || 0), 0);
    const ref = usable[0].pts.slice(-n);
    const points = ref.map(([t], i) => [t, base + usable.reduce((sum, x) => {
      const p = x.pts.slice(-n);
      return sum + x.bal * p[i][1] * (x.now / p[p.length - 1][1]);
    }, 0)]);
    return { points, market, loading };
  }, [data, raw, held, market, loading]);
}

/** Eases a number toward its new value (balances glide instead of jumping). */
function useTween(target, ms = 650) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (target == null) return undefined;
    const start = performance.now();
    const a = from.current ?? target;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - (1 - t) ** 3;
      const next = a + (target - a) * e;
      from.current = next;
      setV(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/** Text that briefly tints green / red when its value moves (live prices). */
function Flash({ value, children, className = '' }) {
  const prev = useRef(value);
  const [dir, setDir] = useState(null);
  useEffect(() => {
    if (prev.current != null && value != null && value !== prev.current) {
      setDir(value > prev.current ? 'up' : 'down');
      const t = setTimeout(() => setDir(null), 900);
      prev.current = value;
      return () => clearTimeout(t);
    }
    prev.current = value;
    return undefined;
  }, [value]);
  return <span className={`dash-flash ${dir ? `dash-flash-${dir}` : ''} ${className}`}>{children}</span>;
}

/** Tabs with a pill (or underline) that slides to the active one. */
function SlideTabs({ items, value, onChange, variant = 'pill' }) {
  const refs = useRef({});
  const [box, setBox] = useState(null);
  useLayoutEffect(() => {
    const el = refs.current[value];
    if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value, items.length]);
  const pill = variant === 'pill';
  return (
    <div className={`relative flex ${pill ? '' : 'gap-3'}`} role="tablist" data-no-busy>
      {box && (
        <span aria-hidden className={`absolute transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${pill ? 'top-0 h-8 rounded-full bg-white/[.08]' : '-bottom-px h-[2px] rounded-full bg-blue-500'}`}
          style={{ left: box.left, width: box.width }} />
      )}
      {items.map(([k, label]) => (
        <button key={k} ref={(el) => { refs.current[k] = el; }} type="button" role="tab" aria-selected={value === k} onClick={() => onChange(k)}
          className={`relative ${pill ? 'h-8 px-3 rounded-full text-[11px] font-semibold uppercase tracking-wide' : 'h-7 text-[11px] font-medium'} transition-colors ${value === k ? 'text-zinc-100' : 'text-neutral-500 hover:text-zinc-300'}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

const buzz = () => { try { if (window.matchMedia('(pointer: coarse)').matches) navigator.vibrate?.(4); } catch { /* */ } };

/* ================================ small pieces ================================ */

export function Sparkline({ points, width = 64, height = 24, className = '' }) {
  if (!points || points.length < 2) return <span style={{ width, height }} className="inline-block" />;
  const min = Math.min(...points);
  const span = Math.max(...points) - min || 1;
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${((i / (points.length - 1)) * width).toFixed(1)},${(height - 2 - ((p - min) / span) * (height - 4)).toFixed(1)}`).join(' ');
  const up = points[points.length - 1] >= points[0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={`${up ? 'text-emerald-400' : 'text-red-400'} ${className}`} aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const signed = (v, cur) => `${v >= 0 ? '+' : '−'}${money(Math.abs(v), cur)}`;
const pctText = (v) => `${v >= 0 ? '+' : '−'}${Math.abs(v || 0).toFixed(2)}%`;
const toneOf = (v) => (v >= 0 ? 'text-emerald-400' : 'text-red-400');

function SectionHead({ title, note, action, onAction }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-1">
      <p className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-100">{title}{note != null && <span className="ml-1.5 text-[11px] font-normal text-neutral-500">{note}</span>}</p>
      {action && <button type="button" onClick={onAction} className="text-[11px] text-neutral-400 hover:text-zinc-100 transition flex items-center">{action}<ChevronRight className="w-3.5 h-3.5" /></button>}
    </div>
  );
}

/* ================================ the chart ================================ */

const RANGE_LABEL = { '1d': 'today', '1w': 'past week', '1m': 'past month', '1y': 'past year' };
const fmtTime = (t, range) => new Date(t).toLocaleString('en-US', range === '1d'
  ? { hour: 'numeric', minute: '2-digit' }
  : range === '1y' ? { month: 'short', day: 'numeric', year: 'numeric' } : { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' });

/** Area chart you can scrub with a finger or the mouse. Dotted line = where the range started. */
function ScrubChart({ points, height = 150, onScrub, masked, dim }) {
  const wrap = useRef(null);
  const [w, setW] = useState(0);
  const [idx, setIdx] = useState(null);
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Keep at most ~140 points so the path stays light.
  const pts = useMemo(() => {
    if (!points) return [];
    const step = Math.max(1, Math.ceil(points.length / 140));
    const out = points.filter((_, i) => i % step === 0);
    if (out[out.length - 1] !== points[points.length - 1]) out.push(points[points.length - 1]);
    return out;
  }, [points]);

  const geo = useMemo(() => {
    if (!w || pts.length < 2) return null;
    const vals = pts.map((p) => p[1]);
    let min = Math.min(...vals); let max = Math.max(...vals);
    if (max - min < Math.abs(max) * 0.0005) { min -= Math.abs(max) * 0.001 + 1; max += Math.abs(max) * 0.001 + 1; }
    const pad = (max - min) * 0.14;
    const top = 10; const bottom = height - 6;
    const x = (i) => (i / (pts.length - 1)) * w;
    const y = (v) => bottom - ((v - (min - pad)) / (max - min + pad * 2)) * (bottom - top);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
    return { x, y, line, area: `${line} L${w},${height} L0,${height} Z`, startY: y(pts[0][1]) };
  }, [pts, w, height]);

  const pick = (clientX) => {
    if (!geo || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const i = Math.max(0, Math.min(pts.length - 1, Math.round(((clientX - r.left) / r.width) * (pts.length - 1))));
    if (i === idx) return;
    if (i % 4 === 0) buzz(); // a light tick every few points while scrubbing on phones
    setIdx(i);
    onScrub?.(pts[i]);
  };
  const end = () => { setIdx(null); onScrub?.(null); };
  const up = pts.length > 1 && pts[pts.length - 1][1] >= pts[0][1];
  const color = up ? 'var(--dash-up)' : 'var(--dash-down)';

  return (
    <div ref={wrap} className="relative w-full select-none touch-pan-y" style={{ height }}
      onPointerDown={(e) => pick(e.clientX)} onPointerMove={(e) => (e.pointerType === 'mouse' || e.buttons) && pick(e.clientX)}
      onPointerLeave={end} onPointerUp={(e) => e.pointerType !== 'mouse' && end()} onPointerCancel={end}>
      {!geo ? <div className="absolute inset-x-0 bottom-4 top-6 rounded-2xl skeleton opacity-60" /> : (
        <svg width={w} height={height} className={`block overflow-visible transition-opacity duration-300 ${dim ? 'opacity-35' : 'opacity-100'}`} aria-label="Portfolio value chart">
          <defs>
            <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity={masked ? 0.08 : 0.22} />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" x2={w} y1={geo.startY} y2={geo.startY} stroke="currentColor" className="text-neutral-600" strokeWidth="1" strokeDasharray="1 4" strokeLinecap="round" />
          <path d={geo.area} fill="url(#dash-area)" className="dash-fade" />
          <path key={geo.line.length} d={geo.line} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" pathLength="1" className="dash-draw" />
          {idx != null && (
            <g>
              <line x1={geo.x(idx)} x2={geo.x(idx)} y1="0" y2={height} stroke="currentColor" className="text-neutral-500" strokeWidth="1" />
              <circle cx={geo.x(idx)} cy={geo.y(pts[idx][1])} r="7" fill={color} opacity=".18" />
              <circle cx={geo.x(idx)} cy={geo.y(pts[idx][1])} r="3.5" fill={color} stroke="var(--card)" strokeWidth="1.5" />
            </g>
          )}
          {idx == null && <circle cx={w} cy={geo.y(pts[pts.length - 1][1])} r="3" fill={color} className="dash-pulse" />}
        </svg>
      )}
    </div>
  );
}

/* ================================ portfolio hero ================================ */

const RANGES = ['1d', '1w', '1m', '1y'];
const PALETTE = ['var(--color-blue-500)', '#7c8cff', '#2bd4a4', '#f5b544', '#f06c9b', '#5cc8ff', '#b892ff'];

export function Portfolio({ chartHeight = 150 }) {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const { data, reload } = useWallets();
  const [hidden, toggleHidden] = useHidden();
  const [range, setRange] = useState(() => { try { return localStorage.getItem('dash:range') || '1w'; } catch { return '1w'; } });
  const [scrub, setScrub] = useState(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const series = usePortfolioSeries(data, range);
  const cur = data?.currency || 'USD';
  const total = data?.totals.total ?? 0;
  const pickRange = (r) => { setRange(r); try { localStorage.setItem('dash:range', r); } catch { /* */ } };

  // Headline value: the scrubbed point, or today's live total.
  const tweened = useTween(total);
  const shown = scrub && !series?.market ? scrub[1] : tweened;
  const whole = Math.trunc(shown).toLocaleString('en-US');
  const cents = Math.abs(shown - Math.trunc(shown)).toFixed(2).slice(1);

  const first = series?.points?.[0]?.[1];
  const last = series?.points?.[series.points.length - 1]?.[1];
  const at = scrub ? scrub[1] : last;
  const change = first != null && at != null ? at - first : null;
  const changePct = change != null && first ? (change / first) * 100 : null;

  const h = new Date().getHours();
  const hello = `${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}${user?.firstName ? `, ${user.firstName}` : ''}`;

  // Allocation: fiat + each coin with value, largest first, tail grouped as "Other".
  const alloc = useMemo(() => {
    if (!data || total <= 0) return [];
    const rows = [{ k: cur, v: data.totals.fiat }, ...(data.assets || []).filter((a) => a.value > 0).map((a) => ({ k: a.symbol, v: a.value }))]
      .filter((r) => r.v > 0).sort((a, b) => b.v - a.v);
    const top = rows.slice(0, 4);
    const rest = rows.slice(4).reduce((s, r) => s + r.v, 0);
    if (rest > 0) top.push({ k: 'Other', v: rest });
    return top.map((r, i) => ({ ...r, pct: (r.v / total) * 100, color: PALETTE[i % PALETTE.length] }));
  }, [data, total, cur]);

  return (
    <section className="dash-panel">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-neutral-400 truncate">{hello}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <button type="button" onClick={toggleHidden} className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-zinc-100 hover:bg-white/5 transition" aria-label={hidden ? 'Show balances' : 'Hide balances'}>
              {hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button type="button" onClick={() => setCurrencyOpen(true)} className="h-7 pl-2.5 pr-1.5 rounded-full border border-white/10 text-[11px] font-medium text-zinc-200 flex items-center gap-0.5 hover:bg-white/5 transition">
              {cur}<ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-neutral-500 flex items-center gap-1.5 h-4">
          {scrub ? fmtTime(scrub[0], range) : (
            <>Total balance<span className="dash-live" title="Updates live" /><span className="text-[10px] text-neutral-600">Live</span></>
          )}
        </p>
        <div className="mt-1 h-[40px] flex items-baseline">
          {!data ? <span className="h-9 w-48 rounded-lg skeleton" /> : hidden ? (
            <span className="text-[34px] font-light tracking-[-0.03em] text-zinc-100 leading-none">••••••</span>
          ) : (
            <p className="text-zinc-100 leading-none tabular-nums tracking-[-0.03em]">
              <span className="text-[22px] font-light align-[6px] mr-0.5 text-neutral-400">{currencySymbol(cur)}</span>
              <span className="text-[34px] font-light">{whole}</span>
              <span className="text-[22px] font-light text-neutral-500">{cents}</span>
            </p>
          )}
        </div>
        <div className="mt-2 h-4 text-[11px] tabular-nums">
          {series?.market ? (
            <span className="text-neutral-500 flex items-center gap-1"><Info className="w-3 h-3" />Chart shows Bitcoin until you hold crypto
              {scrub && <span className="text-zinc-300 ml-1">· {price(scrub[1], cur)}</span>}</span>
          ) : change != null && !hidden ? (
            <span className={toneOf(change)}>{signed(change, cur)} ({pctText(changePct)}) <span className="text-neutral-500">{scrub ? 'since start' : RANGE_LABEL[range]}</span></span>
          ) : null}
        </div>
      </div>

      <div className="mt-3">
        <ScrubChart points={series?.points} height={chartHeight} onScrub={setScrub} masked={hidden} dim={series?.loading} />
      </div>

      <div className="px-3 pb-1 flex items-center justify-between">
        <SlideTabs items={RANGES.map((r) => [r, r])} value={range} onChange={(r) => { buzz(); pickRange(r); }} />
        <button type="button" onClick={() => navigate('/wallet')} className="h-8 px-2 text-[11px] text-neutral-400 hover:text-zinc-100 flex items-center">Details<ChevronRight className="w-3.5 h-3.5" /></button>
      </div>

      {alloc.length > 0 && (
        <div className="px-5 pt-3 pb-5 border-t border-white/[.06]">
          <div className="flex h-1.5 gap-[3px] rounded-full overflow-hidden">
            {alloc.map((a) => <span key={a.k} className="h-full rounded-full transition-[flex-grow] duration-700" style={{ flexGrow: Math.max(a.pct, 1.5), background: a.color }} />)}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {alloc.map((a) => (
              <span key={a.k} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-[3px]" style={{ background: a.color }} />
                <span className="text-zinc-200 font-medium">{a.k}</span>
                <span className="text-neutral-500 tabular-nums">{a.pct < 0.1 ? '<0.1' : a.pct.toFixed(1)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {currencyOpen && <CurrencySheet current={cur} onClose={() => setCurrencyOpen(false)} onChanged={() => reload()} />}
    </section>
  );
}

/* ================================ action bar ================================ */

export function ActionBar() {
  const navigate = useNavigate();
  const { data } = useWallets();
  const [more, setMore] = useState(false);
  const items = [
    { label: 'Deposit', icon: ArrowDownToLine, to: '/deposite', primary: true },
    ...(data?.convertEnabled !== false ? [{ label: 'Convert', icon: ArrowLeftRight, to: '/convert' }] : []),
    { label: 'Withdraw', icon: ArrowUpFromLine, to: '/withdraw' },
    { label: 'Trade', icon: CandlestickChart, to: '/trademain' },
    { label: 'More', icon: MoreHorizontal, onClick: () => setMore(true) }
  ];
  return (
    <nav className="dash-panel p-1.5 grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }} aria-label="Quick actions">
      {items.map((a) => (
        <button key={a.label} type="button" onClick={a.onClick || (() => navigate(a.to))}
          className={`h-[62px] rounded-[18px] flex flex-col items-center justify-center gap-1 transition active:scale-[.96] ${a.primary ? 'bg-blue-600 text-white hover:bg-blue-500' : 'text-zinc-200 hover:bg-white/[.05]'}`}>
          <a.icon className="w-[18px] h-[18px]" strokeWidth={1.9} />
          <span className={`text-[11px] font-medium ${a.primary ? 'text-white' : 'text-neutral-400'}`}>{a.label}</span>
        </button>
      ))}
      {more && <QuickActionsSheet onClose={() => setMore(false)} />}
    </nav>
  );
}

/* ================================ assets ================================ */

export function Assets({ limit = 5 }) {
  const navigate = useNavigate();
  const { data } = useWallets();
  const [hidden] = useHidden();
  const [open, setOpen] = useState(null);
  const cur = data?.currency || 'USD';
  const total = data?.totals.total || 0;
  const coins = (data?.assets || []).slice(0, limit);
  const lines = useSparklines(coins.map((a) => a.symbol));
  const rows = data ? [{ a: data.fiat, fiat: true }, ...coins.map((a) => ({ a, fiat: false }))] : [];
  return (
    <section className="dash-panel px-4 pt-4 pb-2">
      <SectionHead title="Assets" note={data ? (data.assets.length + 1) : null} action="All assets" onAction={() => navigate('/wallet')} />
      {!data ? <div className="space-y-2 py-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-11 rounded-xl skeleton" />)}</div> : (
        <ul className="divide-y divide-white/[.06]">
          {rows.map(({ a, fiat }) => (
            <li key={a.symbol}>
              <button type="button" onClick={() => setOpen({ a, fiat })} className="dash-row w-full flex items-center gap-3 py-3 text-left group">
                <CoinIcon symbol={a.symbol} icon={a.icon} fiat={fiat} size={34} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-medium text-zinc-100 truncate group-hover:text-white">{fiat ? a.name : a.name}</span>
                  <span className="block text-[11px] text-neutral-500 truncate tabular-nums">
                    {fiat ? 'Cash · trading & investing' : <>{price(a.price, cur)} <span className={toneOf(a.change24h)}>{pctText(a.change24h)}</span></>}
                  </span>
                </span>
                {!fiat && <Sparkline points={lines[a.symbol]} width={48} height={20} className="hidden min-[360px]:block shrink-0 opacity-80" />}
                <span className="text-right shrink-0 w-[96px]">
                  <Flash value={hidden ? null : a.value} className="block text-[13px] font-medium text-zinc-100 tabular-nums truncate">{hidden ? '••••' : money(a.value, cur)}</Flash>
                  <span className="block text-[11px] text-neutral-500 tabular-nums truncate">
                    {hidden ? '••••' : fiat ? `${total ? ((a.value / total) * 100).toFixed(1) : '0.0'}%` : `${qty(a.balance)} ${a.symbol}`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && <AssetSheet a={open.a} fiat={open.fiat} currency={cur} convertEnabled={data?.convertEnabled !== false} onClose={() => setOpen(null)} />}
    </section>
  );
}

/* ================================ markets ================================ */

const STABLE = new Set(['USDT', 'USDC', 'DAI', 'FDUSD', 'TUSD', 'USDP', 'USDE', 'PYUSD']);
const openCoin = (navigate, a) => navigate(a.enabled ? `/convert?direction=fiat_to_crypto&coin=${a.symbol}` : '/trademain');

export function Markets({ rows = 6 }) {
  const navigate = useNavigate();
  const m = useMarkets();
  const [tab, setTab] = useState('popular');
  const cur = m?.currency || 'USD';
  const list = useMemo(() => {
    const all = (m?.markets || []).filter((a) => !STABLE.has(a.symbol));
    if (tab === 'gainers') return [...all].sort((a, b) => b.change24h - a.change24h).slice(0, rows);
    if (tab === 'losers') return [...all].sort((a, b) => a.change24h - b.change24h).slice(0, rows);
    return all.slice(0, rows);
  }, [m, tab, rows]);
  const lines = useSparklines(list.map((a) => a.symbol));
  const tabs = [['popular', 'Top'], ['gainers', 'Gainers'], ['losers', 'Losers']];
  return (
    <section className="dash-panel px-4 pt-4 pb-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-100">Markets</p>
        <SlideTabs items={tabs} value={tab} onChange={setTab} variant="line" />
      </div>
      {!m ? <div className="space-y-2 py-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-11 rounded-xl skeleton" />)}</div> : (
        <ul key={tab} className="divide-y divide-white/[.06] dash-rise">
          {list.map((a) => (
            <li key={a.symbol}>
              <button type="button" onClick={() => openCoin(navigate, a)} className="dash-row w-full flex items-center gap-3 py-3 text-left group">
                <CoinIcon symbol={a.symbol} icon={a.icon} size={30} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-medium text-zinc-100 truncate">{a.name}</span>
                  <span className="block text-[11px] text-neutral-500">{a.symbol}</span>
                </span>
                <Sparkline points={lines[a.symbol]} width={52} height={20} className="hidden min-[360px]:block shrink-0 opacity-80" />
                <span className="text-right shrink-0 w-[88px]">
                  <Flash value={a.price} className="block text-[13px] font-medium text-zinc-100 tabular-nums truncate">{price(a.price, cur)}</Flash>
                  <span className={`block text-[11px] tabular-nums ${toneOf(a.change24h)}`}>{pctText(a.change24h)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ================================ activity ================================ */

const dayLabel = (d) => {
  const day = new Date(d); const now = new Date();
  const diff = Math.round((new Date(now.toDateString()) - new Date(day.toDateString())) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export function Activity({ limit = 6 }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  useEffect(() => { cryptoApi.activity(limit).then((d) => setItems(d?.transactions || [])).catch(() => setItems([])); }, [limit]);
  const groups = useMemo(() => {
    const g = [];
    (items || []).forEach((t) => {
      const k = dayLabel(t.createdAt);
      if (!g.length || g[g.length - 1].k !== k) g.push({ k, rows: [] });
      g[g.length - 1].rows.push(t);
    });
    return g;
  }, [items]);
  return (
    <section className="dash-panel px-4 pt-4 pb-2">
      <SectionHead title="Activity" action="History" onAction={() => navigate('/transactionhistory')} />
      {!items ? <div className="space-y-2 py-2">{[0, 1, 2].map((i) => <div key={i} className="h-11 rounded-xl skeleton" />)}</div>
        : !items.length ? <p className="py-6 text-center text-[12px] text-neutral-500">Nothing yet. Deposits, conversions and trades appear here.</p>
          : groups.map((g) => (
            <div key={g.k}>
              <p className="pt-2 pb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">{g.k}</p>
              <ul className="divide-y divide-white/[.06]">
                {g.rows.map((t) => {
                  const inflow = t.direction === 'in';
                  return (
                    <li key={t.id} className="flex items-center gap-3 py-2.5">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${inflow ? 'border-emerald-500/25 text-emerald-400' : 'border-white/10 text-neutral-400'}`}>
                        {inflow ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[12px] text-zinc-100 truncate first-letter:uppercase">{t.label}</span>
                        <span className="block text-[10px] text-neutral-500">{new Date(t.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}{t.status && t.status !== 'completed' ? ` · ${t.status}` : ''}</span>
                      </span>
                      <span className={`text-[12px] font-medium tabular-nums ${inflow ? 'text-emerald-400' : 'text-zinc-300'}`}>{inflow ? '+' : '−'}{money(t.amount, t.currency)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
    </section>
  );
}
