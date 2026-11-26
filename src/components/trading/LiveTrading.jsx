// Live trading: a live chart of the selected market, an order ticket (long/short, leverage,
// take-profit / stop-loss), the market list with live prices, and open positions + history.
// Prices come from the server's quotes; the chart's history from Binance (crypto) or the
// live ticks (forex).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CandlestickChart, Search, X, ChevronDown, Star, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { marketApi, apiError } from '../../api/products';
import { useUserAuth } from '../../context/UserAuthContext';
import { toast } from '../../lib/toast';
import { PAIRS } from '../trade/MarketSection/marketData';
import { Page, Button, Badge, Tabs, Loading, Empty, AnimatedNumber, stagger, formatMoney } from '../products/ui';
import { ScrubChart, SlideTabs } from '../home/Dash';
import { toneOf } from '../copytrade/shared';

const LEVERAGES = [1, 2, 5, 10, 20];
const fmtPrice = (p) => {
  if (!(p > 0)) return '—';
  if (p >= 1000) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(4);
  return p.toPrecision(4);
};
const signed = (n, digits = 2) => `${n > 0 ? '+' : ''}${Number(n).toFixed(digits)}`;
const compact = (v) => (v >= 1e9 ? `${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(2)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : v.toFixed(0));

/** Polls server quotes for `symbols`; keeps a short tick history for the forex chart and flash direction. */
function useQuotes(symbols, interval = 4000) {
  const [quotes, setQuotes] = useState({});
  const [meta, setMeta] = useState({ currency: 'USD' });
  const history = useRef({});
  const key = symbols.join(',');
  const load = useCallback(async () => {
    if (!symbols.length) return;
    try {
      const data = await marketApi.quotes(symbols);
      setQuotes((prev) => {
        const next = { ...prev };
        for (const [sym, q] of Object.entries(data.quotes)) {
          const before = prev[sym]?.price;
          next[sym] = { ...q, dir: before && q.price !== before ? (q.price > before ? 'up' : 'down') : prev[sym]?.dir, tick: before !== q.price ? (prev[sym]?.tick || 0) + 1 : prev[sym]?.tick || 0 };
          const h = history.current[sym] || [];
          if (h[h.length - 1]?.[1] !== q.price) history.current[sym] = [...h, [Date.now(), q.price]].slice(-120);
        }
        return next;
      });
      setMeta({ currency: data.currency, usdRate: data.usdRate });
    } catch { /* keep last prices; the next tick retries */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    load();
    const id = setInterval(() => { if (document.visibilityState === 'visible') load(); }, interval);
    return () => clearInterval(id);
  }, [load, interval]);
  return { quotes, meta, history: history.current };
}

const RANGES = { '1H': ['1m', 60], '1D': ['15m', 96], '1W': ['1h', 168], '1M': ['4h', 180] };
/** Binance candles for a crypto pair: closes for the chart, plus the day's high / low / volume. */
function useCandles(pair, range) {
  const [data, setData] = useState({});
  const sym = pair?.type === 'crypto' ? pair.binanceSymbol : null;
  useEffect(() => {
    if (!sym) return undefined;
    let alive = true;
    const [interval, limit] = RANGES[range];
    const load = () => Promise.all([
      fetch(`https://data-api.binance.vision/api/v3/klines?symbol=${sym}&interval=${interval}&limit=${limit}`).then((r) => r.json()),
      fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${sym}`).then((r) => r.json())
    ]).then(([k, t]) => {
      if (!alive || !Array.isArray(k)) return;
      setData({ key: `${sym}:${range}`, points: k.map((r) => [r[6], Number(r[4])]), high: +t.highPrice, low: +t.lowPrice, volume: +t.quoteVolume });
    }).catch(() => {});
    load();
    const id = setInterval(() => document.visibilityState === 'visible' && load(), 30000);
    return () => { alive = false; clearInterval(id); };
  }, [sym, range]);
  return sym && data.key === `${sym}:${range}` ? data : null;
}

function PairIcon({ pair, size = 32 }) {
  const [bad, setBad] = useState(false);
  return pair.image && !bad
    ? <img src={pair.image} alt="" onError={() => setBad(true)} style={{ width: size, height: size }} className="rounded-full bg-white/[.06] object-contain p-0.5 shrink-0" />
    : <div style={{ width: size, height: size }} className="rounded-full bg-white/[.06] border border-white/10 flex items-center justify-center text-[10px] font-semibold shrink-0">{pair.base.slice(0, 3)}</div>;
}

/* ------------------------------ chart ------------------------------ */

function MarketChart({ pair, q, ticks, onPick }) {
  const [range, setRange] = useState('1D');
  const [scrub, setScrub] = useState(null);
  const candles = useCandles(pair, range);
  const crypto = pair.type === 'crypto';
  // Keep the chart's last point on the live price.
  const points = useMemo(() => {
    const base = crypto ? candles?.points : ticks;
    if (!base?.length) return null;
    return q?.price ? [...base.slice(0, -1), [Date.now(), q.price]] : base;
  }, [crypto, candles, ticks, q?.price]);
  const price = scrub ? scrub[1] : q?.price;
  const first = points?.[0]?.[1];
  const change = scrub && first ? ((scrub[1] - first) / first) * 100 : q?.change;
  const up = (change ?? 0) >= 0;

  return (
    <section className="dash-panel">
      <div className="px-4 sm:px-5 pt-4 flex items-start justify-between gap-3">
        <button type="button" data-no-busy onClick={onPick} className="flex items-center gap-2.5 min-w-0 group">
          <PairIcon pair={pair} size={40} />
          <span className="text-left min-w-0">
            <span className="flex items-center gap-1 text-[15px] font-semibold tracking-[-0.01em]">{pair.base}<span className="text-neutral-500 font-normal">/{pair.quote}</span><ChevronDown className="w-4 h-4 text-neutral-500 group-hover:text-zinc-100 transition" /></span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-500"><span className="dash-live" />{q?.source === 'fx' ? 'Forex · reference rate' : 'Live · Binance'}</span>
          </span>
        </button>
        <div className="text-right shrink-0">
          <p key={q?.tick} className={`text-[26px] font-light tracking-[-0.03em] tabular-nums leading-none dash-flash ${!scrub && q?.dir ? `dash-flash-${q.dir}` : ''}`}>{fmtPrice(price)}</p>
          {typeof change === 'number' && (
            <p className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums ${up ? 'text-emerald-400' : 'text-red-400'}`}>
              {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}{signed(change)}% {scrub ? new Date(scrub[0]).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '24h'}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3">
        {points ? <ScrubChart points={points} height={190} onScrub={setScrub} />
          : <div className="h-[190px] flex flex-col items-center justify-center text-[11px] text-neutral-500 gap-2"><Activity className="w-5 h-5" />{crypto ? 'Loading chart…' : 'The line builds as prices tick…'}</div>}
      </div>
      <div className="px-3 pb-2 pt-1 flex items-center justify-between gap-2">
        {crypto ? <SlideTabs items={Object.keys(RANGES).map((r) => [r, r])} value={range} onChange={setRange} /> : <span className="px-2 text-[11px] text-neutral-500">Live ticks</span>}
        {crypto && candles && (
          <dl className="flex gap-3 sm:gap-4 pr-2 text-right">
            <div><dt className="text-[9px] uppercase tracking-wide text-neutral-500">High</dt><dd className="text-[11px] tabular-nums">{fmtPrice(candles.high)}</dd></div>
            <div><dt className="text-[9px] uppercase tracking-wide text-neutral-500">Low</dt><dd className="text-[11px] tabular-nums">{fmtPrice(candles.low)}</dd></div>
            <div className="hidden min-[380px]:block"><dt className="text-[9px] uppercase tracking-wide text-neutral-500">Vol</dt><dd className="text-[11px] tabular-nums">${compact(candles.volume)}</dd></div>
          </dl>
        )}
      </div>
    </section>
  );
}

