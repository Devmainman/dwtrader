// Expanded trader view: full stats and complete trade history.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { copyTradingApi } from '../../api/products';
import {
  Page, Panel, Button, Badge, Tabs, inputClass, Loading, ErrorState, Empty, useLoader, formatMoney, formatDate, formatNumber
} from '../products/ui';
import { Avatar, TraderName, RiskBadge, Sparkline, FollowButton, pct, toneOf, compact } from './shared';
import CopyModal from './CopyModal';

const fmtHours = (h) => {
  if (!h) return '—';
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48) return `${formatNumber(h, 1)}h`;
  return `${formatNumber(h / 24, 1)}d`;
};

function StatTile({ label, value, tone, hint }) {
  return (
    <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-3">
      <p className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</p>
      <p className={`text-base font-semibold mt-0.5 ${tone || ''}`}>{value}</p>
      {hint && <p className="text-[11px] text-neutral-500 mt-0.5">{hint}</p>}
    </div>
  );
}

function TradeRow({ t }) {
  return (
    <li className="py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="truncate">
          <Badge tone={t.side === 'buy' ? 'success' : 'danger'}>{t.side === 'buy' ? 'BUY' : 'SELL'}</Badge>
          <span className="ml-1.5 font-medium">{t.symbol}</span>
          {t.leverage > 1 && <span className="text-xs text-neutral-500"> · {t.leverage}x</span>}
          {t.status === 'open' && <span className="ml-1.5"><Badge tone="info">Open</Badge></span>}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {formatNumber(t.entryPrice, 6)} → {formatNumber(t.status === 'open' ? t.markPrice : t.exitPrice, 6)}
          {' · '}{formatDate(t.openedAt)}{t.closedAt ? ` – ${formatDate(t.closedAt)}` : ''}
          {t.durationHours ? ` · ${fmtHours(t.durationHours)}` : ''}
        </p>
      </div>
      <div className={`text-right shrink-0 font-medium ${toneOf(t.pnlPercent)}`}>{pct(t.pnlPercent)}</div>
    </li>
  );
}

