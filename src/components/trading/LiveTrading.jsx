// Live trading: market list with live prices, order ticket (long/short, leverage,
// take-profit/stop-loss), open positions with live P/L, and history.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CandlestickChart, Search, X, ChevronDown, Star } from 'lucide-react';
import { marketApi, apiError } from '../../api/products';
import { useUserAuth } from '../../context/UserAuthContext';
import { toast } from '../../lib/toast';
import { PAIRS } from '../trade/MarketSection/marketData';
import {
  Page, Panel, Button, Badge, Tabs, Field, inputClass, Loading, Empty, AnimatedNumber, stagger, formatMoney
} from '../products/ui';
import { Sparkline, toneOf } from '../copytrade/shared';

const LEVERAGES = [1, 2, 5, 10, 20];
const fmtPrice = (p) => {
  if (!(p > 0)) return '—';
  if (p >= 1000) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(4);
  return p.toPrecision(4);
};
const signed = (n, digits = 2) => `${n > 0 ? '+' : ''}${Number(n).toFixed(digits)}`;

/** Polls server quotes for `symbols`; keeps a short tick history for sparklines and flash direction. */
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
          if (h[h.length - 1] !== q.price) history.current[sym] = [...h, q.price].slice(-60);
        }
        return next;
      });
      setMeta({ currency: data.currency, usdRate: data.usdRate });
    } catch {
      // keep last prices; the next tick will retry
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    load();
    const id = setInterval(() => { if (document.visibilityState === 'visible') load(); }, interval);
    return () => clearInterval(id);
  }, [load, interval]);

  return { quotes, meta, history: history.current, reload: load };
}

function PairIcon({ pair, size = 32 }) {
  const [bad, setBad] = useState(false);
  return pair.image && !bad
    ? <img src={pair.image} alt="" onError={() => setBad(true)} style={{ width: size, height: size }} className="rounded-full bg-white/5 object-contain p-0.5 shrink-0" />
    : <div style={{ width: size, height: size }} className="rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-semibold shrink-0">{pair.base.slice(0, 3)}</div>;
}