/* ------------------------------ order ticket ------------------------------ */

function OrderTicket({ pair, q, balance, currency, usdRate, onPlaced }) {
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [showStops, setShowStops] = useState(false);
  const [tp, setTp] = useState('');
  const [sl, setSl] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { setTp(''); setSl(''); }, [pair.symbol, side]);

  const price = q?.price || 0;
  const n = Number(amount) || 0;
  const exposure = n * leverage;
  const liq = leverage > 1 && price ? (side === 'buy' ? price * (1 - 1 / leverage) : price * (1 + 1 / leverage)) : null;
  const units = price && usdRate ? exposure / usdRate / price : 0;
  const over = n > balance;
  const invalid = !(n > 0) || over || !price;

  const submit = async () => {
    setBusy(true);
    try {
      const res = await marketApi.open({ symbol: pair.symbol, side, amount: n, leverage, takeProfit: tp || undefined, stopLoss: sl || undefined });
      toast.success(`${side === 'buy' ? 'Bought' : 'Sold'} ${pair.base}`, { description: `Entry ${fmtPrice(res.entryPrice)} · ${formatMoney(n, currency)}${leverage > 1 ? ` × ${leverage}` : ''}` });
      setAmount('');
      onPlaced();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const buy = side === 'buy';
  const chip = (on) => `h-8 rounded-full text-[11px] font-semibold transition active:scale-95 ${on ? 'bg-zinc-100 text-neutral-900' : 'bg-white/[.05] border border-white/[.08] text-neutral-400 hover:text-zinc-100'}`;
  return (
    <section className="dash-panel p-4 sm:p-5 lg:sticky lg:top-[84px]">
      <div className="relative grid grid-cols-2 p-1 rounded-full bg-white/[.04] border border-white/[.07]" data-no-busy>
        <span aria-hidden className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${buy ? 'translate-x-0 bg-emerald-500' : 'translate-x-full bg-red-500'}`} />
        {['buy', 'sell'].map((s) => (
          <button key={s} type="button" onClick={() => setSide(s)} className={`relative h-10 rounded-full text-[13px] font-semibold transition-colors ${side === s ? 'text-white' : 'text-neutral-400 hover:text-zinc-100'}`}>
            {s === 'buy' ? 'Buy / Long' : 'Sell / Short'}
          </button>
        ))}
      </div>

      <label className="block mt-4">
        <span className="flex justify-between text-[11px] font-medium text-neutral-400 mb-1.5"><span>Amount</span><span className="tabular-nums">Available {formatMoney(balance, currency)}</span></span>
        <span className={`flex items-center gap-2 h-14 px-4 rounded-2xl bg-white/[.04] border transition focus-within:ring-4 ${over ? 'border-red-500/60 focus-within:ring-red-500/10' : 'border-white/10 focus-within:border-blue-500/60 focus-within:ring-blue-500/10'}`}>
          <input type="number" inputMode="decimal" min="0" step="any" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="flex-1 min-w-0 bg-transparent outline-none text-[22px] font-light tabular-nums tracking-[-0.02em] text-zinc-100 placeholder:text-neutral-600" />
          <span className="text-[12px] font-semibold text-neutral-400">{currency}</span>
        </span>
        {over && <span className="block text-[11px] text-red-400 mt-1">More than your available balance</span>}
      </label>
      <div className="grid grid-cols-4 gap-1.5 mt-2" data-no-busy>
        {[25, 50, 75, 100].map((p) => (
          <button key={p} type="button" onClick={() => setAmount(String(Math.floor(balance * p) / 100))} className={chip(false)}>{p === 100 ? 'Max' : `${p}%`}</button>
        ))}
      </div>

      <p className="text-[11px] font-medium text-neutral-400 mt-4 mb-1.5">Leverage</p>
      <div className="grid grid-cols-5 gap-1.5" data-no-busy>
        {LEVERAGES.map((l) => <button key={l} type="button" onClick={() => setLeverage(l)} className={chip(leverage === l)}>{l}×</button>)}
      </div>

      <button type="button" data-no-busy onClick={() => setShowStops((v) => !v)} className="mt-4 flex items-center gap-1 text-[12px] font-medium text-neutral-400 hover:text-zinc-100">
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStops ? 'rotate-180' : ''}`} />Take profit / stop loss
      </button>
      {showStops && (
        <div className="grid grid-cols-2 gap-2 mt-2 animate-[rise-in_260ms_ease-out]">
          {[['Take profit', tp, setTp, buy ? 'Above price' : 'Below price'], ['Stop loss', sl, setSl, buy ? 'Below price' : 'Above price']].map(([label, v, set, ph]) => (
            <label key={label} className="block">
              <span className="block text-[10px] text-neutral-500 mb-1">{label}</span>
              <input type="number" step="any" placeholder={ph} value={v} onChange={(e) => set(e.target.value)}
                className="w-full h-11 rounded-xl bg-white/[.04] border border-white/10 px-3 text-[13px] tabular-nums text-zinc-100 placeholder:text-neutral-600 outline-none focus:border-blue-500/60" />
            </label>
          ))}
        </div>
      )}

      <dl className="mt-4 divide-y divide-white/[.06] border-y border-white/[.06] text-[12px]">
        <div className="flex justify-between py-2"><dt className="text-neutral-500">Position size</dt><dd className="tabular-nums">{formatMoney(exposure, currency)}</dd></div>
        <div className="flex justify-between py-2"><dt className="text-neutral-500">≈ Units</dt><dd className="tabular-nums">{units ? units.toPrecision(5) : '—'} {pair.base}</dd></div>
        <div className="flex justify-between py-2"><dt className="text-neutral-500">Entry</dt><dd className="tabular-nums">{fmtPrice(price)}</dd></div>
        {liq && <div className="flex justify-between py-2"><dt className="text-neutral-500">Liquidation</dt><dd className="tabular-nums text-amber-400">{fmtPrice(liq)}</dd></div>}
      </dl>
      <Button className={`w-full h-12 mt-4 !text-[14px] ${buy ? '!bg-emerald-500 hover:!bg-emerald-400 shadow-[0_12px_26px_-14px_#10b981]' : '!bg-red-500 hover:!bg-red-400 shadow-[0_12px_26px_-14px_#ef4444]'}`} busy={busy} disabled={invalid} onClick={submit}>
        {buy ? `Buy ${pair.base}` : `Sell ${pair.base}`}{n > 0 && ` · ${formatMoney(n, currency)}`}
      </Button>
      <p className="text-[10px] text-neutral-500 mt-2.5 text-center leading-relaxed">Orders fill at the live market price. With leverage you can lose your whole amount.</p>
    </section>
  );
}

