// "Copy this trader" dialog, shared by the Top Experts list and the trader page.
import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { copyTradingApi } from '../../api/products';
import { Button, Modal, Field, inputClass, useAction, formatMoney } from '../products/ui';
import { Avatar, TraderName, compact } from './shared';

export default function CopyModal({ trader, currency, balance, onClose, onCopied }) {
  const { busy, run } = useAction();
  const [amount, setAmount] = useState('');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [copyOpen, setCopyOpen] = useState(true);
  useEffect(() => { setAmount(''); setSl(''); setTp(''); setCopyOpen(true); }, [trader?.traderId]);
  if (!trader) return null;

  const min = trader.minCopyAmount || 0;
  const n = Number(amount);
  const belowMin = amount !== '' && n < min;
  const overBalance = n > balance;
  const invalid = !(n > 0) || belowMin || overBalance;

  const submit = async () => {
    const res = await run(() => copyTradingApi.copy(trader.traderId, n, {
      stopLossPercent: sl === '' ? null : Number(sl),
      takeProfitPercent: tp === '' ? null : Number(tp),
      copyOpenTrades: copyOpen
    }), `You're now copying ${trader.username}`);
    if (res) { onCopied?.(); onClose(); }
  };

  return (
    <Modal
      open
      title={`Copy ${trader.username}`}
      onClose={onClose}
      footer={(<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={busy} disabled={invalid} onClick={submit}>Start copying</Button></>)}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar src={trader.avatar} name={trader.username} badge={trader.badge} />
        <div className="min-w-0"><TraderName trader={trader} /><p className="text-xs text-neutral-400">{compact(trader.followers)} followers · {trader.copiers} {trader.copiers === 1 ? "copier" : "copiers"}</p></div>
      </div>

      <div className="rounded-xl border border-[var(--color-blue-700)]/30 bg-[var(--color-blue-700)]/10 px-3 py-2 mb-4 text-sm flex justify-between">
        <span className="text-neutral-300">Minimum to copy</span>
        <span className="font-semibold">{formatMoney(min, currency)}</span>
      </div>

      <Field label={`Amount to allocate (${currency})`} hint={`Available ${formatMoney(balance, currency)}`}>
        <div className="flex gap-2">
          <input type="number" min={min} step="any" autoFocus className={inputClass} value={amount} placeholder={String(min)} onChange={(e) => setAmount(e.target.value)} />
          <Button variant="secondary" onClick={() => setAmount(String(balance))}>Max</Button>
        </div>
        {belowMin && <span className="block text-xs text-red-300 mt-1">You need at least {formatMoney(min, currency)} to copy {trader.username}.</span>}
        {overBalance && <span className="block text-xs text-red-300 mt-1">That's more than your available balance.</span>}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Stop loss (%)" hint="Auto-stop if your copy falls this much">
          <input type="number" min="1" max="100" placeholder="Off" className={inputClass} value={sl} onChange={(e) => setSl(e.target.value)} />
        </Field>
        <Field label="Take profit (%)" hint="Auto-stop when your copy gains this much">
          <input type="number" min="1" max="1000" placeholder="Off" className={inputClass} value={tp} onChange={(e) => setTp(e.target.value)} />
        </Field>
      </div>
      <label className="flex items-start gap-3 text-sm mb-4 cursor-pointer">
        <input type="checkbox" className="mt-1 accent-[var(--color-blue-700)]" checked={copyOpen} onChange={(e) => setCopyOpen(e.target.checked)} />
        <span>
          <span className="text-white">Also copy trades that are already open</span>
          <span className="block text-xs text-neutral-400">They're joined at the current price, not the trader's entry price.</span>
        </span>
      </label>
      <div className="rounded-lg bg-neutral-900 p-3 text-xs text-neutral-400 space-y-1">
        <p className="flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />Each trade uses a share of your copy's funds, the same share the trader commits.</p>
        <p>{trader.username} takes {trader.commissionRate}% of profit on winning trades only. You can pause, add funds or stop at any time; stopping closes open positions at the current price.</p>
        <p>Past performance does not guarantee future results. You can lose money.</p>
      </div>
    </Modal>
  );
}
