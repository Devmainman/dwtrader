// Manage your copies: equity, open positions, settings, add funds, pause, stop.
import { useState } from 'react';
import { Wallet, Pause, Play, Square, Plus, Settings2, X, History } from 'lucide-react';
import { copyTradingApi } from '../../api/products';
import {
  Panel, Button, Badge, Modal, Field, inputClass, AmountModal, Tabs,
  Loading, ErrorState, Empty, useLoader, useAction, formatMoney, formatDate, formatNumber
} from '../products/ui';
import { Avatar, TraderName, pct, toneOf } from './shared';

const STATUS = {
  active: <Badge tone="success">Copying</Badge>,
  paused: <Badge tone="warning">Paused</Badge>,
  stopping: <Badge tone="info">Stopping…</Badge>,
  stopped: <Badge>Stopped</Badge>
};
const STOP_REASON = { user: 'Stopped by you', stop_loss: 'Stop loss hit', take_profit: 'Take profit hit', admin: 'Stopped by support', trader_removed: 'Trader removed' };
const CLOSE_REASON = { trader_closed: 'Trader closed', manual: 'Closed by you', copy_stopped: 'Copy stopped', cancelled: 'Cancelled (refunded)' };

function SettingsModal({ copy, onClose, onSaved }) {
  const { busy, run } = useAction();
  const [sl, setSl] = useState(copy?.settings?.stopLossPercent ?? '');
  const [tp, setTp] = useState(copy?.settings?.takeProfitPercent ?? '');
  if (!copy) return null;
  const save = async () => {
    const res = await run(() => copyTradingApi.settings(copy._id, {
      stopLossPercent: sl === '' ? null : Number(sl),
      takeProfitPercent: tp === '' ? null : Number(tp)
    }), 'Settings saved');
    if (res) { onSaved(); onClose(); }
  };
  return (
    <Modal open title={`Risk settings · ${copy.traderUsername}`} onClose={onClose}
      footer={(<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={busy} onClick={save}>Save</Button></>)}>
      <p className="text-sm text-neutral-400 mb-4">Measured against the {formatMoney(copy.amount, copy.currency)} you've put in. Leave empty to turn off.</p>
      <Field label="Stop loss (%)" hint="Stop copying and return funds if the copy loses this much.">
        <input type="number" min="1" max="100" className={inputClass} value={sl} onChange={(e) => setSl(e.target.value)} placeholder="Off" />
      </Field>
      <Field label="Take profit (%)" hint="Stop copying and lock in gains when the copy is up this much.">
        <input type="number" min="1" max="1000" className={inputClass} value={tp} onChange={(e) => setTp(e.target.value)} placeholder="Off" />
      </Field>
    </Modal>
  );
}

