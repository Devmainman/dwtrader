// Copy Trading: two tabs — Top Experts (browse, follow, copy) and Copying (your copies).
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Clock } from 'lucide-react';
import { copyTradingApi } from '../../api/products';
import {
  Page, Panel, Button, Badge, Tabs, inputClass, Loading, ErrorState, Empty,
  useLoader, formatMoney
} from '../products/ui';
import { Avatar, TraderName, RiskBadge, Sparkline, FollowButton, pct, toneOf, compact } from './shared';
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
    <Panel className="flex flex-col">
      <button type="button" onClick={() => onOpen(t.traderId)} className="text-left" title="View full stats and trades">
        <div className="flex items-center gap-3">
          <Avatar src={t.avatar} name={t.username} size={52} badge={t.badge} />
          <div className="min-w-0 flex-1">
            <TraderName trader={t} />
            <p className="text-xs text-neutral-400 truncate">{compact(t.followers)} followers · {t.copiers} copiers</p>
          </div>
          <RiskBadge level={t.riskLevel} />
        </div>
        <div className="flex items-end justify-between mt-4">
          <div>
            <p className="text-xs text-neutral-500">Total return</p>
            <p className={`text-xl font-semibold ${toneOf(t.performance.roi)}`}>{pct(t.performance.roi)}</p>
          </div>
          <div className="w-28"><Sparkline values={t.performance.sparkline} height={36} /></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
          <div><p className="text-neutral-500">Win rate</p><p className="font-medium">{t.performance.winRate}%</p></div>
          <div><p className="text-neutral-500">Drawdown</p><p className="font-medium">{t.performance.maxDrawdown}%</p></div>
          <div><p className="text-neutral-500">Trades</p><p className="font-medium">{t.performance.totalTrades}</p></div>
        </div>
      </button>
      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
        <FollowButton key={`${t.traderId}-${t.isFollowing}`} trader={t} onChange={onFollowChange} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 text-right leading-tight">Min to copy<br /><span className="font-semibold text-white">{formatMoney(t.minCopyAmount, currency)}</span></span>
          {t.myCopy
            ? <button type="button" onClick={onManage}><Badge tone="success">{t.myCopy.status === 'paused' ? 'Paused' : 'Copying'}</Badge></button>
            : <Button className="px-4" disabled={!t.acceptingCopiers} onClick={() => onCopy(t)}>Copy</Button>}
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
  const copies = useLoader(() => copyTradingApi.copies(), [tab]);
  const [copyTarget, setCopyTarget] = useState(null);

  const traders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.traders || []).filter((t) => !q || t.username.toLowerCase().includes(q) || (t.fullName || '').toLowerCase().includes(q));
  }, [data, search]);

  const currency = data?.currency || 'USD';
  const copyingCount = (copies.data?.copies || []).length;
  const manage = () => setTab('copying');
  const openTrader = (id) => navigate(`/copytrade/trader/${encodeURIComponent(id)}`);

  return (
    <Page title="Copy Trading" subtitle="Follow expert traders and automatically mirror their trades." icon={Users}>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[{ value: 'experts', label: 'Top Experts' }, { value: 'copying', label: copyingCount ? `Copying (${copyingCount})` : 'Copying' }]}
      />

      {tab === 'experts' && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
              <input className={`${inputClass} pl-9`} placeholder="Search experts" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className={`${inputClass} sm:w-48`} value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select className={`${inputClass} sm:w-44`} value={risk} onChange={(e) => setRisk(e.target.value)}>
              <option value="">Any risk level</option>
              <option value="low">Low risk</option>
              <option value="medium">Medium risk</option>
              <option value="high">High risk</option>
              <option value="very_high">Very high risk</option>
            </select>
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

      <p className="text-xs text-neutral-500 mt-6 flex items-center gap-1"><Clock className="w-3 h-3" />Copy trading carries risk. Past performance does not guarantee future results.</p>

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
