// Trader Rewards: milestones the admin set up, the user's real trading profit and
// progress toward each, and the claim flow (claim -> pay the fee -> invoice reviewed -> credited).
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Check, Clock, Lock, Gift, X, Sparkles } from 'lucide-react';
import { rewardsApi } from '../../api/products';
import { Page, Panel, Button, Badge, Loading, ErrorState, Empty, useLoader, useAction, formatMoney, formatDate, Modal } from './ui';

const STAGE = {
  fee_unpaid: { tone: 'warning', label: 'Fee due' },
  review: { tone: 'info', label: 'Under review' },
  approved: { tone: 'success', label: 'Paid' },
  rejected: { tone: 'danger', label: 'Rejected' }
};

const feeUrl = (claim, fee, currency) => `/payment?mode=reward&rewardClaim=${claim.id}&amount=${encodeURIComponent(fee)}&currency=${encodeURIComponent(currency)}`;

function Bar({ value, done }) {
  return (
    <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
      <div className={`h-full rounded-full transition-[width] duration-700 ${done ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${Math.max(2, Math.min(100, value || 0))}%` }} />
    </div>
  );
}

function MilestoneCard({ m, cur, onClaim, busy, onCancel }) {
  const navigate = useNavigate();
  const claim = m.claim;
  const st = claim ? STAGE[claim.stage] : null;
  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${m.achieved ? 'border-emerald-500/30 bg-emerald-500/[.04]' : 'border-neutral-800 bg-[var(--card)]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.achieved ? 'bg-emerald-500/15 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
            {m.achieved ? <Trophy className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 truncate">{m.name}</p>
            {m.description && <p className="text-[11px] text-neutral-400">{m.description}</p>}
          </div>
        </div>
        {st ? <Badge tone={st.tone}>{st.label}</Badge> : m.achieved ? <Badge tone="success">Reached</Badge> : null}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-neutral-900/70 p-3"><p className="text-[11px] text-neutral-500">Required profit</p><p className="text-white font-medium mt-0.5">{formatMoney(m.requiredProfit, cur)}</p></div>
        <div className="rounded-xl bg-neutral-900/70 p-3"><p className="text-[11px] text-neutral-500">Reward</p><p className="text-emerald-400 font-semibold mt-0.5">{formatMoney(m.rewardAmount, cur)}</p></div>
      </div>
      {m.prize && <p className="text-[11px] text-neutral-300 flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />{m.prize}</p>}

      <div>
        <div className="flex justify-between text-[11px] mb-1.5">
          <span className="text-neutral-400">{m.achieved ? 'Milestone reached' : `${formatMoney(m.remaining, cur)} to go`}</span>
          <span className="text-zinc-200 tabular-nums">{m.progress.toFixed(m.progress < 10 ? 1 : 0)}%</span>
        </div>
        <Bar value={m.progress} done={m.achieved} />
      </div>

      {claim?.stage === 'fee_unpaid' && claim.payment?.note && <p className="text-xs text-red-400">Your last fee payment was rejected: {claim.payment.note}</p>}
      {claim?.stage === 'review' && <p className="text-xs text-neutral-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" />Invoice {claim.invoiceNumber} is being reviewed.</p>}
      {claim?.stage === 'approved' && <p className="text-xs text-emerald-400 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" />{formatMoney(claim.reward?.amount, claim.reward?.currency || cur)} added to your balance {formatDate(claim.reward?.creditedAt)}.</p>}

      {!claim && (
        <Button className="w-full" busy={busy === m.id} disabled={!m.achieved || !!busy} onClick={() => onClaim(m)}>
          {m.achieved ? <><Sparkles className="w-3.5 h-3.5" />Claim reward</> : <><Lock className="w-3.5 h-3.5" />Reach the profit to claim</>}
        </Button>
      )}
      {claim?.stage === 'fee_unpaid' && (
        <div className="flex gap-2">
          <Button className="flex-1" disabled={!!busy} onClick={() => navigate(feeUrl(claim, m.claimFee, cur))}>Pay {formatMoney(m.claimFee, cur)} fee</Button>
          <Button variant="secondary" busy={busy === `c-${claim.id}`} disabled={!!busy} onClick={() => onCancel(claim)}><X className="w-3.5 h-3.5" />Cancel</Button>
        </div>
      )}
    </div>
  );
}

export default function Rewards() {
  const navigate = useNavigate();
  const d = useLoader(() => rewardsApi.get(), []);
  const [busy, setBusy] = useState(null);
  const { run } = useAction();
  const [confirm, setConfirm] = useState(null);
  const data = d.data;

  // Progress follows the user's trading: refresh every 30 seconds while the page is open.
  useEffect(() => {
    const t = setInterval(() => document.visibilityState === 'visible' && d.reload(), 30000);
    return () => clearInterval(t);
  }, [d.reload]);

  const claim = async (m) => {
    setBusy(m.id);
    const r = await run(() => rewardsApi.claim(m.id), m.claimFee > 0 ? `Reward claimed. Pay the ${formatMoney(m.claimFee, data.currency)} fee to submit it.` : 'Reward claimed. It is credited once approved.');
    setBusy(null);
    setConfirm(null);
    if (r?.stage === 'fee_unpaid') navigate(feeUrl(r, m.claimFee, data.currency));
    else d.reload();
  };
  const cancel = async (c) => {
    setBusy(`c-${c.id}`);
    await run(() => rewardsApi.cancel(c.id), 'Claim cancelled');
    setBusy(null);
    d.reload();
  };

  return (
    <Page title={data?.title || 'Rewards'} subtitle="Earn rewards when your trading profit reaches each milestone" icon={Trophy}>
      {d.error ? <ErrorState message={d.error} onRetry={d.reload} />
        : !data ? <Loading />
          : !data.enabled ? (
            <Empty icon={Trophy} title="Reward Program Currently Unavailable." text="Please check back later." />
          ) : (
            <div className="space-y-4">
              {data.description && <p className="text-xs text-neutral-400">{data.description}</p>}
              <Panel>
                <p className="text-xs text-neutral-400">Your trading profit</p>
                <p className="text-2xl font-semibold text-white mt-1 tabular-nums">{formatMoney(data.profit.total, data.currency)}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-neutral-500">
                  {data.profit.breakdown.filter((b) => b.amount !== 0).map((b) => (
                    <span key={b.source}>{b.label}: <span className={b.amount >= 0 ? 'text-zinc-300' : 'text-red-400'}>{formatMoney(b.amount, data.currency)}</span></span>
                  ))}
                  {!data.profit.breakdown.some((b) => b.amount !== 0) && <span>Profit from your closed trades and investment payouts counts here.</span>}
                </div>
              </Panel>
              {!data.milestones.length ? (
                <Empty icon={Trophy} title="No milestones yet" text="Rewards will appear here soon." />
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {data.milestones.map((m) => (
                    <MilestoneCard key={m.id} m={m} cur={data.currency} busy={busy} onClaim={(x) => setConfirm(x)} onCancel={cancel} />
                  ))}
                </div>
              )}
              {data.claims.some((c) => !c.milestone || !data.milestones.find((m) => m.id === c.milestone)) && (
                <Panel title="Past claims">
                  <ul className="divide-y divide-neutral-800">
                    {data.claims.filter((c) => !data.milestones.find((m) => m.claim?.id === c.id)).map((c) => (
                      <li key={c.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div><p className="text-zinc-100">{c.snapshot?.name}</p><p className="text-[11px] text-neutral-500">{formatDate(c.createdAt)}{c.note ? ` · ${c.note}` : ''}</p></div>
                        <Badge tone={STAGE[c.stage].tone}>{STAGE[c.stage].label}</Badge>
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
            </div>
          )}
      <Modal open={!!confirm} title={confirm ? `Claim ${confirm.name}` : ''} onClose={() => !busy && setConfirm(null)}
        footer={confirm && <Button className="w-full" busy={busy === confirm.id} onClick={() => claim(confirm)}>{confirm.claimFee > 0 ? `Claim and pay ${formatMoney(confirm.claimFee, data.currency)} fee` : 'Claim reward'}</Button>}>
        {confirm && (
          <div className="space-y-2 text-xs text-neutral-300">
            <p>Reward: <span className="text-emerald-400 font-semibold">{formatMoney(confirm.rewardAmount, data.currency)}</span>{confirm.prize ? ` + ${confirm.prize}` : ''}</p>
            {confirm.claimFee > 0
              ? <p>A claim fee of {formatMoney(confirm.claimFee, data.currency)} is paid through your usual payment methods. Once it is paid, your reward invoice is reviewed and the reward is added to your balance when approved.</p>
              : <p>Your reward invoice is reviewed and the reward is added to your balance when approved.</p>}
          </div>
        )}
      </Modal>
    </Page>
  );
}