function MarketRow({ pair, q, selected, onSelect, favorite, onFavorite, i }) {
  const flash = q?.dir === 'up' ? 'animate-[flash-up_900ms_ease-out]' : q?.dir === 'down' ? 'animate-[flash-down_900ms_ease-out]' : '';
  return (
    <li {...stagger(i)}>
      <button
        type="button"
        onClick={() => onSelect(pair.symbol)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${selected ? 'bg-blue-600/10 ring-1 ring-blue-500/40' : 'hover:bg-white/[0.03]'}`}
      >
        <PairIcon pair={pair} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">{pair.base}<span className="text-neutral-500 font-normal">/{pair.quote}</span></p>
          <p className="text-[10px] text-neutral-500 capitalize">{pair.type.replace('-', ' ')}</p>
        </div>
        <div className="text-right">
          <p key={q?.tick} className={`text-sm font-medium tabular-nums rounded px-1 -mx-1 ${flash}`}>{fmtPrice(q?.price)}</p>
          {typeof q?.change === 'number' ? <p className={`text-[10px] tabular-nums ${toneOf(q.change)}`}>{signed(q.change)}%</p> : <p className="text-[10px] text-neutral-600">{q ? 'FX' : '…'}</p>}
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'}
          onClick={(e) => { e.stopPropagation(); onFavorite(pair.symbol); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onFavorite(pair.symbol); } }}
          className="p-1 -mr-1 text-neutral-600 hover:text-amber-400"
        >
          <Star className={`w-3.5 h-3.5 ${favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
        </span>
      </button>
    </li>
  );
}

function OrderTicket({ pair, q, history, balance, currency, usdRate, onPlaced }) {
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
  const invalid = !(n > 0) || n > balance || !price;

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
  return (
    <Panel className="lg:sticky lg:top-4">
      <div className="flex items-center gap-3">
        <PairIcon pair={pair} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{pair.symbol}</p>
          <p className="text-[10px] text-neutral-500">{q?.source === 'fx' ? 'Forex · reference rate' : 'Live · Binance'}</p>
        </div>
        <div className="text-right">
          <p key={q?.tick} className={`text-base font-semibold tabular-nums rounded px-1 -mx-1 ${q?.dir === 'up' ? 'animate-[flash-up_900ms_ease-out]' : q?.dir === 'down' ? 'animate-[flash-down_900ms_ease-out]' : ''}`}>{fmtPrice(price)}</p>
          {typeof q?.change === 'number' && <p className={`text-[10px] tabular-nums ${toneOf(q.change)}`}>{signed(q.change)}% 24h</p>}
        </div>
      </div>
      <div className="mt-3 -mx-1"><Sparkline values={(history || []).map((v) => (v / (history[0] || 1)) * 100)} height={56} emptyText="Live chart builds as prices tick…" /></div>

      <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl bg-neutral-800/80 mt-3">
        {['buy', 'sell'].map((s) => (
          <button key={s} type="button" onClick={() => setSide(s)}
            className={`h-8 rounded-[10px] text-xs font-semibold transition ${side === s ? (s === 'buy' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white') : 'text-neutral-400'}`}>
            {s === 'buy' ? 'Buy / Long' : 'Sell / Short'}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Field label={`Amount (${currency})`} hint={`Available ${formatMoney(balance, currency)}`}>
          <input type="number" inputMode="decimal" min="0" step="any" className={inputClass} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <div className="grid grid-cols-4 gap-1.5 -mt-2 mb-4">
          {[25, 50, 75, 100].map((p) => (
            <button key={p} type="button" onClick={() => setAmount(String(Math.floor(balance * p) / 100))}
              className="h-7 rounded-lg bg-neutral-800 text-[11px] text-neutral-300 hover:bg-neutral-700 active:scale-95 transition">{p === 100 ? 'Max' : `${p}%`}</button>
          ))}
        </div>
        <p className="text-xs text-neutral-400 mb-1.5">Leverage</p>
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {LEVERAGES.map((l) => (
            <button key={l} type="button" onClick={() => setLeverage(l)}
              className={`h-7 rounded-lg text-[11px] font-medium transition active:scale-95 ${leverage === l ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>{l}×</button>
          ))}
        </div>
        <button type="button" onClick={() => setShowStops((v) => !v)} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white mb-3">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStops ? 'rotate-180' : ''}`} />Take profit / stop loss
        </button>
        {showStops && (
          <div className="grid grid-cols-2 gap-2 animate-[rise-in_260ms_ease-out]">
            <Field label="Take profit"><input type="number" step="any" className={inputClass} placeholder={buy ? '> price' : '< price'} value={tp} onChange={(e) => setTp(e.target.value)} /></Field>
            <Field label="Stop loss"><input type="number" step="any" className={inputClass} placeholder={buy ? '< price' : '> price'} value={sl} onChange={(e) => setSl(e.target.value)} /></Field>
          </div>
        )}
        <dl className="text-xs space-y-1.5 bg-neutral-900 rounded-xl p-3 mb-4">
          <div className="flex justify-between"><dt className="text-neutral-400">Position size</dt><dd className="tabular-nums">{formatMoney(exposure, currency)}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-400">≈ Units</dt><dd className="tabular-nums">{units ? units.toPrecision(5) : '—'} {pair.base}</dd></div>
          {liq && <div className="flex justify-between"><dt className="text-neutral-400">Liquidation price</dt><dd className="tabular-nums text-amber-400">{fmtPrice(liq)}</dd></div>}
        </dl>
        <Button className={`w-full h-11 text-sm ${buy ? '!bg-emerald-500 hover:!bg-emerald-400' : '!bg-red-500 hover:!bg-red-400'}`} busy={busy} disabled={invalid} onClick={submit}>
          {buy ? `Buy ${pair.base}` : `Sell ${pair.base}`}
        </Button>
        <p className="text-[10px] text-neutral-500 mt-2 text-center">Orders fill at the live market price. You can lose your whole amount on leveraged trades.</p>
      </div>
    </Panel>
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
  return (
    <li {...stagger(i)} className={`${stagger(i).className} flex items-center gap-3 py-3`}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">
          <Badge tone={p.side === 'long' ? 'success' : 'danger'}>{p.side === 'long' ? 'LONG' : 'SHORT'}</Badge>
          <span className="ml-1.5">{p.symbol}</span>
          {p.leverage > 1 && <span className="text-[10px] text-neutral-500"> · {p.leverage}×</span>}
        </p>
        <p className="text-[10px] text-neutral-500 mt-0.5 tabular-nums">
          {formatMoney(p.margin, p.currency)} · {fmtPrice(p.entryPrice)} → {fmtPrice(p.currentPrice)}
          {p.takeProfit ? ` · TP ${fmtPrice(p.takeProfit)}` : ''}{p.stopLoss ? ` · SL ${fmtPrice(p.stopLoss)}` : ''}
        </p>
      </div>
      <div className={`text-right ${toneOf(p.unrealizedPnl)}`}>
        <AnimatedNumber value={p.unrealizedPnl} format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`} className="text-sm font-semibold" />
        <p className="text-[10px] tabular-nums">{signed(p.unrealizedPercent)}%</p>
      </div>
      <button type="button" disabled={busy} onClick={close} aria-label={`Close ${p.symbol}`}
        className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center active:scale-90 transition disabled:opacity-40">
        <X className="w-3.5 h-3.5" />
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

  const loadPositions = useCallback(async () => {
    try { setPositions(await marketApi.positions()); } catch { /* keep */ }
  }, []);
  const loadHistory = useCallback(async () => {
    try { setHistory(await marketApi.history({ limit: 30 })); } catch { /* keep */ }
  }, []);
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

  return (
    <Page title="Trade" subtitle="Live crypto and forex markets." icon={CandlestickChart}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start">
        <div className="space-y-4 order-2 lg:order-1">
          <Panel>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
              <input className={`${inputClass} pl-9`} placeholder="Search markets" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {!search && (
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {['Favourites', ...groups].map((g) => (
                  <button key={g} type="button" onClick={() => setGroup(g)}
                    className={`shrink-0 h-7 px-3 rounded-3xl text-[11px] font-medium transition ${group === g ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>{g}</button>
                ))}
              </div>
            )}
            {visible.length === 0 ? <Empty icon={Star} title={group === 'Favourites' ? 'No favourites yet' : 'No markets found'} text={group === 'Favourites' ? 'Tap the star on any market to pin it here.' : undefined} /> : (
              <ul key={`${group}-${search}`} className="space-y-0.5 max-h-[420px] lg:max-h-[560px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]">
                {visible.map((p, i) => (
                  <MarketRow key={p.symbol} i={i} pair={p} q={quotes[p.symbol]} selected={p.symbol === selected} favorite={favorites.includes(p.symbol)}
                    onFavorite={toggleFavorite} onSelect={(s) => { setSelected(s); if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <Tabs variant="underline" value={panel} onChange={setPanel} tabs={[
              { value: 'positions', label: summary?.count ? `Open positions (${summary.count})` : 'Open positions' },
              { value: 'history', label: 'History' }
            ]} />
            {panel === 'positions' && (positions === null ? <Loading /> : !positions.positions.length ? (
              <Empty icon={CandlestickChart} title="No open positions" text="Pick a market and place your first trade." />
            ) : (
              <>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Margin {formatMoney(summary.margin, meta.currency)}</span>
                  <span className={toneOf(summary.unrealizedPnl)}>Unrealised <AnimatedNumber value={summary.unrealizedPnl} format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`} /></span>
                </div>
                <ul className="divide-y divide-neutral-800">
                  {positions.positions.map((p, i) => <PositionRow key={p._id} i={i} p={p} onClose={afterTrade} />)}
                </ul>
              </>
            ))}
            {panel === 'history' && (history === null ? <Loading /> : !history.items.length ? <Empty title="No closed trades yet" /> : (
              <>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div><p className="text-neutral-500">Realised P/L</p><p className={`font-semibold ${toneOf(history.stats.realizedPnl)}`}>{signed(history.stats.realizedPnl)}</p></div>
                  <div><p className="text-neutral-500">Win rate</p><p className="font-semibold">{history.stats.winRate}%</p></div>
                  <div><p className="text-neutral-500">Trades</p><p className="font-semibold">{history.stats.trades}</p></div>
                </div>
                <ul className="divide-y divide-neutral-800 text-sm">
                  {history.items.map((h, i) => (
                    <li key={h._id} {...stagger(i)} className={`${stagger(i).className} py-2.5 flex justify-between gap-2`}>
                      <div className="min-w-0">
                        <p className="font-medium"><Badge tone={h.side === 'long' ? 'success' : 'danger'}>{h.side.toUpperCase()}</Badge> <span className="ml-1">{h.symbol}</span></p>
                        <p className="text-[10px] text-neutral-500 tabular-nums">{fmtPrice(h.entryPrice)} → {fmtPrice(h.exitPrice)} · {new Date(h.closedAt).toLocaleString()}{h.closeReason !== 'manual' ? ` · ${h.closeReason.replace('_', ' ')}` : ''}</p>
                      </div>
                      <p className={`tabular-nums font-medium ${toneOf(h.pnl)}`}>{signed(h.pnl)}</p>
                    </li>
                  ))}
                </ul>
              </>
            ))}
          </Panel>
        </div>

        <div className="order-1 lg:order-2">
          {pair && (
            <OrderTicket
              pair={pair}
              q={quotes[pair.symbol]}
              history={ticks[pair.symbol]}
              balance={user?.balance || 0}
              currency={meta.currency || user?.currency || 'USD'}
              usdRate={meta.usdRate || 1}
              onPlaced={afterTrade}
            />
          )}
        </div>
      </div>
    </Page>
  );
}
