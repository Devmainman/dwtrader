// Shared pieces for the wallet: coin icons, money and quantity formatting, the wallets
// hook (fiat + every coin at live prices), and the display-currency sheet.
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Check, X } from 'lucide-react';
import { cryptoApi } from '../../api/products';
import { API_BASE_URL } from '../../api/config';
import { toast } from '../../lib/toast';

/* ------------------------------ formatting ------------------------------ */

export const money = (v, currency = 'USD', opts = {}) => {
  const n = Number(v) || 0;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: n !== 0 && Math.abs(n) < 1 && opts.precise ? 6 : 2 }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
};
export const currencySymbol = (code) => {
  try { return new Intl.NumberFormat('en', { style: 'currency', currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(1).replace(/1/g, '').trim(); } catch { return code; }
};
/** Coin quantity: up to 8 decimals, trailing zeros trimmed. */
export const qty = (v) => {
  const n = Number(v) || 0;
  if (n === 0) return '0';
  const d = n >= 1000 ? 2 : n >= 1 ? 4 : 8;
  return n.toLocaleString(undefined, { maximumFractionDigits: d });
};
/** Price of a coin: more decimals for small prices. */
export const price = (v, currency = 'USD') => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: n >= 1 ? 2 : n >= 0.01 ? 4 : 8, minimumFractionDigits: n >= 1 ? 2 : 2 }).format(n);
  } catch { return `${n} ${currency}`; }
};
export const pct = (v) => (v == null ? '' : `${v >= 0 ? '+' : ''}${Number(v).toFixed(2)}%`);

/* ------------------------------ icons ------------------------------ */

const HUES = [24, 200, 280, 140, 340, 45, 170, 220];
export function CoinIcon({ symbol, icon, size = 40, fiat = false }) {
  const [broken, setBroken] = useState(!icon);
  useEffect(() => setBroken(!icon), [icon]);
  if (fiat) {
    return (
      <span className="rounded-full flex items-center justify-center shrink-0 font-semibold text-white bg-[linear-gradient(140deg,var(--color-blue-400),var(--color-blue-700))] shadow-[0_6px_16px_-6px_var(--color-blue-600)]"
        style={{ width: size, height: size, fontSize: size * 0.38 }}>{currencySymbol(symbol).slice(0, 2)}</span>
    );
  }
  if (broken) {
    const hue = HUES[(symbol.charCodeAt(0) + symbol.length) % HUES.length];
    return <span className="rounded-full flex items-center justify-center shrink-0 font-semibold text-white" style={{ width: size, height: size, fontSize: size * 0.32, background: `linear-gradient(140deg, hsl(${hue} 70% 55%), hsl(${hue} 70% 35%))` }}>{symbol.slice(0, 3)}</span>;
  }
  return <img src={icon} alt="" width={size} height={size} loading="lazy" draggable="false" className="rounded-full shrink-0 object-contain bg-white/[.06]" style={{ width: size, height: size }} onError={() => setBroken(true)} />;
}

/* ------------------------------ data ------------------------------ */

let cached = null; // last wallets payload, so pages paint instantly when revisited

/** Fiat + coin wallets at live prices. Refreshes every 20 s while visible. */
export function useWallets({ refreshMs = 20000 } = {}) {
  const [data, setData] = useState(cached);
  const [error, setError] = useState('');
  const alive = useRef(true);
  const load = useCallback(async () => {
    try {
      const d = await cryptoApi.wallets();
      cached = d;
      if (alive.current) { setData(d); setError(''); }
    } catch (err) {
      if (alive.current) setError(err?.response?.data?.message || err.message || 'Could not load your wallets');
    }
  }, []);
  useEffect(() => {
    alive.current = true;
    load();
    const t = setInterval(() => document.visibilityState === 'visible' && load(), refreshMs);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => { alive.current = false; clearInterval(t); window.removeEventListener('focus', onFocus); };
  }, [load, refreshMs]);
  return { data, error, reload: load, loading: !data && !error };
}

/** Hide / show balances, remembered on this device. */
export function useHidden() {
  const [hidden, set] = useState(() => { try { return localStorage.getItem('app:hideBalance') === '1'; } catch { return false; } });
  const toggle = () => set((h) => { const n = !h; try { localStorage.setItem('app:hideBalance', n ? '1' : '0'); } catch { /* */ } return n; });
  return [hidden, toggle];
}
export const mask = (s, hidden) => (hidden ? '••••••' : s);

/* ------------------------------ sheet ------------------------------ */

export function Sheet({ title, note, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return createPortal(
    <div className="fixed inset-0 z-[9000] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fade-in_200ms_ease_both]" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'md:max-w-lg' : 'md:max-w-sm'} max-h-[88dvh] flex flex-col bg-[var(--card)] border border-white/10 rounded-t-[28px] md:rounded-[28px] shadow-2xl animate-[sheet-in_420ms_cubic-bezier(0.22,1,0.36,1)_both]`}>
        <div className="mx-auto mt-2 w-9 h-1 rounded-full bg-white/20 md:hidden" />
        <div className="flex items-start justify-between gap-3 px-5 pt-3 pb-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100">{title}</p>
            {note && <p className="text-[11px] text-neutral-500">{note}</p>}
          </div>
          <button type="button" onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 shrink-0" aria-label="Close"><X className="w-3.5 h-3.5" /></button>
        </div>
        <div className="overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+18px)]">{children}</div>
      </div>
    </div>,
    document.body
  );
}

/** Pick the account currency (the fiat wallet converts at today's rate). */
export function CurrencySheet({ current, onClose, onChanged }) {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/users/currencies`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((j) => setList(Array.isArray(j?.data) ? j.data : [])).catch(() => setList([]));
  }, []);
  const pick = async (code) => {
    if (code === current) return onClose();
    setBusy(code);
    try {
      const res = await fetch(`${API_BASE_URL}/users/preferences`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: code })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Could not change currency');
      toast.success(`Balance now in ${code}`, { description: json.rate ? `Converted at 1 ${current} = ${Number(json.rate).toLocaleString('en-US', { maximumSignificantDigits: 6 })} ${code}` : undefined });
      onChanged?.(code);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy('');
    }
  };
  return (
    <Sheet title="Account currency" note="Your fiat balance converts at today's market rate." onClose={onClose}>
      <div className="relative mb-2">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search currency" className="w-full h-9 pl-8 pr-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
      </div>
      <ul className="-mx-2">
        {list.filter((c) => !q || `${c.code} ${c.title}`.toLowerCase().includes(q.toLowerCase())).map((c) => (
          <li key={c.code}>
            <button type="button" disabled={!!busy} onClick={() => pick(c.code)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition active:scale-[0.98] ${c.code === current ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}>
              <CoinIcon symbol={c.code} fiat size={36} />
              <span className="flex-1 min-w-0"><span className="block text-sm text-zinc-100">{c.code}</span><span className="block text-[11px] text-neutral-500 truncate">{c.title}</span></span>
              {busy === c.code ? <span className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" /> : c.code === current && <Check className="w-4 h-4 text-blue-400" />}
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
