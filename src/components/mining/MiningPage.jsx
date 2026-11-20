// Mining: a rig that earns while a session runs, boosters, pools and rewards.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Cpu, Fan, Zap, Gift, Play, Square, Server, Rocket, Waves, History as HistoryIcon, Check, Loader2 } from 'lucide-react';
import { miningApi, apiError } from '../../api/products';
import { useUserAuth } from '../../context/UserAuthContext';
import { toast } from '../../lib/toast';
import {
  Page, Panel, Button, Badge, Tabs, Loading, Empty, AnimatedNumber, ProgressRing, stagger, formatMoney, formatDate
} from '../products/ui';

const hm = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`;
};

/** Ticks every second while mining so the earnings counter feels live. */
function useTicker(active) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

/** Running total with enough decimals to move every second (earnings per second are fractions of a cent). */
const liveMoney = (v, currency) => {
  const digits = v < 10 ? 5 : v < 1000 ? 4 : 2;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v);
  } catch {
    return `${v.toFixed(digits)} ${currency || ''}`.trim();
  }
};

function Rig({ stats, now, onStart, onStop, onClaim, busy }) {
  const s = stats.activeSession;
  const mining = !!s;
  const startedAt = s ? new Date(s.startedAt).getTime() : 0;
  const endsAt = s ? new Date(s.endsAt).getTime() : 0;
  const progress = s ? Math.min(100, ((now - startedAt) / Math.max(1, endsAt - startedAt)) * 100) : 0;
  // Count up from the server's exact figure at the current rate (boosters and pool fee included).
  const perSecond = s ? (s.ratePerSecond ?? (s.dailyEarnings / 86400) * (1 - (s.poolFee || 0) / 100)) : 0;
  const asOf = s?.asOf ? new Date(s.asOf).getTime() : startedAt;
  const base = s ? (s.earnedExact ?? s.earnedSoFar ?? 0) : 0;
  const live = s ? base + (Math.max(0, Math.min(now, endsAt) - asOf) / 1000) * perSecond : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[radial-gradient(120%_120%_at_0%_0%,#1e3a8a33_0%,#1D1D1F_45%,#1D1D1F_100%)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-neutral-400 flex items-center gap-1.5">
            <span className="relative flex w-2 h-2">
              {mining && <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 animate-[pulse-dot_1.6s_ease-out_infinite]" />}
              <span className={`relative inline-flex w-2 h-2 rounded-full ${mining ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
            </span>
            {mining ? `Mining on ${s.pool}` : 'Rig idle'}
          </p>
          <p className="text-[28px] leading-tight font-semibold mt-2 tabular-nums">
            {mining ? <AnimatedNumber value={live} format={(v) => liveMoney(v, stats.currency)} /> : formatMoney(stats.pendingRewards, stats.currency)}
          </p>
          <p className="text-[11px] text-neutral-500">
            {mining ? `earned this session · +${formatMoney(perSecond * 3600, stats.currency)}/hour` : stats.pendingRewards > 0 ? 'ready to claim' : 'start a session to earn'}
          </p>
        </div>
        <ProgressRing value={progress} size={72} stroke={5} color={mining ? '#10b981' : '#404040'}>
          <Fan className={`w-7 h-7 ${mining ? 'text-emerald-400 animate-spin [animation-duration:1.4s]' : 'text-neutral-600'}`} strokeWidth={1.6} />
        </ProgressRing>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-5 text-center">
        <div className="rounded-xl bg-black/30 py-2"><p className="text-[10px] text-neutral-500">Hash rate</p><p className="text-sm font-semibold tabular-nums">{stats.hashRate} <span className="text-[10px] text-neutral-500">MH/s</span></p></div>
        <div className="rounded-xl bg-black/30 py-2"><p className="text-[10px] text-neutral-500">Per day</p><p className="text-sm font-semibold tabular-nums">{formatMoney(stats.dailyEarnings, stats.currency)}</p></div>
        <div className="rounded-xl bg-black/30 py-2"><p className="text-[10px] text-neutral-500">{mining ? 'Time left' : 'Machines'}</p><p className="text-sm font-semibold tabular-nums">{mining ? hm((endsAt - now) / 1000) : `${stats.activeMachines}/${stats.machines}`}</p></div>
      </div>

      <div className="flex gap-2 mt-4">
        {mining
          ? <Button variant="secondary" className="flex-1 h-10" busy={busy === 'stop'} disabled={!!busy} onClick={onStop}><Square className="w-3.5 h-3.5" />Stop & collect</Button>
          : <Button className="flex-1 h-10" busy={busy === 'start'} disabled={!!busy || !stats.activeMachines} onClick={onStart}><Play className="w-3.5 h-3.5" />Start mining</Button>}
        {stats.pendingRewards > 0 && (
          <Button className="flex-1 h-10 !bg-emerald-500 hover:!bg-emerald-400 animate-[claim-pop_600ms_ease-out]" busy={busy === 'claim'} disabled={!!busy} onClick={onClaim}>
            <Gift className="w-3.5 h-3.5" />Claim {formatMoney(stats.pendingRewards, stats.currency)}
          </Button>
        )}
      </div>
      {!stats.activeMachines && !mining && <p className="text-[11px] text-neutral-500 mt-2">Add a machine from the shop below to start mining.</p>}
    </div>
  );
}

