// Copy Trading: two tabs — Top Experts (browse, follow, copy) and Copying (your copies).
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Clock, TrendingUp, Wallet, Sparkles, ChevronRight } from 'lucide-react';
import { copyTradingApi } from '../../api/products';
import {
  Page, Panel, Button, Badge, Tabs, inputClass, Loading, ErrorState, Empty,
  useLoader, formatMoney
} from '../products/ui';
import { Avatar, TraderName, RiskBadge, Sparkline, FollowButton, StatusDot, pct, toneOf, compact } from './shared';
import CopyingPanel from './CopyingPanel';
import CopyModal from './CopyModal';

const SORTS = [
  { value: 'roi', label: 'Highest return' },
  { value: 'monthly', label: 'Best last 30 days' },
  { value: 'winRate', label: 'Win rate' },
  { value: 'drawdown', label: 'Lowest drawdown' },
  { value: 'followers', label: 'Most followed' },
  { value: 'copiers', label: 'Most copied' },
  { value: 'newest', label: 'Newest' }
];

function TraderCard({ t, currency, onOpen, onCopy, onManage, onFollowChange }) {
  return (
    <Panel className={`flex flex-col transition hover:-translate-y-0.5 ${t.myCopy ? '!border-emerald-500/30' : ''}`}>
      <button type="button" data-no-busy onClick={() => onOpen(t.traderId)} className="text-left" title="View full stats and trades">
        <div className="flex items-center gap-3">
          <Avatar src={t.avatar} name={t.username} size={52} badge={t.badge} />
          <div className="min-w-0 flex-1">
            <TraderName trader={t} />
            <p className="text-[11px] text-neutral-500 truncate flex items-center gap-2 mt-0.5"><StatusDot trader={t} withLabel={false} />{compact(t.followers)} followers · {t.copiers} copiers</p>
          </div>
          <RiskBadge level={t.riskLevel} />
        </div>
        <div className="flex items-end justify-between mt-4 gap-3">
          <div>
            <p className="text-[11px] text-neutral-500">Total return</p>
            <p className={`text-[28px] font-light tracking-[-0.03em] tabular-nums leading-tight ${toneOf(t.performance.roi)}`}>{pct(t.performance.roi)}</p>
          </div>
          <div className="w-32"><Sparkline values={t.performance.sparkline} height={44} /></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[['Win rate', `${t.performance.winRate}%`], ['Drawdown', `${t.performance.maxDrawdown}%`], ['Trades', t.performance.totalTrades]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white/[.03] border border-white/[.06] px-2.5 py-2"><p className="text-[10px] text-neutral-500">{k}</p><p className="text-[13px] font-semibold tabular-nums">{v}</p></div>
          ))}
        </div>
      </button>
      <div className="mt-4 pt-3 border-t border-white/[.06] flex items-center justify-between gap-2">
        <FollowButton key={`${t.traderId}-${t.isFollowing}`} trader={t} onChange={onFollowChange} />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500 text-right leading-tight">Min to copy<br /><span className="text-[12px] font-semibold text-zinc-100">{formatMoney(t.minCopyAmount, currency)}</span></span>
          {t.myCopy
            ? <button type="button" onClick={onManage}><Badge tone="success">{t.myCopy.status === 'paused' ? 'Paused' : 'Copying'}</Badge></button>
            : <Button className="px-5" disabled={!t.acceptingCopiers} onClick={() => onCopy(t)}>Copy</Button>}
        </div>
      </div>
    </Panel>
  );
}

