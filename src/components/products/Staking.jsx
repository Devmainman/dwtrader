// Stake: two tabs — Pools and Your history.
import { useEffect, useState } from 'react';
import { Layers, Lock, Clock } from 'lucide-react';
import { stakingApi } from '../../api/products';
import {
  Page, Panel, Button, Badge, Modal, Field, Tabs, inputClass,
  Loading, ErrorState, Empty, Progress, useLoader, useAction, formatMoney, formatDate, formatNumber
} from './ui';

const CYCLE_LABEL = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

const units = (n) => formatNumber(n, 8);

/** Circle with the asset ticker, or the pool icon if one is set. */
function AssetIcon({ pool, size = 48 }) {
  const [bad, setBad] = useState(false);
  const src = pool.icon || `https://assets.coincap.io/assets/icons/${String(pool.asset).toLowerCase()}@2x.png`;
  if (!bad) return <img src={src} alt="" onError={() => setBad(true)} style={{ width: size, height: size }} className="rounded-full bg-white/[.06] object-contain" />;
  return (
    <div style={{ width: size, height: size }} className="rounded-full flex items-center justify-center text-xs font-semibold text-white bg-[linear-gradient(135deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]">
      {pool.asset.slice(0, 4)}
    </div>
  );
}

function StakeModal({ pool, currency, balance, onClose, onDone }) {
  const { busy, run } = useAction();
  const [amount, setAmount] = useState('');
  useEffect(() => setAmount(''), [pool?._id]);
  if (!pool) return null;

  const n = Number(amount);
  const cost = pool.localPrice ? n * pool.localPrice : 0;
  const perCycle = n * (pool.cycleRatePercent / 100);
  const maxAffordable = pool.localPrice ? Math.floor((balance / pool.localPrice) * 1e6) / 1e6 : 0;
  const error = amount === '' ? ''
    : n < pool.minAmount ? `Minimum is ${pool.minAmount} ${pool.asset}`
      : n > pool.maxAmount ? `Maximum is ${pool.maxAmount} ${pool.asset}`
        : cost > balance ? 'Not enough balance' : '';

  const submit = async () => {
    if (await run(() => stakingApi.stake(pool._id, n), `Staked ${n} ${pool.asset}`)) { onDone(); onClose(); }
  };

  return (
    <Modal
      open
      title={`Stake ${pool.asset}`}
      onClose={onClose}
      footer={(<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={busy} disabled={!n || !!error || !pool.localPrice} onClick={submit}>Stake</Button></>)}
    >
      <div className="flex items-center gap-3 mb-4">
        <AssetIcon pool={pool} size={40} />
        <div>
          <p className="font-semibold">{pool.name}</p>
          <p className="text-xs text-neutral-400">{pool.localPrice ? `1 ${pool.asset} ≈ ${formatMoney(pool.localPrice, currency)}` : 'Price unavailable'}</p>
        </div>
      </div>
      <Field label={`Amount (${pool.asset})`} hint={`Minimum ${pool.minAmount} · Maximum ${pool.maxAmount} ${pool.asset}`}>
        <div className="flex gap-2">
          <input type="number" min={pool.minAmount} max={pool.maxAmount} step="any" autoFocus className={inputClass} value={amount} placeholder={String(pool.minAmount)} onChange={(e) => setAmount(e.target.value)} />
          <Button variant="secondary" onClick={() => setAmount(String(Math.min(pool.maxAmount, maxAffordable)))}>Max</Button>
        </div>
        {error && <span className="block text-xs text-red-300 mt-1">{error}</span>}
      </Field>
      <dl className="text-sm space-y-1.5 bg-neutral-900 rounded-lg p-3">
        <div className="flex justify-between"><dt className="text-neutral-400">Cost</dt><dd>{formatMoney(cost, currency)}</dd></div>
        <div className="flex justify-between"><dt className="text-neutral-400">Reward per cycle ({CYCLE_LABEL[pool.cycle].toLowerCase()})</dt><dd>{units(perCycle)} {pool.asset}</dd></div>
        <div className="flex justify-between"><dt className="text-neutral-400">Yearly rate</dt><dd>{pool.apy}%</dd></div>
        <div className="flex justify-between"><dt className="text-neutral-400">Lock</dt><dd>{pool.lockDays ? `${pool.lockDays} days` : 'None, unstake any time'}</dd></div>
        <div className="flex justify-between"><dt className="text-neutral-400">Your balance</dt><dd>{formatMoney(balance, currency)}</dd></div>
      </dl>
      <p className="text-xs text-neutral-500 mt-3">
        Rewards are earned in {pool.asset} after each completed cycle. Your stake and rewards are valued at the {pool.asset} price when you claim or unstake, so their value can go up or down.
        {pool.lockDays > 0 && (pool.allowEarlyUnstake ? ` Leaving before ${pool.lockDays} days forfeits rewards and costs ${pool.earlyUnstakePenaltyPercent}% of the stake.` : ' The stake cannot be withdrawn before the lock ends.')}
      </p>
    </Modal>
  );
}

