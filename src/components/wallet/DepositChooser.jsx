// /deposite — choose how to deposit. "Bank & payment methods" is the existing dynamic
// flow (funds the fiat balance, unchanged); "Crypto" credits the coin's own wallet.
// When crypto deposits are off, or ?method=fiat, the existing flow shows directly.
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Landmark, Bitcoin, ChevronRight } from 'lucide-react';
import PaymentSystem from '../Deposite/payment/PaymentSystem';
import { cryptoApi } from '../../api/products';
import { CoinIcon } from './shared';

export default function DepositChooser() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [opts, setOpts] = useState(undefined);
  const fiatOnly = params.get('method') === 'fiat';
  useEffect(() => { if (!fiatOnly) cryptoApi.depositOptions().then(setOpts).catch(() => setOpts(null)); }, [fiatOnly]);

  if (fiatOnly || opts === null || (opts && (!opts.enabled || !opts.assets.length))) return <PaymentSystem />;

  const coins = opts?.assets || [];
  return (
    <div className="w-full max-w-[560px] mx-auto px-4 sm:px-5 py-4 pb-35 lg:pb-10 text-zinc-100">
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:text-zinc-100" aria-label="Back"><ArrowLeft className="w-4 h-4" /></button>
        <div><p className="text-base font-semibold">Deposit</p><p className="text-[11px] text-neutral-500">Choose how you want to add money</p></div>
      </div>
      {opts === undefined ? (
        <div className="space-y-3"><div className="h-24 rounded-3xl skeleton" /><div className="h-24 rounded-3xl skeleton" /></div>
      ) : (
        <div className="space-y-3 ui-stagger">
          <button type="button" onClick={() => navigate('/deposite?method=fiat')} className="ui-card w-full p-4 flex items-center gap-4 text-left hover:-translate-y-0.5 transition">
            <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0"><Landmark className="w-5 h-5" /></span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold">Bank & payment methods</span>
              <span className="block text-[11px] text-neutral-500 mt-0.5">Added to your {opts.currency || 'fiat'} balance once confirmed</span>
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
          <button type="button" onClick={() => navigate('/deposit/crypto')} className="ui-card w-full p-4 flex items-center gap-4 text-left hover:-translate-y-0.5 transition">
            <span className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0"><Bitcoin className="w-5 h-5" /></span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold">Crypto</span>
              <span className="block text-[11px] text-neutral-500 mt-0.5">{coins.length} coins · credited to that coin&apos;s wallet</span>
              <span className="flex -space-x-1.5 mt-2">{coins.slice(0, 6).map((a) => <CoinIcon key={a.symbol} symbol={a.symbol} icon={a.icon} size={20} />)}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
      )}
    </div>
  );
}
