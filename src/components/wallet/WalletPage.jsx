// /wallet — every asset: the fiat wallet and each enabled coin wallet, at live prices.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowDownToLine, ArrowLeftRight, Eye, EyeOff, ArrowLeft, History } from 'lucide-react';
import { useWallets, useHidden, money, mask } from './shared';
import { AssetRow, AssetSheet } from './AssetList';
import { formatDate } from '../products/ui';
import { cryptoApi } from '../../api/products';

function RecentDeposits() {
  const [items, setItems] = useState(null);
  useEffect(() => { cryptoApi.deposits().then(setItems).catch(() => setItems([])); }, []);
  if (!items?.length) return null;
  const tone = { pending: 'text-amber-400', approved: 'text-emerald-400', rejected: 'text-red-400' };
  return (
    <section className="ui-card p-4 mt-4">
      <p className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-2"><History className="w-4 h-4" />Crypto deposits</p>
      <ul className="divide-y divide-white/[.06]">
        {items.slice(0, 8).map((d) => (
          <li key={d._id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0"><p className="text-zinc-100">{d.amount} {d.symbol}</p><p className="text-[11px] text-neutral-500 truncate">{formatDate(d.createdAt)}{d.note ? ` · ${d.note}` : ''}</p></div>
            <span className={`text-[11px] capitalize ${tone[d.status]}`}>{d.status === 'pending' ? 'Verifying' : d.status === 'approved' ? `Credited ${d.creditedAmount} ${d.symbol}` : 'Rejected'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function WalletPage() {
  const navigate = useNavigate();
  const { data, error, reload } = useWallets();
  const [hidden, toggleHidden] = useHidden();
  const [q, setQ] = useState('');
  const [hideZero, setHideZero] = useState(false);
  const [open, setOpen] = useState(null);
  const cur = data?.currency || 'USD';
  const coins = useMemo(() => (data?.assets || []).filter((a) =>
    (!hideZero || a.balance > 0) && (!q || `${a.name} ${a.symbol}`.toLowerCase().includes(q.toLowerCase()))), [data, q, hideZero]);
  const t = data?.totals;

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 sm:px-5 py-4 pb-35 lg:pb-10 text-zinc-100">
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:text-zinc-100" aria-label="Back"><ArrowLeft className="w-4 h-4" /></button>
        <div className="flex-1"><p className="text-base font-semibold">Assets</p><p className="text-[11px] text-neutral-500">Fiat and crypto wallets at live prices</p></div>
        <button type="button" onClick={toggleHidden} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300" aria-label={hidden ? 'Show balances' : 'Hide balances'}>{hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
      </div>

      <section className="ui-hero p-5">
        <div className="relative z-[1]">
          <p className="text-[clamp(0.625rem,1vw,0.75rem)] text-neutral-300">Total balance</p>
          <p className="mt-1 text-[clamp(1.75rem,4vw,2rem)] font-medium tracking-wide leading-tight tabular-nums">{t ? mask(money(t.total, cur), hidden) : <span className="inline-block h-9 w-44 rounded-lg skeleton" />}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-2xl bg-white/[.05] border border-white/[.06] px-3 py-2"><p className="text-[11px] text-neutral-400">Fiat balance</p><p className="font-semibold tabular-nums">{t ? mask(money(t.fiat, cur), hidden) : '—'}</p></div>
            <div className="rounded-2xl bg-white/[.05] border border-white/[.06] px-3 py-2"><p className="text-[11px] text-neutral-400">Crypto balance</p><p className="font-semibold tabular-nums">{t ? mask(money(t.crypto, cur), hidden) : '—'}</p></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => navigate('/deposite')} className="flex-1 h-10 rounded-2xl bg-blue-600 text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-blue-500 transition"><ArrowDownToLine className="w-4 h-4" />Deposit</button>
            {data?.convertEnabled !== false && <button type="button" onClick={() => navigate('/convert')} className="flex-1 h-10 rounded-2xl bg-white/[.07] border border-white/10 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/10 transition"><ArrowLeftRight className="w-4 h-4" />Convert</button>}
          </div>
        </div>
      </section>

      <section className="ui-card p-3 mt-4">
        <div className="flex items-center gap-2 px-1 pb-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search assets" className="w-full h-9 pl-8 pr-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <label className="flex items-center gap-1.5 text-[11px] text-neutral-400 shrink-0 cursor-pointer select-none">
            <input type="checkbox" checked={hideZero} onChange={(e) => setHideZero(e.target.checked)} className="accent-blue-500" />Hide 0
          </label>
        </div>
        {error && !data && <p className="text-xs text-red-400 px-2 py-4">{error} <button type="button" className="underline" onClick={reload}>Retry</button></p>}
        {!data ? <div className="space-y-2 p-1">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-14 rounded-2xl skeleton" />)}</div> : (
          <ul className="ui-stagger">
            {!q && <AssetRow a={data.fiat} currency={cur} hidden={hidden} fiat onOpen={() => setOpen({ fiat: true, a: data.fiat })} />}
            {coins.map((a) => <AssetRow key={a.symbol} a={a} currency={cur} hidden={hidden} onOpen={() => setOpen({ fiat: false, a })} />)}
            {!coins.length && q && <li className="text-xs text-neutral-500 text-center py-6">No assets match “{q}”.</li>}
          </ul>
        )}
      </section>

      <RecentDeposits />
      {open && <AssetSheet a={open.a} fiat={open.fiat} currency={cur} convertEnabled={data?.convertEnabled !== false} onClose={() => setOpen(null)} />}
    </div>
  );
}
