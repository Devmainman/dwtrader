// AI Smart Trader: subscribe to a bot that trades for you, then track how many
// trades it has placed and how many it has left.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { smartBotsApi } from '../../api/products';
import {
  Page, Button, Badge, Modal, Field, inputClass, Tabs, ProgressRing,
  Loading, ErrorState, Empty, useLoader, useAction, formatMoney, formatDate
} from './ui';

const HOW = [
  ['Choose a bot', 'Each bot shows its price and how many trades it will place for you.'],
  ['Set its capital', 'Pick how much capital the bot trades with. Profit and loss on each trade is a share of it.'],
  ['Pay', 'Pay the subscription with any payment method. The bot starts once the payment is approved.'],
  ['Track it', 'Watch every trade, how many it has done and how many are left.']
];
const STATUS = {
  awaiting_payment: <Badge tone="warning">Payment needed</Badge>,
  pending: <Badge tone="info">Payment in review</Badge>,
  active: <Badge tone="success">Trading</Badge>,
  completed: <Badge>Finished</Badge>,
  rejected: <Badge tone="danger">Rejected</Badge>,
  stopped: <Badge>Stopped</Badge>
};
const every = (m) => (m >= 1440 ? `${Math.round(m / 1440)} day` : m >= 60 ? `${Math.round(m / 60)} h` : `${m} min`);
const payUrl = (id, amount, currency) => `/payment?mode=bot&botSubscription=${id}&amount=${encodeURIComponent(amount ?? '')}&currency=${encodeURIComponent(currency || '')}`;

function SubscribeModal({ bot, onClose }) {
  const navigate = useNavigate();
  const { busy, run } = useAction();
  const [allocation, setAllocation] = useState(String(bot.minAllocation || ''));
  const [error, setError] = useState('');
  const submit = async () => {
    setError('');
    const a = Number(allocation);
    if (!(a > 0)) return setError('Enter the capital for the bot');
    if (a < bot.minAllocation) return setError(`At least ${formatMoney(bot.minAllocation, bot.currency)}`);
    const r = await run(() => smartBotsApi.subscribe(bot._id, a), 'Subscribed. Now pay to start the bot.');
    if (r?._id) navigate(payUrl(r._id, r.amount, r.currency));
  };
  return (
    <Modal open title={`Subscribe to ${bot.name}`} onClose={onClose}
      footer={<Button className="w-full" busy={busy} onClick={submit}>Subscribe · pay {formatMoney(bot.price, bot.currency)}</Button>}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl bg-neutral-800/60 p-3"><p className="text-neutral-400">Trades</p><p className="text-white font-medium mt-0.5">{bot.tradeLimit}</p></div>
          <div className="rounded-xl bg-neutral-800/60 p-3"><p className="text-neutral-400">Every</p><p className="text-white font-medium mt-0.5">{every(bot.tradeIntervalMinutes)}</p></div>
          <div className="rounded-xl bg-neutral-800/60 p-3"><p className="text-neutral-400">Win rate</p><p className="text-white font-medium mt-0.5">{bot.winRate}%</p></div>
        </div>
        <Field label={`Capital for the bot (${bot.currency})`} hint={`Minimum ${formatMoney(bot.minAllocation, bot.currency)}. Each trade's result is credited to or taken from your balance.`}>
          <input className={inputClass} inputMode="decimal" value={allocation} onChange={(e) => setAllocation(e.target.value)} />
        </Field>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </Modal>
  );
}