/* ------------------------------ lists ------------------------------ */

function MarketRow({ pair, q, selected, onSelect, favorite, onFavorite, i }) {
  return (
    <li {...stagger(i)}>
      <button type="button" data-no-busy onClick={() => onSelect(pair.symbol)}
        className={`dash-row w-full flex items-center gap-3 px-2 py-2.5 rounded-2xl text-left ${selected ? 'bg-blue-600/10 ring-1 ring-blue-500/40' : ''}`}>
        <PairIcon pair={pair} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-tight">{pair.base}<span className="text-neutral-500 font-normal">/{pair.quote}</span></p>
          <p className="text-[10px] text-neutral-500 capitalize">{pair.type.replace('-', ' ')}</p>
        </div>
        <div className="text-right">
          <p key={q?.tick} className={`text-[13px] font-medium tabular-nums dash-flash ${q?.dir ? `dash-flash-${q.dir}` : ''}`}>{fmtPrice(q?.price)}</p>
          {typeof q?.change === 'number' ? <p className={`text-[11px] tabular-nums ${toneOf(q.change)}`}>{signed(q.change)}%</p> : <p className="text-[10px] text-neutral-600">{q ? 'FX' : '…'}</p>}
        </div>
        <span role="button" tabIndex={0} aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'}
          onClick={(e) => { e.stopPropagation(); onFavorite(pair.symbol); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onFavorite(pair.symbol); } }}
          className="p-1 -mr-1 text-neutral-600 hover:text-amber-400">
          <Star className={`w-4 h-4 transition-transform ${favorite ? 'fill-amber-400 text-amber-400 scale-110' : ''}`} />
        </span>
      </button>
    </li>
  );
}