function PoolCard({ pool, currency, onStake }) {
  const full = pool.remainingCapacity !== null && pool.remainingCapacity <= 0;
  return (
    <Panel className="flex flex-col transition hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <AssetIcon pool={pool} size={44} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-tight">{pool.asset}</p>
          <p className="text-[11px] text-neutral-500 truncate">{pool.name}</p>
        </div>
        <div className="text-right">
          <p className="text-[24px] font-light tracking-[-0.03em] tabular-nums leading-none text-emerald-400">{pool.apy}%</p>
          <p className="text-[10px] text-neutral-500 mt-1">APY</p>
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-2 mt-4">
        {[['Minimum', `${formatNumber(pool.minAmount, 8)} ${pool.asset}`], ['Maximum', `${formatNumber(pool.maxAmount, 8)} ${pool.asset}`], ['Rewards', CYCLE_LABEL[pool.cycle]]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/[.03] border border-white/[.06] px-2.5 py-2 min-w-0"><dt className="text-[10px] text-neutral-500">{k}</dt><dd className="text-[12px] font-semibold mt-0.5 truncate">{v}</dd></div>
        ))}
      </dl>
      <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-3">
        <span>{pool.localPrice ? `1 ${pool.asset} ≈ ${formatMoney(pool.localPrice, currency)}` : 'Price unavailable'}</span>
        {pool.lockDays > 0 ? <span className="flex items-center gap-1"><Lock className="w-3 h-3" />{pool.lockDays}-day lock</span> : <span className="text-emerald-400">Flexible</span>}
      </div>
      <Button className="w-full h-11 mt-4 !text-[13px]" disabled={full || !pool.localPrice} onClick={() => onStake(pool)}>{full ? 'Pool full' : `Stake ${pool.asset}`}</Button>
    </Panel>
  );
}