function SubscriptionCard({ s, onChanged }) {
  const navigate = useNavigate();
  const { busy, run } = useAction();
  const pct = Math.round((s.tradesUsed / Math.max(1, s.tradeLimit)) * 100);
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#1D1D1F] p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ProgressRing value={pct} size={52}><span className="text-[11px] font-semibold">{pct}%</span></ProgressRing>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 truncate">{s.botName}</p>
            <p className="text-[11px] text-neutral-400">Capital {formatMoney(s.allocation, s.currency)} · {s.strategy}</p>
          </div>
        </div>
        {STATUS[s.status]}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Trades done</p><p className="text-white font-medium">{s.tradesUsed} of {s.tradeLimit}</p></div>
        <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Trades left</p><p className="text-white font-medium">{s.tradesLeft}</p></div>
        <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Won / lost</p><p className="text-white font-medium">{s.wins} / {s.losses}</p></div>
        <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Total result</p><p className={`font-medium ${s.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{s.totalPnl >= 0 ? '+' : ''}{formatMoney(s.totalPnl, s.currency)}</p></div>
      </div>
      {s.status === 'active' && s.nextTradeAt && <p className="text-[11px] text-neutral-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Next trade around {new Date(s.nextTradeAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
      {s.status === 'rejected' && s.payment?.note && <p className="text-xs text-red-400">Payment rejected: {s.payment.note}</p>}
      {s.status === 'awaiting_payment' && (
        <div className="flex gap-2">
          <Button onClick={() => navigate(payUrl(s._id, s.payment?.amount, s.payment?.currency))}>Pay {formatMoney(s.payment?.amount, s.payment?.currency)}</Button>
          <Button variant="secondary" busy={busy} onClick={() => run(() => smartBotsApi.cancel(s._id), 'Cancelled').then((x) => x && onChanged())}>Cancel</Button>
        </div>
      )}
      {s.trades?.length > 0 && (
        <div className="divide-y divide-neutral-800 rounded-lg border border-neutral-800">
          {s.trades.slice(0, 8).map((t) => (
            <div key={t._id} className="flex items-center justify-between px-3 py-2 text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {t.result === 'win' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                <span className="text-zinc-200">#{t.number} {t.market}</span>
                <span className="text-neutral-500 capitalize">{t.side}</span>
              </div>
              <span className={t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>{t.pnl >= 0 ? '+' : ''}{formatMoney(t.pnl, t.currency)}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-neutral-500">Started {formatDate(s.startedAt || s.createdAt)}</p>
    </div>
  );
}

export default function SmartTrader() {
  const [tab, setTab] = useState('bots');
  const [picked, setPicked] = useState(null);
  const bots = useLoader(() => smartBotsApi.list(), []);
  const mine = useLoader(() => smartBotsApi.mine(), []);
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === 'visible') mine.reload(); }, 20000);
    return () => clearInterval(t);
  }, [mine.reload]);
  const subs = mine.data?.items || [];
  const openBots = useMemo(() => new Set(subs.filter((s) => ['awaiting_payment', 'pending', 'active'].includes(s.status)).map((s) => String(s.bot))), [subs]);
  useEffect(() => { if (subs.some((s) => s.status === 'active')) setTab((t) => (t === 'bots' && !picked ? 'mine' : t)); }, [subs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page title="AI Smart Trader" subtitle="Bots that trade for you, a set number of times" icon={Bot}>
      <Tabs value={tab} onChange={setTab} how={HOW} tabs={[{ value: 'bots', label: 'Bots' }, { value: 'mine', label: `My bots${subs.length ? ` (${subs.length})` : ''}` }]} />
      {tab === 'mine' ? (
        mine.error ? <ErrorState message={mine.error} onRetry={mine.reload} />
          : mine.loading && !mine.data ? <Loading />
            : !subs.length ? <Empty icon={Bot} title="No bots yet" text="Subscribe to a bot and it trades for you." />
              : <div className="grid lg:grid-cols-2 gap-3">{subs.map((s) => <SubscriptionCard key={s._id} s={s} onChanged={mine.reload} />)}</div>
      ) : bots.error ? <ErrorState message={bots.error} onRetry={bots.reload} />
        : bots.loading && !bots.data ? <Loading />
          : !bots.data?.items?.length ? <Empty icon={Bot} title="No bots available yet" text="Check back soon." />
            : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {bots.data.items.map((b) => (
                  <div key={b._id} className="rounded-xl border border-neutral-800 bg-[#1D1D1F] p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0"><Bot className="w-5 h-5" /></span>
                      <div className="min-w-0"><p className="text-sm font-semibold text-zinc-100 truncate">{b.name}</p><p className="text-[11px] text-neutral-400">{b.strategy}</p></div>
                    </div>
                    {b.description && <p className="text-xs text-neutral-400">{b.description}</p>}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Trades</p><p className="text-white font-medium">{b.tradeLimit}</p></div>
                      <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Every</p><p className="text-white font-medium">{every(b.tradeIntervalMinutes)}</p></div>
                      <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Win rate</p><p className="text-white font-medium">{b.winRate}%</p></div>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">Trades {(b.markets || []).join(', ')}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base font-semibold text-white">{formatMoney(b.price, b.currency)}</p>
                      {openBots.has(String(b._id))
                        ? <Button variant="secondary" onClick={() => setTab('mine')}>View my bot</Button>
                        : <Button onClick={() => setPicked(b)}>Subscribe</Button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
      {picked && <SubscribeModal bot={picked} onClose={() => setPicked(null)} />}
    </Page>
  );
}
