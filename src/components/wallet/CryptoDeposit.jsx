// /deposit/crypto — pick a coin the admin enabled, send to its address (QR + copy),
// then tell us the amount and the transaction hash (or a screenshot). The admin verifies
// it and the coin is credited to the user's wallet for that coin.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Copy, Check, Search, ShieldCheck, Upload, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { cryptoApi, apiError } from '../../api/products';
import { toast } from '../../lib/toast';
import { CoinIcon, Sheet, price, qty } from './shared';

function CopyField({ label, value }) {
  const [done, setDone] = useState(false);
  const copy = () => navigator.clipboard?.writeText(value).then(() => { setDone(true); toast.success(`${label} copied`); setTimeout(() => setDone(false), 1500); }, () => toast.error('Could not copy'));
  return (
    <div className="rounded-2xl bg-white/[.05] border border-white/[.08] p-3">
      <p className="text-[11px] text-neutral-500">{label}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <p className="flex-1 font-mono text-xs text-zinc-100 break-all">{value}</p>
        <button type="button" onClick={copy} className="h-8 px-3 rounded-full bg-blue-600 text-white text-xs flex items-center gap-1 shrink-0 hover:bg-blue-500 transition">{done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{done ? 'Copied' : 'Copy'}</button>
      </div>
    </div>
  );
}

export default function CryptoDeposit() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [opts, setOpts] = useState(null);
  const [error, setError] = useState('');
  const [picker, setPicker] = useState(false);
  const [q, setQ] = useState('');
  const [f, setF] = useState({ amount: '', txHash: '' });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  useEffect(() => { cryptoApi.depositOptions().then(setOpts).catch((e) => setError(apiError(e))); }, []);
  const coin = useMemo(() => (opts?.assets || []).find((a) => a.symbol === params.get('coin')) || null, [opts, params]);
  const pick = (a) => { setParams({ coin: a.symbol }); setPicker(false); setF({ amount: '', txHash: '' }); setFile(null); setFormError(''); };
  const amountNum = Number(f.amount);
  const submit = async () => {
    setFormError('');
    if (!(amountNum > 0)) return setFormError('Enter the amount you sent');
    if (coin.minDeposit && amountNum < coin.minDeposit) return setFormError(`The minimum is ${coin.minDeposit} ${coin.symbol}`);
    if (!f.txHash.trim() && !file) return setFormError('Add the transaction hash (TXID) or a screenshot of the transfer');
    const fd = new FormData();
    fd.append('symbol', coin.symbol);
    fd.append('amount', f.amount);
    if (f.txHash.trim()) fd.append('txHash', f.txHash.trim());
    if (file) fd.append('proof', file);
    setBusy(true);
    try {
      await cryptoApi.deposit(fd);
      toast.success('Deposit submitted', { description: `Your ${coin.symbol} wallet is credited once it is verified.` });
      navigate('/wallet');
    } catch (e) {
      const m = apiError(e);
      setFormError(m);
      toast.error(m);
    } finally {
      setBusy(false);
    }
  };

  const filtered = (opts?.assets || []).filter((a) => !q || `${a.name} ${a.symbol}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="w-full max-w-[560px] mx-auto px-4 sm:px-5 py-4 pb-35 lg:pb-10 text-zinc-100">
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={() => (coin ? setParams({}) : navigate(-1))} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:text-zinc-100" aria-label="Back"><ArrowLeft className="w-4 h-4" /></button>
        <div><p className="text-base font-semibold">Deposit crypto</p><p className="text-[11px] text-neutral-500">Credited to your {coin ? coin.symbol : 'coin'} wallet once verified</p></div>
      </div>

      {error ? <p className="ui-card p-4 text-xs text-red-400">{error}</p>
        : !opts ? <div className="space-y-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl skeleton" />)}</div>
          : !opts.enabled || !opts.assets.length ? (
            <div className="ui-card p-6 text-center">
              <p className="text-sm font-semibold">Crypto deposits are not available right now</p>
              <p className="text-xs text-neutral-500 mt-1">You can still deposit with the other payment methods.</p>
              <button type="button" onClick={() => navigate('/deposite?method=fiat')} className="mt-4 h-10 px-5 rounded-2xl bg-blue-600 text-white text-xs font-medium">Other deposit methods</button>
            </div>
          ) : !coin ? (
            <section className="ui-card p-3">
              <div className="relative px-1 pb-2">
                <Search className="w-3.5 h-3.5 absolute left-4 top-[18px] -translate-y-1/2 text-neutral-500" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search coin" className="w-full h-9 pl-8 pr-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <ul className="ui-stagger">
                {filtered.map((a) => (
                  <li key={a.symbol}>
                    <button type="button" onClick={() => pick(a)} className="ui-row w-full flex items-center gap-3 px-2 py-2.5 rounded-2xl text-left">
                      <CoinIcon symbol={a.symbol} icon={a.icon} size={40} />
                      <span className="flex-1 min-w-0"><span className="block text-sm font-medium truncate">{a.name}</span><span className="block text-[11px] text-neutral-500">{a.symbol} · {a.network}</span></span>
                      <span className="text-[11px] text-neutral-400 tabular-nums">{price(a.price, opts.currency)}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>
                  </li>
                ))}
                {!filtered.length && <li className="text-xs text-neutral-500 text-center py-6">No coin matches “{q}”.</li>}
              </ul>
            </section>
          ) : (
            <div className="space-y-4">
              <button type="button" onClick={() => setPicker(true)} className="ui-card w-full p-3 flex items-center gap-3 text-left">
                <CoinIcon symbol={coin.symbol} icon={coin.icon} size={40} />
                <span className="flex-1"><span className="block text-sm font-semibold">{coin.name}</span><span className="block text-[11px] text-neutral-500">Network: {coin.network || '—'}</span></span>
                <span className="text-[11px] text-blue-400">Change</span>
              </button>

              <section className="ui-card p-4">
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-2xl bg-white keep-dark shadow-[0_10px_30px_-12px_rgba(0,0,0,.5)]">
                    <QRCodeSVG value={coin.address} size={168} bgColor="#ffffff" fgColor="#111111" level="M" />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-2">Scan with your wallet app, or copy the address</p>
                </div>
                <div className="mt-4 space-y-2">
                  <CopyField label={`${coin.symbol} deposit address`} value={coin.address} />
                  {coin.memo && <CopyField label="Memo / tag (required)" value={coin.memo} />}
                </div>
                <div className="mt-3 flex gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Send only {coin.symbol} on the {coin.network || 'listed'} network to this address{coin.memo ? ', and include the memo' : ''}. Other coins or networks can be lost.{coin.minDeposit ? ` Minimum ${coin.minDeposit} ${coin.symbol}.` : ''}</span>
                </div>
              </section>

              <section className="ui-card p-4 space-y-3">
                <p className="text-sm font-semibold">After you send it</p>
                <label className="block">
                  <span className="block text-xs text-neutral-400 mb-1.5">Amount sent ({coin.symbol})</span>
                  <input inputMode="decimal" value={f.amount} onChange={(e) => setF((s) => ({ ...s, amount: e.target.value.replace(/[^\d.]/g, '') }))} placeholder="0.00"
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-zinc-100 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                  {amountNum > 0 && coin.price && <span className="block text-[11px] text-neutral-500 mt-1">≈ {price(amountNum * coin.price, opts.currency)} at today&apos;s price</span>}
                </label>
                <label className="block">
                  <span className="block text-xs text-neutral-400 mb-1.5">Transaction hash (TXID)</span>
                  <input value={f.txHash} onChange={(e) => setF((s) => ({ ...s, txHash: e.target.value.trim() }))} placeholder="Paste it from your wallet"
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-dashed border-white/15 p-3 cursor-pointer hover:bg-white/[.03] transition">
                  <Upload className="w-4 h-4 text-neutral-400" />
                  <span className="flex-1 text-xs text-neutral-300 truncate">{file ? file.name : 'Or add a screenshot of the transfer (optional)'}</span>
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
                {formError && <p className="text-xs text-red-400">{formError}</p>}
                <button type="button" onClick={submit} disabled={busy} className="w-full h-11 rounded-2xl bg-blue-600 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-500 disabled:opacity-60 transition">
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />}I&apos;ve sent {qty(amountNum) !== '0' ? `${qty(amountNum)} ` : ''}{coin.symbol}
                </button>
                <p className="text-[11px] text-neutral-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />We check the transfer on the blockchain before crediting your {coin.symbol} wallet. Each transaction can be credited only once.</p>
              </section>
            </div>
          )}

      {picker && (
        <Sheet title="Choose a coin" onClose={() => setPicker(false)}>
          <ul>
            {(opts?.assets || []).map((a) => (
              <li key={a.symbol}>
                <button type="button" onClick={() => pick(a)} className="ui-row w-full flex items-center gap-3 px-2 py-2.5 rounded-2xl text-left">
                  <CoinIcon symbol={a.symbol} icon={a.icon} size={36} />
                  <span className="flex-1"><span className="block text-sm">{a.name}</span><span className="block text-[11px] text-neutral-500">{a.symbol} · {a.network}</span></span>
                  {coin?.symbol === a.symbol && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      )}
    </div>
  );
}
