import { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Plus, Clock, Snowflake, ArrowDownToLine } from 'lucide-react';
import { coldStorageApi } from '../../api/products';
import {
  Page, Panel, Stat, Button, Badge, Modal, Field, inputClass, AmountModal,
  Loading, ErrorState, Empty, useLoader, useAction, formatMoney, formatDate
} from './ui';

const statusBadge = (v) => {
  if (v.adminHold) return <Badge tone="danger">On hold</Badge>;
  if (v.status === 'unlock_requested') return <Badge tone="warning">Unlocking</Badge>;
  if (v.lockType === 'time_locked' && v.lockedUntil && new Date(v.lockedUntil) > new Date()) return <Badge tone="info">Time-locked</Badge>;
  return <Badge tone="success">Secured</Badge>;
};

function CreateVaultModal({ open, onClose, config, currency, balance, onCreated }) {
  const { busy, run } = useAction();
  const [form, setForm] = useState({ name: '', asset: 'USD', lockType: 'flexible', lockDays: 30, amount: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    const res = await run(() => coldStorageApi.create({
      ...form,
      lockDays: Number(form.lockDays),
      amount: form.amount === '' ? undefined : Number(form.amount)
    }), 'Vault created');
    if (res) { onCreated(); onClose(); }
  };

  return (
    <Modal
      open={open}
      title="New cold-storage vault"
      onClose={onClose}
      footer={(<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={busy} onClick={submit}>Create vault</Button></>)}
    >
      <Field label="Vault name"><input className={inputClass} maxLength={60} value={form.name} onChange={set('name')} placeholder="Long-term savings" /></Field>
      <Field label="Asset label">
        <select className={inputClass} value={form.asset} onChange={set('asset')}>
          {(config?.assets || ['USD']).map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </Field>
      <Field label="Lock type" hint="Time-locked vaults cannot be unlocked at all until the lock ends.">
        <select className={inputClass} value={form.lockType} onChange={set('lockType')}>
          <option value="flexible">Flexible (unlock with {config?.unlockDelayHours ?? 48}h security delay)</option>
          <option value="time_locked">Time-locked</option>
        </select>
      </Field>
      {form.lockType === 'time_locked' && (
        <Field label="Lock period (days)">
          <input type="number" min="1" max="3650" className={inputClass} value={form.lockDays} onChange={set('lockDays')} />
        </Field>
      )}
      <Field label={`Initial deposit (${currency}) — optional`} hint={`Available: ${formatMoney(balance, currency)} · Minimum ${formatMoney(config?.minDeposit, currency)}`}>
        <input type="number" min="0" step="any" className={inputClass} value={form.amount} onChange={set('amount')} />
      </Field>
    </Modal>
  );
}

export default function ColdStorage() {
  const { data, loading, error, reload } = useLoader(() => coldStorageApi.list());
  const { busy, run } = useAction();
  const [createOpen, setCreateOpen] = useState(false);
  const [modal, setModal] = useState(null); // { kind: 'deposit'|'unlock', vault }

  if (loading && !data) return <Page title="Cold Storage" icon={Snowflake}><Loading /></Page>;
  if (error && !data) return <Page title="Cold Storage" icon={Snowflake}><ErrorState message={error} onRetry={reload} /></Page>;

  const { vaults, totalSecured, availableBalance, currency, config } = data;
  const act = async (fn, msg) => { const r = await run(fn, msg); if (r !== undefined) { setModal(null); reload(); } };

  return (
    <Page
      title="Cold Storage"
      subtitle="Move funds out of your spendable balance. Withdrawals from a vault go through a security delay."
      icon={Snowflake}
      actions={<Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" />New vault</Button>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Secured in vaults" value={formatMoney(totalSecured, currency)} />
        <Stat label="Spendable balance" value={formatMoney(availableBalance, currency)} />
        <Stat label="Unlock security delay" value={`${config.unlockDelayHours} hours`} hint="Gives you time to react if your account is compromised" />
      </div>

      {vaults.length === 0 ? (
        <Panel>
          <Empty
            icon={ShieldCheck}
            title="No vaults yet"
            text="Create a vault to keep savings away from day-to-day activity. Funds can only leave a vault after a delay you are notified about."
            action={<Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" />Create your first vault</Button>}
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaults.map((v) => {
            const unlocking = v.status === 'unlock_requested';
            const ready = unlocking && new Date(v.unlockAvailableAt) <= new Date();
            const timeLocked = v.lockType === 'time_locked' && v.lockedUntil && new Date(v.lockedUntil) > new Date();
            return (
              <Panel key={v._id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-neutral-400">{v.asset} vault</p>
                    <h3 className="text-base font-semibold">{v.name}</h3>
                  </div>
                  {statusBadge(v)}
                </div>
                <p className="text-xl font-semibold mt-3">{formatMoney(v.amount, v.currency)}</p>
                <div className="text-xs text-neutral-400 mt-2 space-y-1">
                  {timeLocked && <p className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" />Locked until {formatDate(v.lockedUntil)}</p>}
                  {unlocking && (
                    <p className="flex items-center gap-1 text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      {formatMoney(v.unlockAmount, v.currency)} {ready ? 'ready to release' : `available ${new Date(v.unlockAvailableAt).toLocaleString()}`}
                    </p>
                  )}
                  {v.adminHold && <p className="text-red-300">This vault is on hold. Contact support.</p>}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="secondary" onClick={() => setModal({ kind: 'deposit', vault: v })}><ArrowDownToLine className="w-4 h-4" />Deposit</Button>
                  {!unlocking && !timeLocked && v.amount > 0 && !v.adminHold && (
                    <Button variant="secondary" onClick={() => setModal({ kind: 'unlock', vault: v })}><Unlock className="w-4 h-4" />Unlock</Button>
                  )}
                  {unlocking && ready && !v.adminHold && (
                    <Button busy={busy} onClick={() => act(() => coldStorageApi.release(v._id), 'Funds released to your balance')}>Release funds</Button>
                  )}
                  {unlocking && (
                    <Button variant="ghost" busy={busy} onClick={() => act(() => coldStorageApi.cancelUnlock(v._id), 'Unlock cancelled')}>Cancel unlock</Button>
                  )}
                  {v.amount === 0 && !unlocking && (
                    <Button variant="ghost" busy={busy} onClick={() => act(() => coldStorageApi.close(v._id), 'Vault closed')}>Close vault</Button>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      <CreateVaultModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        config={config}
        currency={currency}
        balance={availableBalance}
        onCreated={reload}
      />
      <AmountModal
        open={modal?.kind === 'deposit'}
        title={`Deposit to ${modal?.vault?.name || 'vault'}`}
        currency={currency}
        max={availableBalance}
        hint={`Minimum ${formatMoney(config.minDeposit, currency)}`}
        busy={busy}
        onClose={() => setModal(null)}
        onSubmit={(amount) => act(() => coldStorageApi.deposit(modal.vault._id, amount), 'Funds secured')}
      />
      <AmountModal
        open={modal?.kind === 'unlock'}
        title={`Unlock from ${modal?.vault?.name || 'vault'}`}
        currency={currency}
        max={modal?.vault?.amount}
        hint={`Funds become available after a ${config.unlockDelayHours}-hour security delay.`}
        confirmLabel="Request unlock"
        busy={busy}
        onClose={() => setModal(null)}
        onSubmit={(amount) => act(() => coldStorageApi.unlock(modal.vault._id, amount), 'Unlock requested')}
      />
    </Page>
  );
}
