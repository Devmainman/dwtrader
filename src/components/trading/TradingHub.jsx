// Trading packages: pick a package, stake an amount, watch it earn, get paid at the end.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Clock, ArrowRight, CandlestickChart } from 'lucide-react';
import { packagesApi, apiError } from '../../api/products';
import { useUserAuth } from '../../context/UserAuthContext';
import { toast } from '../../lib/toast';
import {
  Page, Panel, Stat, Button, Badge, Modal, Field, Tabs, inputClass, Loading, ErrorState, Empty,
  AnimatedNumber, ProgressRing, stagger, useLoader, formatMoney, formatDate
} from '../products/ui';

const INTERVAL = { minute: 'minute', '5-minutes': '5 min', '15-minutes': '15 min', '30-minutes': '30 min', hour: 'hour', daily: 'day' };
const INTERVAL_MS = { minute: 60e3, '5-minutes': 300e3, '15-minutes': 900e3, '30-minutes': 1800e3, hour: 3600e3, daily: 86400e3 };

/** Re-render every second so countdowns and the live "earned" figure stay current. */
function useNow(active = true) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

const countdown = (ms) => {
  if (ms <= 0) return 'now';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m ${s % 60}s`;
};

function StartModal({ pkg, balance, currency, onClose, onStarted }) {
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const n = Number(amount) || 0;
  const err = amount === '' ? '' : n < pkg.minAmount ? `Minimum is ${formatMoney(pkg.minAmount, currency)}` : n > pkg.maxAmount ? `Maximum is ${formatMoney(pkg.maxAmount, currency)}` : n > balance ? 'Not enough balance' : '';
  const start = async () => {
    setBusy(true);
    try {
      await packagesApi.start(pkg.id, n);
      toast.success(`${pkg.name} started`, { description: `${formatMoney(n, currency)} is now working` });
      onStarted();
      onClose();
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open title={`Start ${pkg.name}`} onClose={onClose}
      footer={(<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={busy} disabled={!n || !!err} onClick={start}>Start trade</Button></>)}>
      <Field label={`Amount (${currency})`} hint={`Between ${formatMoney(pkg.minAmount, currency)} and ${formatMoney(pkg.maxAmount, currency)} · available ${formatMoney(balance, currency)}`}>
        <input type="number" step="any" min={pkg.minAmount} autoFocus className={inputClass} placeholder={String(pkg.minAmount)} value={amount} onChange={(e) => setAmount(e.target.value)} />
        {err && <span className="block text-[11px] text-red-400 mt-1">{err}</span>}
      </Field>
      <dl className="text-xs space-y-1.5 bg-neutral-900 rounded-xl p-3">
        <div className="flex justify-between"><dt className="text-neutral-400">Earns</dt><dd>{pkg.rate}% every {INTERVAL[pkg.interval] || pkg.interval}</dd></div>
        <div className="flex justify-between"><dt className="text-neutral-400">Runs for</dt><dd>{pkg.duration} hour{pkg.duration === 1 ? '' : 's'}</dd></div>
        <div className="flex justify-between"><dt className="text-neutral-400">Expected profit</dt><dd className="text-emerald-400">{formatMoney(n * (pkg.totalReturnPercent / 100), currency)}</dd></div>
        <div className="flex justify-between font-medium"><dt>You receive at the end</dt><dd>{formatMoney(n * (1 + pkg.totalReturnPercent / 100), currency)}</dd></div>
      </dl>
      <p className="text-[10px] text-neutral-500 mt-3">You can cancel within 30 minutes and get your stake back. After that the trade runs to the end.</p>
    </Modal>
  );
}

function TradeCard({ t, now, onCancel, i }) {
  const running = t.status === 'in-progress';
  const start = new Date(t.startDate).getTime();
  const end = new Date(t.endDate).getTime();
  const progress = running ? Math.min(100, ((now - start) / Math.max(1, end - start)) * 100) : t.status === 'completed' ? 100 : t.progress;
  // Earned so far, updated client-side each completed interval until the server confirms.
  const step = INTERVAL_MS[t.interval] || 3600e3;
  const done = running ? Math.min(Math.floor((end - start) / step), Math.floor((Math.min(now, end) - start) / step)) : 0;
  const earned = running ? Math.max(t.earned, Math.round(t.amount * (t.rate / 100) * done * 100) / 100) : t.status === 'completed' ? t.profit : 0;
  return (
    <li {...stagger(i)} className={`${stagger(i).className} flex items-center gap-3 py-3`}>
      <ProgressRing value={progress} size={46} color={t.status === 'completed' ? '#10b981' : t.status === 'terminated' ? '#525252' : 'var(--color-blue-500)'}>
        <span className="text-[10px] font-semibold tabular-nums">{Math.round(progress)}%</span>
      </ProgressRing>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{t.name}</p>
        <p className="text-[10px] text-neutral-500">
          {formatMoney(t.amount, t.currency)} · {running ? <span className="inline-flex items-center gap-1"><Clock className="w-2.5 h-2.5" />ends in {countdown(end - now)}</span> : formatDate(t.endDate)}
        </p>
      </div>
      <div className="text-right">
        {running ? <AnimatedNumber value={earned} format={(v) => `+${v.toFixed(2)}`} className="text-sm font-semibold text-emerald-400" />
          : t.status === 'completed' ? <p className="text-sm font-semibold text-emerald-400">+{t.profit.toFixed(2)}</p>
            : <Badge>{t.status === 'terminated' ? 'Cancelled' : t.status}</Badge>}
        <p className="text-[10px] text-neutral-500">{running ? `of +${t.profit.toFixed(2)}` : t.status === 'completed' ? 'paid out' : 'stake returned'}</p>
      </div>
      {running && t.cancellable && <Button variant="ghost" className="h-7 px-2.5 text-[11px]" onClick={() => onCancel(t)}>Cancel</Button>}
    </li>
  );
}

export default function TradingHub() {
  const { user, refreshUser } = useUserAuth();
  const [tab, setTab] = useState('active');
  const packages = useLoader(() => packagesApi.packages(), []);
  const activity = useLoader(() => packagesApi.activities(), []);
  const [startPkg, setStartPkg] = useState(null);
  const trades = activity.data?.trades || [];
  const running = trades.filter((t) => t.status === 'in-progress');
  const now = useNow(running.length > 0);
  const currency = activity.data?.displayCurrency || user?.currency || 'USD';

  // Refresh from the server when a running trade reaches its end.
  useEffect(() => {
    if (running.some((t) => new Date(t.endDate).getTime() <= now)) activity.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.floor(now / 5000)]);

  const refresh = () => { activity.reload(); refreshUser?.(); };
  const cancel = async (t) => {
    if (!window.confirm(`Cancel ${t.name}? Your ${formatMoney(t.amount, t.currency)} stake will be returned without profit.`)) return;
    try {
      await packagesApi.cancel(t.id);
      toast.success('Trade cancelled', { description: 'Your stake was returned to your balance.' });
      refresh();
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const list = tab === 'active' ? running : trades.filter((t) => t.status !== 'in-progress');
  return (
    <Page title="Trading" subtitle="Automated trading packages that pay out at the end of their term." icon={Bot}
      actions={<Link to="/trademain"><Button variant="secondary"><CandlestickChart className="w-3.5 h-3.5" />Live markets<ArrowRight className="w-3.5 h-3.5" /></Button></Link>}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Working now" value={formatMoney(activity.data?.totals?.amount, currency)} />
        <Stat label="Profit earned" value={formatMoney(activity.data?.totals?.profit, currency)} tone="up" />
        <Stat label="Available" value={formatMoney(user?.balance, currency)} />
      </div>

      <h2 className="text-sm font-semibold mb-2">Packages</h2>
      {packages.loading && !packages.data ? <Loading /> : packages.error ? <ErrorState message={packages.error} onRetry={packages.reload} /> : !packages.data.packages.length ? (
        <Panel className="mb-5"><Empty icon={Bot} title="No packages available" text="Check back soon." /></Panel>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 mb-5 -mx-3 px-3 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {packages.data.packages.map((p, i) => (
            <div key={p.id} {...stagger(i)} className={`${stagger(i).className} snap-start shrink-0 w-[230px] rounded-xl bg-[#1D1D1F] border border-neutral-800 p-4 flex flex-col`}>
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-2xl font-semibold text-emerald-400 mt-2 tabular-nums">{p.totalReturnPercent}%</p>
              <p className="text-[10px] text-neutral-500">over {p.duration} hour{p.duration === 1 ? '' : 's'} · {p.rate}% per {INTERVAL[p.interval] || p.interval}</p>
              <p className="text-xs text-neutral-400 mt-3">{formatMoney(p.minAmount, currency)} – {formatMoney(p.maxAmount, currency)}</p>
              <Button className="mt-3 w-full" onClick={() => setStartPkg(p)}>Start</Button>
            </div>
          ))}
        </div>
      )}

      <Panel>
        <Tabs value={tab} onChange={setTab} how={[['Choose a package', 'Each package shows its term and expected return.'], ['Fund it', 'Set the amount to put to work from your balance.'], ['It trades for you', 'Follow progress under Running.'], ['Paid at the end', 'Your stake and profit return to your balance when the term ends.']]} tabs={[{ value: 'active', label: running.length ? `Running (${running.length})` : 'Running' }, { value: 'history', label: 'History' }]} />
        {activity.loading && !activity.data ? <Loading /> : !list.length ? (
          <Empty icon={Bot} title={tab === 'active' ? 'No running trades' : 'No finished trades yet'} text={tab === 'active' ? 'Start a package above to begin.' : undefined} />
        ) : (
          <ul className="divide-y divide-neutral-800">{list.map((t, i) => <TradeCard key={t.id} t={t} now={now} i={i} onCancel={cancel} />)}</ul>
        )}
      </Panel>

      {startPkg && <StartModal pkg={startPkg} balance={user?.balance || 0} currency={currency} onClose={() => setStartPkg(null)} onStarted={refresh} />}
    </Page>
  );
}