function PositionRow({ p, onClose, i }) {
  const [busy, setBusy] = useState(false);
  const close = async () => {
    setBusy(true);
    try {
      const r = await marketApi.close(p._id);
      (r.pnl >= 0 ? toast.success : toast.info)(`Closed ${p.symbol}`, { description: `${signed(r.pnl)} ${r.currency}` });
      onClose();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };
  const long = p.side === 'long';
  return (
    <li {...stagger(i)} className={`${stagger(i).className} flex items-center gap-3 py-3`}>
      <span className={`w-1 self-stretch rounded-full ${long ? 'bg-emerald-500' : 'bg-red-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold flex items-center gap-1.5">
          <Badge tone={long ? 'success' : 'danger'}>{long ? 'LONG' : 'SHORT'}</Badge>{p.symbol}
          {p.leverage > 1 && <span className="text-[10px] text-neutral-500">{p.leverage}×</span>}
        </p>
        <p className="text-[10px] text-neutral-500 mt-0.5 tabular-nums truncate">
          {formatMoney(p.margin, p.currency)} · {fmtPrice(p.entryPrice)} → {fmtPrice(p.currentPrice)}
          {p.takeProfit ? ` · TP ${fmtPrice(p.takeProfit)}` : ''}{p.stopLoss ? ` · SL ${fmtPrice(p.stopLoss)}` : ''}
        </p>
      </div>
      <div className={`text-right ${toneOf(p.unrealizedPnl)}`}>
        <AnimatedNumber value={p.unrealizedPnl} format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`} className="text-[13px] font-semibold" />
        <p className="text-[10px] tabular-nums">{signed(p.unrealizedPercent)}%</p>
      </div>
      <button type="button" disabled={busy} onClick={close} aria-label={`Close ${p.symbol}`}
        className="h-8 px-3 rounded-full bg-white/[.06] border border-white/10 hover:bg-white/10 text-[11px] font-semibold text-zinc-200 flex items-center gap-1 active:scale-95 transition disabled:opacity-40">
        <X className="w-3 h-3" />Close
      </button>
    </li>
  );
}

export default function LiveTrading() {
  const { user, refreshUser } = useUserAuth();
  const groups = Object.keys(PAIRS);
  const [group, setGroup] = useState(groups.includes('Popular') ? 'Popular' : groups[0]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('BTC/USDT');
  const [favorites, setFavorites] = useState(() => { try { return JSON.parse(localStorage.getItem('cryptoFavorites') || '[]'); } catch { return []; } });
  const [panel, setPanel] = useState('positions');
  const [positions, setPositions] = useState(null);
  const [history, setHistory] = useState(null);
  const listRef = useRef(null);

  const allPairs = useMemo(() => {
    const map = new Map();
    Object.values(PAIRS).flat().forEach((p) => map.set(p.symbol, p));
    return map;
  }, []);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q ? [...allPairs.values()] : group === 'Favourites' ? [...allPairs.values()].filter((p) => favorites.includes(p.symbol)) : PAIRS[group] || [];
    return base.filter((p) => !q || p.symbol.toLowerCase().includes(q));
  }, [group, search, favorites, allPairs]);

  const openSymbols = (positions?.positions || []).map((p) => p.symbol);
  const symbols = useMemo(() => [...new Set([selected, ...visible.map((p) => p.symbol), ...openSymbols])].slice(0, 40),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, visible, openSymbols.join(',')]);
  const { quotes, meta, history: ticks } = useQuotes(symbols);

  const loadPositions = useCallback(async () => { try { setPositions(await marketApi.positions()); } catch { /* keep */ } }, []);
  const loadHistory = useCallback(async () => { try { setHistory(await marketApi.history({ limit: 30 })); } catch { /* keep */ } }, []);
  useEffect(() => {
    loadPositions();
    const id = setInterval(() => { if (document.visibilityState === 'visible') loadPositions(); }, 4000);
    return () => clearInterval(id);
  }, [loadPositions]);
  useEffect(() => { if (panel === 'history') loadHistory(); }, [panel, loadHistory]);

  const toggleFavorite = (sym) => setFavorites((f) => {
    const next = f.includes(sym) ? f.filter((x) => x !== sym) : [...f, sym];
    try { localStorage.setItem('cryptoFavorites', JSON.stringify(next)); } catch { /* ignore */ }
    return next;
  });
  const afterTrade = () => { loadPositions(); loadHistory(); refreshUser?.(); };
  const pair = allPairs.get(selected) || visible[0];
  const summary = positions?.summary;
  const currency = meta.currency || user?.currency || 'USD';

  return (
    <Page title="Trade" subtitle="Live crypto and forex markets" icon={CandlestickChart}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          {pair && <MarketChart pair={pair} q={quotes[pair.symbol]} ticks={ticks[pair.symbol]} onPick={() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />}
          <div className="lg:hidden">
            {pair && <OrderTicket pair={pair} q={quotes[pair.symbol]} balance={user?.balance || 0} currency={currency} usdRate={meta.usdRate || 1} onPlaced={afterTrade} />}
          </div>

          <section className="dash-panel px-4 pt-4 pb-2">
            <Tabs value={panel} onChange={setPanel} tabs={[
              { value: 'positions', label: summary?.count ? `Open positions (${summary.count})` : 'Open positions' },
              { value: 'history', label: 'History' }
            ]} />
            {panel === 'positions' && (positions === null ? <Loading /> : !positions.positions.length ? (
              <Empty icon={CandlestickChart} title="No open positions" text="Pick a market and place your first trade." />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <div className="rounded-2xl bg-white/[.03] border border-white/[.06] px-3 py-2"><p className="text-[10px] text-neutral-500">Margin in use</p><p className="text-[13px] font-medium tabular-nums">{formatMoney(summary.margin, currency)}</p></div>
                  <div className="rounded-2xl bg-white/[.03] border border-white/[.06] px-3 py-2"><p className="text-[10px] text-neutral-500">Unrealised P/L</p><p className={`text-[13px] font-semibold tabular-nums ${toneOf(summary.unrealizedPnl)}`}><AnimatedNumber value={summary.unrealizedPnl} format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`} /></p></div>
                </div>
                <ul className="divide-y divide-white/[.06]">
                  {positions.positions.map((p, i) => <PositionRow key={p._id} i={i} p={p} onClose={afterTrade} />)}
                </ul>
              </>
            ))}
            {panel === 'history' && (history === null ? <Loading /> : !history.items.length ? <Empty title="No closed trades yet" /> : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-1">
                  {[['Realised P/L', <span className={toneOf(history.stats.realizedPnl)}>{signed(history.stats.realizedPnl)}</span>], ['Win rate', `${history.stats.winRate}%`], ['Trades', history.stats.trades]].map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-white/[.03] border border-white/[.06] px-3 py-2"><p className="text-[10px] text-neutral-500">{k}</p><p className="text-[13px] font-semibold tabular-nums">{v}</p></div>
                  ))}
                </div>
                <ul className="divide-y divide-white/[.06]">
                  {history.items.map((h, i) => (
                    <li key={h._id} {...stagger(i)} className={`${stagger(i).className} py-2.5 flex justify-between gap-2`}>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium flex items-center gap-1.5"><Badge tone={h.side === 'long' ? 'success' : 'danger'}>{h.side.toUpperCase()}</Badge>{h.symbol}</p>
                        <p className="text-[10px] text-neutral-500 tabular-nums truncate">{fmtPrice(h.entryPrice)} → {fmtPrice(h.exitPrice)} · {new Date(h.closedAt).toLocaleString()}{h.closeReason !== 'manual' ? ` · ${h.closeReason.replace('_', ' ')}` : ''}</p>
                      </div>
                      <p className={`text-[13px] tabular-nums font-semibold ${toneOf(h.pnl)}`}>{signed(h.pnl)}</p>
                    </li>
                  ))}
                </ul>
              </>
            ))}
          </section>

          <section ref={listRef} className="dash-panel px-3 pt-4 pb-2 scroll-mt-24">
            <div className="px-1 flex items-center justify-between gap-2 mb-3">
              <p className="text-[13px] font-semibold tracking-[-0.01em]">Markets</p>
              <div className="relative w-[55%] max-w-[260px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input className="w-full h-9 rounded-full bg-white/[.04] border border-white/10 pl-8 pr-3 text-[12px] text-zinc-100 placeholder:text-neutral-500 outline-none focus:border-blue-500/60" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            {!search && (
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-no-busy>
                {['Favourites', ...groups].map((g) => (
                  <button key={g} type="button" onClick={() => setGroup(g)}
                    className={`shrink-0 h-8 px-3.5 rounded-full text-[12px] font-semibold transition ${group === g ? 'bg-zinc-100 text-neutral-900' : 'bg-white/[.04] border border-white/[.08] text-neutral-400 hover:text-zinc-100'}`}>{g}</button>
                ))}
              </div>
            )}
            {visible.length === 0 ? <Empty icon={Star} title={group === 'Favourites' ? 'No favourites yet' : 'No markets found'} text={group === 'Favourites' ? 'Tap the star on any market to pin it here.' : undefined} /> : (
              <ul key={`${group}-${search}`} className="max-h-[460px] lg:max-h-[600px] overflow-y-auto [scrollbar-width:thin]">
                {visible.map((p, i) => (
                  <MarketRow key={p.symbol} i={i} pair={p} q={quotes[p.symbol]} selected={p.symbol === selected} favorite={favorites.includes(p.symbol)}
                    onFavorite={toggleFavorite} onSelect={(s) => { setSelected(s); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="hidden lg:block">
          {pair && <OrderTicket pair={pair} q={quotes[pair.symbol]} balance={user?.balance || 0} currency={currency} usdRate={meta.usdRate || 1} onPlaced={afterTrade} />}
        </div>
      </div>
    </Page>
  );
}