/** Pool location may arrive as text or as { city, country }. */
const placeName = (loc) => (typeof loc === 'string' ? loc : [loc?.city, loc?.country].filter(Boolean).join(', ')) || 'Global';

export default function MiningPage() {
  const { refreshUser } = useUserAuth();
  const [stats, setStats] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [boosters, setBoosters] = useState({ activeBoosters: [] });
  const [pools, setPools] = useState([]);
  const [history, setHistory] = useState(null);
  const [tab, setTab] = useState('machines');
  const [busy, setBusy] = useState(null); // key of the request running, or null
  const [poolId, setPoolId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [s, c, e, b, p] = await Promise.all([miningApi.stats(), miningApi.catalog(), miningApi.equipment(), miningApi.boosters(), miningApi.pools()]);
      // Stamp the snapshot with this device's clock so the live counter can't jump on clock skew.
      setStats(s?.activeSession ? { ...s, activeSession: { ...s.activeSession, asOf: Date.now() } } : s);
      setCatalog(c); setEquipment(e); setBoosters(b); setPools(p);
      setPoolId((cur) => (p.some((x) => x.id === cur) ? cur : p.find((x) => x.isDefault)?.id || p[0]?.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (tab === 'history') miningApi.history().then(setHistory).catch(() => setHistory([])); }, [tab]);

  const mining = !!stats?.activeSession;
  const now = useTicker(mining || (boosters.activeBoosters || []).length > 0);
  // Refresh from the server every 30s while mining, and when the session ends.
  useEffect(() => {
    if (!mining) return undefined;
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [mining, load]);
  useEffect(() => {
    if (mining && new Date(stats.activeSession.endsAt).getTime() <= now) load();
  }, [mining, stats, now, load]);
  // When a booster runs out, refresh so the rate drops right away.
  const nextBoostEnd = Math.min(...(boosters.activeBoosters || []).map((b) => new Date(b.expiresAt).getTime()).filter((t) => t > 0), Infinity);
  const refreshedFor = useRef(0);
  useEffect(() => {
    if (nextBoostEnd !== Infinity && nextBoostEnd <= now && refreshedFor.current !== nextBoostEnd) {
      refreshedFor.current = nextBoostEnd;
      load();
    }
  }, [nextBoostEnd, now, load]);

  /** Runs one request: its button spins, the others wait. Returns true when it worked. */
  const act = async (key, fn, success) => {
    if (busy) return false;
    setBusy(key);
    try {
      const r = await fn();
      toast.success(typeof success === 'function' ? success(r) : success);
      await load();
      refreshUser?.();
      return true;
    } catch (err) {
      toast.error(apiError(err));
      return false;
    } finally {
      setBusy(null);
    }
  };

  if (!stats || !catalog) return <Page title="Mining" subtitle="Run a rig, earn every second." icon={Cpu}><Loading /></Page>;
  const cur = stats.currency;

  return (
    <Page title="Mining" subtitle="Run a rig, earn every second, claim to your balance." icon={Cpu}>
      <Rig
        stats={stats}
        now={now}
        busy={busy}
        onStart={() => act('start', () => miningApi.start(poolId), (r) => `Mining started on ${r.session?.pool || 'your pool'}`)}
        onStop={() => act('stop', () => miningApi.stop(), (r) => r.message)}
        onClaim={() => act('claim', () => miningApi.claim(), (r) => `${formatMoney(r.amount, cur)} added to your balance`)}
      />

      <div className="grid grid-cols-3 gap-3 mt-4 mb-5">
        <div className="rounded-xl bg-[#1D1D1F] border border-neutral-800 px-3 py-2.5"><p className="text-[10px] text-neutral-500">Earned today</p><p className="text-sm font-semibold tabular-nums">{formatMoney(stats.earningsToday, cur)}</p></div>
        <div className="rounded-xl bg-[#1D1D1F] border border-neutral-800 px-3 py-2.5"><p className="text-[10px] text-neutral-500">All time</p><p className="text-sm font-semibold tabular-nums">{formatMoney(stats.totalEarnings, cur)}</p></div>
        <div className="rounded-xl bg-[#1D1D1F] border border-neutral-800 px-3 py-2.5"><p className="text-[10px] text-neutral-500">Run time</p><p className="text-sm font-semibold tabular-nums">{hm(stats.activeTime)}</p></div>
      </div>

      <Tabs value={tab} onChange={setTab} how={[['Rent a machine', 'Pick a rig in Machines and start it.'], ['Boost it', 'Boosters raise its output for a while.'], ['Join a pool', 'Pools share mining power for steadier payouts.'], ['Get paid', 'Output is added to your balance. See History.']]} tabs={[
        { value: 'machines', label: 'Machines' }, { value: 'boosters', label: 'Boosters' }, { value: 'pools', label: 'Pools' }, { value: 'history', label: 'History' }
      ]} />

      {tab === 'machines' && (
        <div className="space-y-4">
          {equipment.length > 0 && (
            <Panel title="Your rig">
              <ul className="divide-y divide-neutral-800">
                {equipment.map((e, i) => (
                  <li key={e.id} {...stagger(i)} className={`${stagger(i).className} flex items-center gap-3 py-2.5`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${e.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
                      <Server className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{e.name}</p>
                      <p className="text-[10px] text-neutral-500">{e.hashRate} MH/s · {formatMoney(e.dailyEarnings, cur)}/day</p>
                    </div>
                    <button type="button" disabled={!!busy || mining} title={mining ? 'Stop mining to change machines' : ''}
                      onClick={() => act(`m-${e.id}`, () => miningApi.toggleMachine(e.id, e.status !== 'active'), e.status === 'active' ? 'Machine paused' : 'Machine activated')}
                      className={`relative w-10 h-6 rounded-full transition disabled:opacity-40 ${e.status === 'active' ? 'bg-emerald-500' : 'bg-neutral-700'}`} aria-label={e.status === 'active' ? 'Pause machine' : 'Activate machine'}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${e.status === 'active' ? 'left-[18px]' : 'left-0.5'}`} />
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          <Panel title="Shop">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catalog.equipment.map((m, i) => (
                <div key={m.id} {...stagger(i)} className={`${stagger(i).className} rounded-xl bg-neutral-900 border border-neutral-800 p-3`}>
                  <div className="flex items-center gap-2">
                    <Badge tone="info">{m.type}</Badge>
                    <p className="text-sm font-semibold truncate">{m.name}</p>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <p className="text-[10px] text-neutral-500">Earns about</p>
                      <p className="text-sm font-semibold text-emerald-400">{formatMoney(m.dailyEarnings, cur)}<span className="text-[10px] text-neutral-500 font-normal"> /day</span></p>
                      <p className="text-[10px] text-neutral-500">{m.hashRate} MH/s · {m.powerConsumption} W</p>
                    </div>
                    <div className="text-right">
                      <Button className="h-8 px-3" busy={busy === `buy-${m.id}`} disabled={!!busy || catalog.balance < m.price}
                        onClick={() => act(`buy-${m.id}`, () => miningApi.buy(m.id), `${m.name} added to your rig`)}>{formatMoney(m.price, cur)}</Button>
                      {catalog.balance < m.price && <p className="text-[10px] text-amber-400 mt-1">Not enough balance</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500 mt-3">Earnings are estimates per day of active mining, after the pool fee. Sessions run up to {catalog.maxSessionHours} hours.</p>
          </Panel>
        </div>
      )}

      {tab === 'boosters' && (
        <Panel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {catalog.boosters.map((b, i) => {
              const running = (boosters.activeBoosters || []).find((x) => x.type === b.type);
              const active = running && running.name === b.name ? running : null;
              const blockedBy = running && !active ? running : null;
              const left = running ? Math.max(0, new Date(running.expiresAt).getTime() - now) / 1000 : 0;
              const Icon = b.type === 'rewards' ? Gift : b.type === 'energy' ? Waves : Rocket;
              return (
                <div key={b.id} {...stagger(i)} className={`${stagger(i).className} rounded-xl bg-neutral-900 border ${active ? 'border-emerald-500/40' : 'border-neutral-800'} p-3`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}><Icon className="w-4 h-4" /></div>
                  <p className="text-sm font-semibold mt-2">{b.name}</p>
                  <p className="text-[11px] text-neutral-400">{b.description}</p>
                  {active
                    ? <p className="mt-3 text-xs text-emerald-400 flex items-center gap-1 tabular-nums"><Zap className="w-3 h-3" />Active · {hm(left)} left</p>
                    : blockedBy
                      ? <p className="mt-3 text-[11px] text-neutral-400 tabular-nums">{blockedBy.name} is running · available in {hm(left)}</p>
                      : <Button className="mt-3 w-full h-8" busy={busy === `boost-${b.id}`} disabled={!!busy} onClick={() => act(`boost-${b.id}`, () => miningApi.boost(b.id), `${b.name} activated`)}>{formatMoney(b.price, cur)}</Button>}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-neutral-500 mt-3">Boosters only add earnings while a mining session is running.</p>
        </Panel>
      )}

      {tab === 'pools' && (
        <Panel>
          {!pools.length ? <Empty icon={Waves} title="No pools available" text="Mining pools will show here once they are set up." /> : (
          <ul className="space-y-2">
            {pools.map((p, i) => (
              <li key={p.id} {...stagger(i)}>
                <button type="button" disabled={!!busy} onClick={() => poolId !== p.id && act(`pool-${p.id}`, () => miningApi.switchPool(p.id), (r) => r.message).then((ok) => ok && setPoolId(p.id))}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition disabled:cursor-wait ${poolId === p.id ? 'bg-blue-600/10 ring-1 ring-blue-500/40' : 'bg-neutral-900 hover:bg-neutral-800'}`}>
                  <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-[10px] font-semibold">{p.coin}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-[10px] text-neutral-500">{p.algorithm} · {placeName(p.location)} · {p.fee}% fee</p>
                  </div>
                  {busy === `pool-${p.id}` ? <Loader2 className="w-4 h-4 text-blue-400 animate-spin" /> : poolId === p.id && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              </li>
            ))}
          </ul>
          )}
          <p className="text-[10px] text-neutral-500 mt-3">A new pool applies from your next session.</p>
        </Panel>
      )}

      {tab === 'history' && (
        <Panel>
          {history === null ? <Loading /> : !history.length ? <Empty icon={HistoryIcon} title="No sessions yet" /> : (
            <ul className="divide-y divide-neutral-800">
              {history.map((h, i) => (
                <li key={h.id} {...stagger(i)} className={`${stagger(i).className} flex justify-between gap-2 py-2.5 text-sm`}>
                  <div>
                    <p className="font-medium">{h.pool}</p>
                    <p className="text-[10px] text-neutral-500">{formatDate(h.startedAt)} · {hm(h.duration)} · {h.equipmentCount} machine{h.equipmentCount === 1 ? '' : 's'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-400 tabular-nums">+{formatMoney(h.earnings, h.currency || cur)}</p>
                    <Badge tone={h.status === 'active' ? 'success' : 'neutral'}>{h.status === 'active' ? 'Running' : 'Finished'}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}
    </Page>
  );
}