function CopyCard({ copy, balance, onChanged }) {
  const { busy, run } = useAction();
  const [modal, setModal] = useState(null); // 'funds' | 'settings' | 'stop'
  const open = copy.status !== 'stopped';
  const act = async (fn, msg) => { if (await run(fn, msg)) onChanged(); };

  return (
    <Panel>
      <div className="flex items-center gap-3">
        <Avatar src={copy.traderAvatar} name={copy.traderUsername} badge={copy.traderBadge} />
        <div className="flex-1 min-w-0">
          <TraderName trader={{ username: copy.traderUsername, badge: copy.traderBadge }} />
          <p className="text-xs text-neutral-500">Since {formatDate(copy.startedAt)}{copy.stoppedAt ? ` · ended ${formatDate(copy.stoppedAt)}` : ''}</p>
        </div>
        {STATUS[copy.status]}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
        <div><p className="text-xs text-neutral-500">{open ? 'Value' : 'Paid out'}</p><p className="font-semibold">{formatMoney(open ? copy.equity : copy.payout, copy.currency)}</p></div>
        <div><p className="text-xs text-neutral-500">Invested</p><p className="font-semibold">{formatMoney(copy.amount, copy.currency)}</p></div>
        <div><p className="text-xs text-neutral-500">Profit / loss</p><p className={`font-semibold ${toneOf(copy.totalPnl)}`}>{formatMoney(copy.totalPnl, copy.currency)} <span className="text-xs">({pct(copy.totalPnlPercent)})</span></p></div>
        <div><p className="text-xs text-neutral-500">{open ? 'Free cash' : 'Fees paid'}</p><p className="font-semibold">{formatMoney(open ? copy.cash : copy.commissionPaid, copy.currency)}</p></div>
      </div>
      {!open && copy.stopReason && <p className="text-xs text-neutral-500 mt-2">{STOP_REASON[copy.stopReason]}</p>}
      {open && (copy.settings?.stopLossPercent || copy.settings?.takeProfitPercent) && (
        <p className="text-xs text-neutral-500 mt-2">
          {copy.settings.stopLossPercent ? `Stop loss −${copy.settings.stopLossPercent}%` : ''}
          {copy.settings.stopLossPercent && copy.settings.takeProfitPercent ? ' · ' : ''}
          {copy.settings.takeProfitPercent ? `Take profit +${copy.settings.takeProfitPercent}%` : ''}
        </p>
      )}

      {open && copy.openPositions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Open positions</p>
          <ul className="divide-y divide-neutral-800 text-sm">
            {copy.openPositions.map((p) => (
              <li key={p._id} className="py-2.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate">
                    <Badge tone={p.side === 'buy' ? 'success' : 'danger'}>{p.side.toUpperCase()}</Badge>
                    <span className="ml-1.5 font-medium">{p.symbol}</span>
                    {p.leverage > 1 && <span className="text-xs text-neutral-500"> · {p.leverage}x</span>}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {formatMoney(p.margin, copy.currency)} margin · {formatNumber(p.entryPrice, 6)} → {formatNumber(p.markPrice, 6)}
                  </p>
                </div>
                <div className={`text-right shrink-0 ${toneOf(p.unrealizedPnl)}`}>
                  <p className="font-medium">{formatMoney(p.unrealizedPnl, copy.currency)}</p>
                  <p className="text-xs">{pct(p.unrealizedPercent)}</p>
                </div>
                <button type="button" disabled={busy} className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800" title="Close this position now" aria-label={`Close ${p.symbol}`}
                  onClick={() => window.confirm(`Close ${p.symbol} now at the current price?`) && act(() => copyTradingApi.closePosition(p._id), 'Position closed')}>
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {open && copy.openPositions.length === 0 && <p className="text-xs text-neutral-500 mt-4">No open positions. New trades by {copy.traderUsername} will appear here{copy.status === 'paused' ? ' once you resume' : ''}.</p>}

      {open && copy.status !== 'stopping' && (
        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="secondary" onClick={() => setModal('funds')}><Plus className="w-4 h-4" />Add funds</Button>
          {copy.status === 'active'
            ? <Button variant="secondary" busy={busy} onClick={() => act(() => copyTradingApi.pause(copy._id), 'Copy paused')}><Pause className="w-4 h-4" />Pause</Button>
            : <Button variant="secondary" busy={busy} onClick={() => act(() => copyTradingApi.resume(copy._id), 'Copy resumed')}><Play className="w-4 h-4" />Resume</Button>}
          <Button variant="ghost" onClick={() => setModal('settings')}><Settings2 className="w-4 h-4" />Risk settings</Button>
          <Button variant="ghost" onClick={() => setModal('stop')}><Square className="w-4 h-4" />Stop copying</Button>
        </div>
      )}

      <AmountModal
        open={modal === 'funds'}
        title={`Add funds · ${copy.traderUsername}`}
        currency={copy.currency}
        max={balance}
        confirmLabel="Add funds"
        busy={busy}
        onClose={() => setModal(null)}
        onSubmit={async (amount) => { if (await run(() => copyTradingApi.addFunds(copy._id, amount), 'Funds added')) { setModal(null); onChanged(); } }}
      />
      {modal === 'settings' && <SettingsModal copy={copy} onClose={() => setModal(null)} onSaved={onChanged} />}
      <Modal
        open={modal === 'stop'}
        title={`Stop copying ${copy.traderUsername}?`}
        onClose={() => setModal(null)}
        footer={(<><Button variant="secondary" onClick={() => setModal(null)}>Keep copying</Button><Button variant="danger" busy={busy} onClick={async () => { if (await run(() => copyTradingApi.stop(copy._id), (r) => `Stopped. ${formatMoney(r?.payout, copy.currency)} returned to your balance.`)) { setModal(null); onChanged(); } }}>Stop and withdraw</Button></>)}
      >
        <p className="text-sm text-neutral-300">
          {copy.openPositions.length > 0 ? `Your ${copy.openPositions.length} open position(s) will be closed at the current price. ` : ''}
          About {formatMoney(copy.equity, copy.currency)} will return to your main balance.
        </p>
      </Modal>
    </Panel>
  );
}

function HistoryList() {
  const { data, loading } = useLoader(() => copyTradingApi.history({ limit: 50 }), []);
  if (loading) return <Loading />;
  const items = data?.items || [];
  if (!items.length) return <Panel><Empty icon={History} title="No closed copied trades yet" /></Panel>;
  return (
    <Panel>
      <ul className="divide-y divide-neutral-800 text-sm">
        {items.map((p) => (
          <li key={p._id} className="py-3 flex justify-between gap-2">
            <div className="min-w-0">
              <p><Badge tone={p.side === 'buy' ? 'success' : 'danger'}>{p.side.toUpperCase()}</Badge> <span className="ml-1 font-medium">{p.symbol}</span> <span className="text-neutral-400">· {p.traderUsername}</span></p>
              <p className="text-xs text-neutral-500">{formatDate(p.closedAt)} · {CLOSE_REASON[p.closedReason] || p.closedReason} · {formatNumber(p.entryPrice, 6)} → {formatNumber(p.exitPrice, 6)}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={toneOf(p.profitLoss)}>{p.profitLoss >= 0 ? '+' : ''}{formatNumber(p.profitLoss)}</p>
              {p.commission > 0 && <p className="text-xs text-neutral-500">fee {formatNumber(p.commission)}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** The Copying tab: your copies (active / stopped) and closed-trade history. */
export default function CopyingPanel({ onBrowse }) {
  const [tab, setTab] = useState('active');
  const { data, loading, error, reload } = useLoader(() => copyTradingApi.copies(tab === 'stopped' ? 'stopped' : undefined), [tab]);

  return (
    <>
      <Tabs variant="underline" value={tab} onChange={setTab} tabs={[{ value: 'active', label: 'Active' }, { value: 'stopped', label: 'Stopped' }, { value: 'history', label: 'Trade history' }]} />
      {tab === 'history' ? <HistoryList /> : loading && !data ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        (data?.copies || []).length === 0 ? (
          <Panel>
            <Empty icon={Wallet} title={tab === 'active' ? "You're not copying anyone yet" : 'No stopped copies'}
              text={tab === 'active' ? 'Pick an expert and their trades will be mirrored in your account automatically.' : undefined}
              action={tab === 'active' && onBrowse && <Button onClick={onBrowse}>Browse top experts</Button>} />
          </Panel>
        ) : (
          <div className="space-y-4">
            {data.copies.map((c) => <CopyCard key={c._id} copy={c} balance={data.availableBalance} onChanged={reload} />)}
          </div>
        )
      )}
    </>
  );
}