function HistoryItem({ p, currency, onChanged }) {
  const { busy, run } = useAction();
  const active = p.status === 'active';
  const locked = active && p.lockDays > 0 && !p.matured;
  const act = async (fn, msg) => { if (await run(fn, msg)) onChanged(); };
  return (
    <li className="py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">
            {units(p.assetAmount)} {p.asset} <span className="text-neutral-400 font-normal">· {p.assetName || p.plan?.name} · {p.apy}% APY · {CYCLE_LABEL[p.cycle]}</span>
          </p>
          {active ? (
            <>
              <p className="text-sm text-neutral-400">
                Worth {formatMoney(p.currentValue, currency)} · <span className="text-emerald-400">+{units(p.unclaimedRewards)} {p.asset}</span> rewards ready
              </p>
              <p className="text-xs text-neutral-500">
                Staked {formatDate(p.startAt)} for {formatMoney(p.amount, p.currency)} · {p.cycles} cycle{p.cycles === 1 ? '' : 's'} completed
                {p.endAt && <> · unlocks {formatDate(p.endAt)}</>}
              </p>
              {p.nextRewardAt && (
                <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />Next reward {new Date(p.nextRewardAt).toLocaleString()}</p>
              )}
            </>
          ) : (
            <p className="text-xs text-neutral-500">
              {formatDate(p.startAt)} – {formatDate(p.closedAt)} · paid {formatMoney(p.amount, p.currency)}, returned {formatMoney(p.payout, p.currency)}
              {p.claimedValue > 0 ? ` + ${formatMoney(p.claimedValue, p.currency)} rewards` : ''}
              {p.penalty > 0 ? ` · penalty ${units(p.penalty)} ${p.asset}` : ''}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {active ? (
            <>
              {!locked && p.unclaimedRewards > 0 && (
                <Button variant="secondary" busy={busy} onClick={() => act(() => stakingApi.claim(p._id), 'Rewards claimed')}>Claim</Button>
              )}
              <Button
                variant={locked ? 'ghost' : 'primary'}
                busy={busy}
                onClick={() => {
                  if (locked && !window.confirm('Unstaking early forfeits your rewards and may charge a penalty. Continue?')) return;
                  act(() => stakingApi.unstake(p._id), 'Unstaked');
                }}
              >
                {locked ? 'Unstake early' : 'Unstake'}
              </Button>
            </>
          ) : (
            <Badge tone={p.status === 'completed' ? 'success' : 'warning'}>{p.status === 'completed' ? 'Completed' : 'Ended early'}</Badge>
          )}
        </div>
      </div>
      {active && p.endAt && <div className="mt-3"><Progress value={p.progressPercent} /></div>}
    </li>
  );
}

export default function Staking() {
  const [tab, setTab] = useState('pools');
  const pools = useLoader(() => stakingApi.pools(), []);
  const history = useLoader(() => stakingApi.history(), [tab]);
  const [stakePool, setStakePool] = useState(null);
  const currency = pools.data?.currency || history.data?.currency || 'USD';
  const activeCount = history.data?.totals?.activeStakes || 0;

  return (
    <Page title="Stake" subtitle="Stake crypto and earn rewards every cycle." icon={Layers}>
      <Tabs value={tab} onChange={setTab} how={[['Pick a pool', 'Each coin shows its rate and lock term.'], ['Stake an amount', 'The coins stay locked for the term.'], ['Earn every day', 'Rewards build up daily while staked.'], ['Get it back', 'At the end of the term your stake and rewards return to your balance.']]} tabs={[{ value: 'pools', label: 'Pools' }, { value: 'history', label: activeCount ? `Your history (${activeCount} active)` : 'Your history' }]} />

      {tab === 'pools' && history.data?.positions?.length > 0 && (
        <button type="button" data-no-busy onClick={() => setTab('history')} className="dash-panel w-full p-4 mb-4 grid grid-cols-3 gap-2 text-left hover:-translate-y-0.5 transition">
          <div><p className="text-[10px] text-neutral-500">Staked</p><p className="text-[15px] font-medium tabular-nums">{formatMoney(history.data.totals.stakedValue, currency)}</p></div>
          <div><p className="text-[10px] text-neutral-500">Rewards ready</p><p className="text-[15px] font-medium tabular-nums text-emerald-400">{formatMoney(history.data.totals.unclaimedValue, currency)}</p></div>
          <div><p className="text-[10px] text-neutral-500">Paid out</p><p className="text-[15px] font-medium tabular-nums">{formatMoney(history.data.totals.rewardsPaid, currency)}</p></div>
        </button>
      )}
      {tab === 'pools' && (pools.loading && !pools.data ? <Loading /> : pools.error ? <ErrorState message={pools.error} onRetry={pools.reload} /> : (
        pools.data.pools.length === 0 ? <Panel><Empty icon={Layers} title="No pools available" text="Check back soon." /></Panel> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pools.data.pools.map((p) => <PoolCard key={p._id} pool={p} currency={currency} onStake={setStakePool} />)}
          </div>
        )
      ))}

      {tab === 'history' && (
        <Panel>
          {history.loading && !history.data ? <Loading /> : history.error ? <ErrorState message={history.error} onRetry={history.reload} /> : (
            history.data.positions.length === 0 ? (
              <Empty icon={Layers} title="You haven't staked yet" action={<Button onClick={() => setTab('pools')}>View pools</Button>} />
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[['Staked value', formatMoney(history.data.totals.stakedValue, currency), ''], ['Rewards ready', formatMoney(history.data.totals.unclaimedValue, currency), 'text-emerald-400'], ['Rewards paid', formatMoney(history.data.totals.rewardsPaid, currency), '']].map(([k, v, t]) => (
                    <div key={k} className="rounded-2xl bg-white/[.03] border border-white/[.06] px-3 py-2"><p className="text-[10px] text-neutral-500">{k}</p><p className={`text-[13px] font-semibold tabular-nums ${t}`}>{v}</p></div>
                  ))}
                </div>
                <ul className="divide-y divide-white/[.06]">
                  {history.data.positions.map((p) => <HistoryItem key={p._id} p={p} currency={currency} onChanged={() => { history.reload(); pools.reload(); }} />)}
                </ul>
              </>
            )
          )}
        </Panel>
      )}

      {stakePool && (
        <StakeModal
          pool={stakePool}
          currency={currency}
          balance={pools.data?.availableBalance || 0}
          onClose={() => setStakePool(null)}
          onDone={() => { pools.reload(); history.reload(); setTab('history'); }}
        />
      )}
    </Page>
  );
}
