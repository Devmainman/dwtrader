// /transactionhistory — every ledger entry, in the dashboard's style: search, filter chips,
// grouped by day, tap a row for its full details. Pages in 20 at a time.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, History, Copy, Check, X } from 'lucide-react';
import { Page } from '../products/ui';
import { cryptoApi } from '../../api/products';
import { money, Sheet } from '../wallet/shared';
import { toast } from '../../lib/toast';

const FILTERS = [
  ['', 'All'],
  ['deposit,crypto_deposit,admin_credit', 'Deposits'],
  ['withdrawal,admin_debit', 'Withdrawals'],
  ['crypto_convert,crypto_deposit,currency_conversion', 'Crypto'],
  ['trade,copy_trade,stock', 'Trading'],
  ['staking,mining,real_estate,cold_storage', 'Earn'],
  ['referral_bonus,reward', 'Rewards'],
  ['card,upgrade,signal', 'Other']
];
const STATUS = { completed: 'text-emerald-400', pending: 'text-amber-400', failed: 'text-red-400', cancelled: 'text-neutral-500' };

const dayLabel = (d) => {
  const day = new Date(d); const now = new Date();
  const diff = Math.round((new Date(now.toDateString()) - new Date(day.toDateString())) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: day.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
};
const typeName = (t) => String(t || '').replace(/_/g, ' ');

function Detail({ t, onClose }) {
  const [copied, setCopied] = useState(false);
  const inflow = t.direction === 'in';
  const m = t.metadata || {};
  const rows = [
    ['Status', <span className={`capitalize ${STATUS[t.status] || ''}`}>{t.status}</span>],
    ['Type', <span className="capitalize">{typeName(t.type)}</span>],
    ['Date', new Date(t.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })],
    m.coin && ['Coin', `${m.quantity ?? ''} ${m.coin}`],
    m.price && ['Price', money(m.price, t.currency)],
    m.fee ? ['Fee', money(m.fee, t.currency)] : null,
    t.bankName && ['Method', t.bankName],
    t.accountName && ['Account name', t.accountName],
    t.accountNumber && ['Account number', t.accountNumber],
    m.txHash && ['Transaction hash', <span className="font-mono text-[11px] break-all">{m.txHash}</span>]
  ].filter(Boolean);
  const copy = () => navigator.clipboard?.writeText(t.reference).then(() => { setCopied(true); toast.success('Reference copied'); setTimeout(() => setCopied(false), 1400); });
  return (
    <Sheet title="Transaction" onClose={onClose}>
      <div className="flex flex-col items-center text-center pt-1 pb-5">
        <span className={`w-12 h-12 rounded-full flex items-center justify-center border ${inflow ? 'border-emerald-500/30 text-emerald-400' : 'border-white/10 text-neutral-300'}`}>
          {inflow ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </span>
        <p className={`mt-3 text-[28px] font-light tracking-[-0.03em] tabular-nums ${inflow ? 'text-emerald-400' : 'text-zinc-100'}`}>{inflow ? '+' : '−'}{money(t.amount, t.currency)}</p>
        <p className="text-[12px] text-neutral-400 first-letter:uppercase mt-0.5">{t.label}</p>
      </div>
      <dl className="divide-y divide-white/[.06] border-y border-white/[.06]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-4 py-2.5 text-[12px]">
            <dt className="text-neutral-500 shrink-0">{k}</dt><dd className="text-zinc-100 text-right min-w-0">{v}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-2.5 text-[12px]">
          <dt className="text-neutral-500">Reference</dt>
          <dd><button type="button" data-no-busy onClick={copy} className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-100 hover:text-blue-400">{t.reference}{copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}</button></dd>
        </div>
      </dl>
    </Sheet>
  );
}

export default function TransactionHistoryScreen() {
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(null);
  const seq = useRef(0);

  const load = async (p, append) => {
    const id = ++seq.current;
    try {
      const d = await cryptoApi.activityPage({ page: p, limit: 20, ...(filter && { type: filter }), ...(q.trim() && { search: q.trim() }) });
      if (id !== seq.current) return;
      setItems((prev) => (append && prev ? [...prev, ...d.transactions] : d.transactions));
      setPage(d.pagination.currentPage);
      setPages(d.pagination.pages || 1);
      setTotal(d.pagination.total);
      setError('');
    } catch (e) {
      if (id === seq.current) setError(e?.response?.data?.message || 'Could not load your history');
    }
  };

  useEffect(() => {
    setItems(null);
    const t = setTimeout(() => load(1, false), q ? 300 : 0);
    return () => clearTimeout(t);
  }, [filter, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const more = async () => { setLoadingMore(true); await load(page + 1, true); setLoadingMore(false); };

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
    <Page title="History" subtitle="Every deposit, withdrawal, trade and conversion" icon={History}>
      <div className="max-w-[760px]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by reference, coin or type"
            className="w-full h-11 rounded-full bg-white/[.04] border border-white/10 pl-10 pr-10 text-[13px] text-zinc-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition" />
          {q && <button type="button" data-no-busy onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-neutral-500 hover:text-zinc-100" aria-label="Clear search"><X className="w-3.5 h-3.5" /></button>}
        </div>

        <div className="mt-3 -mx-4 px-4 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-no-busy>
          {FILTERS.map(([k, l]) => (
            <button key={l} type="button" onClick={() => setFilter(k)}
              className={`shrink-0 h-8 px-3.5 rounded-full text-[12px] font-semibold transition ${filter === k ? 'bg-zinc-100 text-neutral-900' : 'bg-white/[.04] border border-white/[.08] text-neutral-400 hover:text-zinc-100'}`}>{l}</button>
          ))}
        </div>

        <section className="dash-panel mt-4 px-4 pt-2 pb-2">
          {error ? <p className="py-8 text-center text-[12px] text-red-400">{error} <button type="button" className="underline" onClick={() => load(1, false)}>Retry</button></p>
            : !items ? <div className="space-y-2 py-3">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-12 rounded-xl skeleton" />)}</div>
              : !items.length ? (
                <div className="py-12 text-center">
                  <span className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-500"><History className="w-5 h-5" /></span>
                  <p className="text-[13px] font-semibold mt-3">{q || filter ? 'Nothing matches' : 'No transactions yet'}</p>
                  <p className="text-[12px] text-neutral-500 mt-1">{q || filter ? 'Try another search or filter.' : 'Your deposits, trades and conversions will show up here.'}</p>
                </div>
              ) : (
                <>
                  <p className="pt-2 text-[11px] text-neutral-500">{total} transaction{total === 1 ? '' : 's'}</p>
                  {groups.map((g) => (
                    <div key={g.k}>
                      <p className="pt-3 pb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">{g.k}</p>
                      <ul className="divide-y divide-white/[.06]">
                        {g.rows.map((t) => {
                          const inflow = t.direction === 'in';
                          return (
                            <li key={t.id}>
                              <button type="button" data-no-busy onClick={() => setOpen(t)} className="dash-row w-full flex items-center gap-3 py-3 text-left">
                                <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${inflow ? 'border-emerald-500/25 text-emerald-400' : 'border-white/10 text-neutral-400'}`}>
                                  {inflow ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="block text-[13px] text-zinc-100 truncate first-letter:uppercase">{t.label}</span>
                                  <span className="block text-[11px] text-neutral-500 truncate">
                                    {new Date(t.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · <span className="capitalize">{typeName(t.type)}</span>
                                  </span>
                                </span>
                                <span className="text-right shrink-0">
                                  <span className={`block text-[13px] font-medium tabular-nums ${inflow ? 'text-emerald-400' : 'text-zinc-100'}`}>{inflow ? '+' : '−'}{money(t.amount, t.currency)}</span>
                                  <span className={`block text-[10px] capitalize ${STATUS[t.status] || 'text-neutral-500'}`}>{t.status}</span>
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  {page < pages && (
                    <button type="button" onClick={more} disabled={loadingMore} className="w-full h-10 my-2 rounded-full text-[12px] font-semibold text-neutral-400 hover:text-zinc-100 hover:bg-white/5 transition disabled:opacity-50">
                      {loadingMore ? 'Loading…' : 'Show more'}
                    </button>
                  )}
                </>
              )}
        </section>
      </div>
      {open && <Detail t={open} onClose={() => setOpen(null)} />}
    </Page>
  );
}