function StatsTab({ data }) {
  const s = data.stats;
  const t = data.trader;
  const maxMonth = Math.max(1, ...s.monthlyReturns.map((m) => Math.abs(m.returnPercent)));
  return (
    <div className="space-y-4">
      <Panel title="Growth" action={<span className={`text-sm font-semibold ${toneOf(s.roi)}`}>{pct(s.roi)} all time</span>}>
        <Sparkline values={(t.equityCurve || []).map((p) => p.value)} height={140} />
        <p className="text-xs text-neutral-500 mt-2">Value of the strategy if it started at 100, after every closed trade.</p>
      </Panel>

      <Panel title="Performance">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatTile label="Total return" value={pct(s.roi)} tone={toneOf(s.roi)} />
          <StatTile label="Last 30 days" value={pct(s.monthlyReturn)} tone={toneOf(s.monthlyReturn)} />
          <StatTile label="Last 7 days" value={pct(s.weeklyReturn)} tone={toneOf(s.weeklyReturn)} />
          <StatTile label="Last 24 hours" value={pct(s.dailyReturn)} tone={toneOf(s.dailyReturn)} />
          <StatTile label="Win rate" value={`${s.winRate}%`} hint={`${s.wins} won · ${s.losses} lost`} />
          <StatTile label="Max drawdown" value={`${s.maxDrawdown}%`} tone="text-red-300" hint="Biggest drop from a peak" />
          <StatTile label="Profit factor" value={s.profitFactor === null ? 'No losses' : formatNumber(s.profitFactor)} hint="Gains ÷ losses" />
          <StatTile label="Total trades" value={s.totalTrades} hint={`${s.openTrades} open now`} />
        </div>
      </Panel>

      <Panel title="Trading behaviour">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatTile label="Average win" value={pct(s.averageWinPercent)} tone={toneOf(s.averageWinPercent)} />
          <StatTile label="Average loss" value={pct(s.averageLossPercent)} tone={toneOf(s.averageLossPercent)} />
          <StatTile label="Best trade" value={s.bestTrade ? pct(s.bestTrade.pnlPercent) : '—'} tone={toneOf(s.bestTrade?.pnlPercent)} hint={s.bestTrade?.symbol} />
          <StatTile label="Worst trade" value={s.worstTrade ? pct(s.worstTrade.pnlPercent) : '—'} tone={toneOf(s.worstTrade?.pnlPercent)} hint={s.worstTrade?.symbol} />
          <StatTile label="Avg hold time" value={fmtHours(s.averageHoldHours)} />
          <StatTile label="Avg leverage" value={s.averageLeverage ? `${s.averageLeverage}x` : '—'} />
          <StatTile label="Long / short" value={s.totalTrades ? `${s.longPercent}% / ${formatNumber(100 - s.longPercent, 2)}%` : '—'} />
          <StatTile label="Streaks" value={`${s.longestWinStreak}W / ${s.longestLossStreak}L`} hint="Longest win / loss run" />
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel title="Monthly returns">
          {s.monthlyReturns.length === 0 ? <p className="text-sm text-neutral-500">No closed trades yet.</p> : (
            <ul className="space-y-2 text-sm">
              {s.monthlyReturns.slice().reverse().map((m) => (
                <li key={m.month} className="flex items-center gap-3">
                  <span className="w-16 text-neutral-400 shrink-0">{m.month}</span>
                  <div className="flex-1 h-2 rounded-full bg-neutral-800/60 overflow-hidden">
                    <div className={`h-full ${m.returnPercent >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{ width: `${(Math.abs(m.returnPercent) / maxMonth) * 100}%` }} />
                  </div>
                  <span className={`w-16 text-right shrink-0 ${toneOf(m.returnPercent)}`}>{pct(m.returnPercent)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Most traded">
          {s.topSymbols.length === 0 ? <p className="text-sm text-neutral-500">No closed trades yet.</p> : (
            <ul className="space-y-2 text-sm">
              {s.topSymbols.map((x) => (
                <li key={x.symbol} className="flex items-center gap-3">
                  <span className="w-24 font-medium shrink-0 truncate">{x.symbol}</span>
                  <div className="flex-1 h-2 rounded-full bg-neutral-800/60 overflow-hidden">
                    <div className="h-full bg-[linear-gradient(80deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" style={{ width: `${x.sharePercent}%` }} />
                  </div>
                  <span className="w-20 text-right text-neutral-400 shrink-0">{x.count} trades</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="About">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatTile label="Followers" value={compact(s.followers)} />
          <StatTile label="Copiers" value={s.copiers} />
          <StatTile label="Minimum to copy" value={formatMoney(t.minCopyAmount, data.currency)} />
          <StatTile label="Fee on profit" value={`${s.commissionRate}%`} />
          <StatTile label="Trading since" value={formatDate(s.firstTradeAt || t.joinedDate)} />
          <StatTile label="Last trade" value={formatDate(s.lastTradeAt)} />
          <StatTile label="Style" value={(t.tradingStyle || []).join(', ') || '—'} />
          <StatTile label="Markets" value={(t.markets || []).join(', ') || '—'} />
        </div>
      </Panel>
    </div>
  );
}

function TradesTab({ traderId }) {
  const [status, setStatus] = useState('all');
  const [symbol, setSymbol] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useLoader(
    () => copyTradingApi.traderTrades(traderId, { status: status === 'all' ? undefined : status, symbol: symbol || undefined, page, limit: 25 }),
    [traderId, status, symbol, page]
  );
  const change = (fn) => (v) => { fn(v); setPage(1); };

  return (
    <Panel>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <Tabs variant="underline" value={status} onChange={change(setStatus)} tabs={[{ value: 'all', label: 'All' }, { value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }]} />
        <select className={`${inputClass} sm:w-44 sm:ml-auto`} value={symbol} onChange={(e) => change(setSymbol)(e.target.value)}>
          <option value="">All symbols</option>
          {(data?.symbols || []).map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>
      {loading && !data ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : !data.items.length ? (
        <Empty title="No trades yet" text="Trades appear here as soon as this trader opens them." />
      ) : (
        <>
          <p className="text-xs text-neutral-500">{data.total} trade{data.total === 1 ? '' : 's'}</p>
          <ul className="divide-y divide-neutral-800 text-sm">{data.items.map((t) => <TradeRow key={t.id} t={t} />)}</ul>
          {data.pages > 1 && (
            <div className="flex items-center justify-between mt-3 text-sm">
              <Button variant="secondary" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-neutral-400">Page {page} of {data.pages}</span>
              <Button variant="secondary" disabled={page >= data.pages || loading} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

export default function TraderProfile() {
  const { traderId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('stats');
  const [copyOpen, setCopyOpen] = useState(false);
  const { data, loading, error, reload } = useLoader(() => copyTradingApi.trader(traderId), [traderId]);
  const t = data?.trader;

  const back = (
    <button type="button" onClick={() => navigate('/copytrade')} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white mb-4">
      <ArrowLeft className="w-4 h-4" />Top Experts
    </button>
  );

  if (loading && !data) return <Page title="Expert" icon={Users}>{back}<Loading /></Page>;
  if (error && !data) return <Page title="Expert" icon={Users}>{back}<ErrorState message={error} onRetry={reload} /></Page>;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 pt-4 pb-32 md:pb-8 text-zinc-100">
      {back}

      <Panel className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar src={t.avatar} name={t.username} size={84} badge={t.badge} />
          <div className="flex-1 min-w-0">
            <div className="text-xl"><TraderName trader={t} /></div>
            <p className="text-sm text-neutral-400">{[t.fullName, t.country].filter(Boolean).join(' · ')}</p>
            <p className="text-sm text-neutral-300 mt-1"><span className="font-semibold text-white">{compact(t.followers)}</span> followers · <span className="font-semibold text-white">{t.copiers}</span> copiers</p>
            <div className="flex gap-1.5 mt-2 flex-wrap"><RiskBadge level={t.riskLevel} />{t.markets?.map((m) => <Badge key={m}>{m}</Badge>)}</div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="text-left sm:text-right">
              <p className="text-xs text-neutral-500">Total return</p>
              <p className={`text-2xl font-semibold ${toneOf(t.performance.roi)}`}>{pct(t.performance.roi)}</p>
            </div>
          </div>
        </div>
        {t.bio && <p className="text-sm text-neutral-300 mt-4">{t.bio}</p>}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-neutral-800">
          <FollowButton key={`${t.traderId}-${t.isFollowing}`} trader={t} size="md" onChange={reload} />
          {t.myCopy
            ? <Button variant="secondary" onClick={() => navigate('/copy-positions')}>You're copying · manage</Button>
            : <Button disabled={!t.acceptingCopiers} onClick={() => setCopyOpen(true)}>{t.acceptingCopiers ? 'Copy' : 'Not accepting copiers'}</Button>}
          <span className="text-sm text-neutral-400 sm:ml-auto">Minimum to copy <span className="font-semibold text-white">{formatMoney(t.minCopyAmount, data.currency)}</span> · {t.commissionRate}% fee on profit</span>
        </div>
      </Panel>

      <Tabs value={tab} onChange={setTab} tabs={[{ value: 'stats', label: 'Stats' }, { value: 'trades', label: `Trades (${data.stats.totalTrades + data.stats.openTrades})` }]} />
      {tab === 'stats' ? <StatsTab data={data} /> : <TradesTab traderId={t.traderId} />}

      <p className="text-xs text-neutral-500 mt-6">Past performance does not guarantee future results. You can lose money copying any trader.</p>

      {copyOpen && (
        <CopyModal
          trader={t}
          currency={data.currency}
          balance={data.availableBalance}
          onClose={() => setCopyOpen(false)}
          onCopied={reload}
        />
      )}
    </div>
  );
}