export default function CopyTrading({ initialTab = 'experts' }) {
  const navigate = useNavigate();
  const [tab, setTabState] = useState(initialTab);
  useEffect(() => { setTabState(initialTab); }, [initialTab]);
  const setTab = (t) => {
    setTabState(t);
    navigate(t === 'copying' ? '/copy-positions' : '/copytrade', { replace: true });
  };

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('roi');
  const [risk, setRisk] = useState('');
  const { data, loading, error, reload } = useLoader(() => copyTradingApi.traders({ sort, risk: risk || undefined }), [sort, risk]);
  // Traders on autopilot trade on their own: keep figures current.
  useEffect(() => { const t = setInterval(() => document.visibilityState === 'visible' && reload(), 30000); return () => clearInterval(t); }, [reload]);
  const copies = useLoader(() => copyTradingApi.copies(), [tab]);
  const [copyTarget, setCopyTarget] = useState(null);

  const traders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.traders || []).filter((t) => !q || t.username.toLowerCase().includes(q) || (t.fullName || '').toLowerCase().includes(q));
  }, [data, search]);

  const currency = data?.currency || 'USD';
  const copyingCount = (copies.data?.copies || []).length;
  const manage = () => setTab('copying');
  const mine = useMemo(() => {
    const open = (copies.data?.copies || []).filter((c) => c.status !== 'stopped');
    return { count: open.length, value: open.reduce((a, c) => a + (c.equity || 0), 0), pnl: open.reduce((a, c) => a + (c.totalPnl || 0), 0) };
  }, [copies.data]);
  const openTrader = (id) => navigate(`/copytrade/trader/${encodeURIComponent(id)}`);

  return (
    <Page title="Copy Trading" subtitle="Follow expert traders and automatically mirror their trades." icon={Users}>
      <Tabs
        value={tab}
        onChange={setTab}
        how={[['Pick a trader', 'Compare return, risk and history in Top Experts.'], ['Set an amount', 'Choose how much of your balance follows them.'], ['Trades are mirrored', 'Each position they open is copied into your account.'], ['Stop any time', 'End copying from the Copying tab whenever you like.']]}
        tabs={[{ value: 'experts', label: 'Top Experts' }, { value: 'copying', label: copyingCount ? `Copying (${copyingCount})` : 'Copying' }]}
      />

      {tab === 'experts' && (
        <>
          {mine.count > 0 && (
            <button type="button" data-no-busy onClick={manage} className="dash-panel w-full p-4 mb-4 flex items-center gap-4 text-left hover:-translate-y-0.5 transition">
              <span className="w-11 h-11 rounded-2xl bg-emerald-500/12 text-emerald-400 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-neutral-500">You’re copying {mine.count} trader{mine.count === 1 ? '' : 's'}</p>
                <p className="text-[18px] font-light tracking-[-0.02em] tabular-nums">{formatMoney(mine.value, currency)} <span className={`text-[12px] font-semibold ${toneOf(mine.pnl)}`}>{mine.pnl >= 0 ? '+' : ''}{formatMoney(mine.pnl, currency)}</span></p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
          )}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input className="w-full h-11 rounded-full bg-white/[.04] border border-white/10 pl-10 pr-4 text-[13px] text-zinc-100 placeholder:text-neutral-500 outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition" placeholder="Search experts" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="-mx-4 px-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-no-busy>
            {SORTS.map((o) => (
              <button key={o.value} type="button" onClick={() => setSort(o.value)} className={`shrink-0 h-8 px-3.5 rounded-full text-[12px] font-semibold transition ${sort === o.value ? 'bg-zinc-100 text-neutral-900' : 'bg-white/[.04] border border-white/[.08] text-neutral-400 hover:text-zinc-100'}`}>{o.label}</button>
            ))}
          </div>
          <div className="flex gap-1.5 mt-2 mb-5 flex-wrap" data-no-busy>
            {[['', 'Any risk'], ['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['very_high', 'Very high']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setRisk(v)} className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition ${risk === v ? 'border-blue-500/60 bg-blue-600/10 text-blue-400' : 'border-white/[.08] text-neutral-500 hover:text-zinc-100'}`}>{l}</button>
            ))}
          </div>

          {loading && !data ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : traders.length === 0 ? (
            <Panel><Empty icon={Users} title="No experts found" text="Try another search or check back soon." /></Panel>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {traders.map((t) => (
                <TraderCard key={t.traderId} t={t} currency={currency} onOpen={openTrader} onCopy={setCopyTarget} onManage={manage} onFollowChange={reload} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'copying' && <CopyingPanel onBrowse={() => setTab('experts')} />}

      <p className="text-[11px] text-neutral-500 mt-6 flex items-center gap-1"><Clock className="w-3 h-3" />Copy trading carries risk. Past performance does not guarantee future results.</p>

      {copyTarget && (
        <CopyModal
          trader={copyTarget}
          currency={currency}
          balance={copies.data?.availableBalance || 0}
          onClose={() => setCopyTarget(null)}
          onCopied={() => { reload(); copies.reload(); setTab('copying'); }}
        />
      )}
    </Page>
  );
}
