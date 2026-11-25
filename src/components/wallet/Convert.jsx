// /convert — fiat <-> crypto at the live market price. The user sees the amount, the
// rate, any fee and what they receive before confirming; the server fills at the live
// price and refuses if it moved more than 1.5% since the quote.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowDownUp, ChevronDown, Check, Loader2, RefreshCw, Info } from 'lucide-react';
import { cryptoApi, apiError } from '../../api/products';
import { toast } from '../../lib/toast';
import { useWallets, CoinIcon, Sheet, money, qty, price } from './shared';

function Side({ label, unit, icon, available, availableLabel, value, onChange, readOnly, onPick, onMax, loading }) {
  return (
    <div className="rounded-3xl bg-white/[.04] border border-white/[.07] p-4">
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>{label}</span>
        {available != null && <span className="tabular-nums">Available {availableLabel}</span>}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <input inputMode="decimal" value={value} readOnly={readOnly} onChange={(e) => onChange?.(e.target.value.replace(/[^\d.]/g, ''))} placeholder="0"
          className={`flex-1 min-w-0 bg-transparent text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-zinc-100 tabular-nums focus:outline-none ${readOnly ? 'cursor-default' : ''}`} />
        {loading && <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />}
        <button type="button" onClick={onPick} disabled={!onPick} className="flex items-center gap-2 h-10 pl-1.5 pr-3 rounded-full bg-white/[.06] border border-white/10 text-sm text-zinc-100 shrink-0 disabled:cursor-default">
          {icon}{unit}{onPick && <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />}
        </button>
      </div>
      {onMax && <button type="button" onClick={onMax} className="mt-2 text-[11px] text-blue-400 hover:text-blue-300">Use max</button>}
    </div>
  );
}

export default function Convert() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { data, reload } = useWallets({ refreshMs: 30000 });
  const direction = params.get('direction') === 'fiat_to_crypto' ? 'fiat_to_crypto' : 'crypto_to_fiat';
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [error, setError] = useState('');
  const [picker, setPicker] = useState(false);
  const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);
  const cur = data?.currency || 'USD';

  const coins = useMemo(() => (data?.assets || []).filter((a) => (direction === 'crypto_to_fiat' ? a.balance > 0 : a.enabled)), [data, direction]);
  const coin = useMemo(() => coins.find((a) => a.symbol === params.get('coin')) || coins[0] || null, [coins, params]);
  const setParam = (k, v) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); setParams(n, { replace: true }); };
  const swap = () => { setParam('direction', direction === 'crypto_to_fiat' ? 'fiat_to_crypto' : 'crypto_to_fiat'); setAmount(''); setQuote(null); setError(''); };

  const available = direction === 'crypto_to_fiat' ? coin?.balance ?? 0 : data?.fiat?.balance ?? 0;
  const n = Number(amount);

  // Live quote: after typing stops, and every 15 s.
  useEffect(() => {
    setError('');
    if (!coin || !(n > 0)) { setQuote(null); return undefined; }
    const id = ++seq.current;
    const run = () => {
      setQuoting(true);
      cryptoApi.quote({ direction, symbol: coin.symbol, amount: n })
        .then((q) => { if (id === seq.current) setQuote(q); })
        .catch((e) => { if (id === seq.current) { setQuote(null); setError(apiError(e)); } })
        .finally(() => { if (id === seq.current) setQuoting(false); });
    };
    const t = setTimeout(run, 350);
    const r = setInterval(run, 15000);
    return () => { clearTimeout(t); clearInterval(r); };
  }, [direction, coin?.symbol, n]);

  const over = n > available + 1e-12;
  const canReview = quote && !over && !quoting && n > 0;

  const confirm = async () => {
    setBusy(true);
    try {
      const r = await cryptoApi.convert({ direction, symbol: coin.symbol, amount: n, quotedPrice: quote.price });
      toast.success('Converted', { description: r.message });
      setReview(false);
      setAmount('');
      setQuote(null);
      reload();
    } catch (e) {
      const m = apiError(e);
      toast.error(m);
      if (e?.response?.status === 409) {
        // Price moved: show the fresh quote for another look.
        cryptoApi.quote({ direction, symbol: coin.symbol, amount: n }).then(setQuote).catch(() => {});
      } else {
        setReview(false);
        setError(m);
      }
    } finally {
      setBusy(false);
    }
  };

  const coinIcon = coin ? <CoinIcon symbol={coin.symbol} icon={coin.icon} size={28} /> : null;
  const fiatIcon = <CoinIcon symbol={cur} fiat size={28} />;
  const fromCoin = direction === 'crypto_to_fiat';

  return (
    <div className="w-full max-w-[520px] mx-auto px-4 sm:px-5 py-4 pb-35 lg:pb-10 text-zinc-100">
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:text-zinc-100" aria-label="Back"><ArrowLeft className="w-4 h-4" /></button>
        <div><p className="text-base font-semibold">Convert</p><p className="text-[11px] text-neutral-500">Between your {cur} balance and your crypto, at live prices</p></div>
      </div>

      {!data ? <div className="space-y-2"><div className="h-28 rounded-3xl skeleton" /><div className="h-28 rounded-3xl skeleton" /></div>
        : data.convertEnabled === false ? <p className="ui-card p-5 text-sm text-center">Conversion is not available right now.</p>
          : fromCoin && !coins.length ? (
            <div className="ui-card p-6 text-center">
              <p className="text-sm font-semibold">You don&apos;t hold any crypto yet</p>
              <p className="text-xs text-neutral-500 mt-1">Deposit a coin, or buy one with your {cur} balance.</p>
              <div className="mt-4 flex gap-2 justify-center">
                <button type="button" onClick={() => navigate('/deposit/crypto')} className="h-10 px-4 rounded-2xl bg-blue-600 text-white text-xs font-medium">Deposit crypto</button>
                <button type="button" onClick={swap} className="h-10 px-4 rounded-2xl bg-white/[.07] border border-white/10 text-xs font-medium">Buy crypto</button>
              </div>
            </div>
          ) : (
            <>
              <section className="ui-card p-3 relative">
                <Side label="You pay" unit={fromCoin ? coin?.symbol : cur} icon={fromCoin ? coinIcon : fiatIcon}
                  available={available} availableLabel={fromCoin ? `${qty(available)} ${coin?.symbol}` : money(available, cur)}
                  value={amount} onChange={setAmount} onPick={fromCoin ? () => setPicker(true) : undefined}
                  onMax={() => setAmount(String(fromCoin ? available : Math.floor(available * 100) / 100))} />
                <div className="flex justify-center -my-3 relative z-[1]">
                  <button type="button" onClick={swap} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_8px_20px_-8px_var(--color-blue-600)] hover:rotate-180 transition-transform duration-500" aria-label="Swap direction">
                    <ArrowDownUp className="w-4 h-4" />
                  </button>
                </div>
                <Side label="You receive" unit={fromCoin ? cur : coin?.symbol} icon={fromCoin ? fiatIcon : coinIcon}
                  value={quote ? (fromCoin ? quote.receive.amount.toFixed(2) : qty(quote.receive.amount)) : ''} readOnly loading={quoting}
                  onPick={!fromCoin ? () => setPicker(true) : undefined} />
              </section>

              <section className="mt-3 ui-card p-4 text-xs space-y-2">
                <div className="flex justify-between"><span className="text-neutral-400">Rate</span><span className="tabular-nums">{coin ? `1 ${coin.symbol} = ${price(quote?.price ?? coin.price, cur)}` : '—'}</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">Fee</span><span className="tabular-nums">{quote ? (quote.fee ? `${money(quote.fee, cur)} (${quote.feePercent}%)` : 'No fee') : (data.convertFeePercent ? `${data.convertFeePercent}%` : 'No fee')}</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">Price</span><span className="flex items-center gap-1 text-neutral-300"><RefreshCw className="w-3 h-3" />Live, refreshed every 15 s</span></div>
                {over && <p className="text-red-400">Not enough {fromCoin ? coin?.symbol : cur}. You have {fromCoin ? `${qty(available)} ${coin?.symbol}` : money(available, cur)}.</p>}
                {error && !over && <p className="text-red-400">{error}</p>}
              </section>

              <button type="button" disabled={!canReview} onClick={() => setReview(true)}
                className="mt-4 w-full h-12 rounded-2xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-40 transition">
                {n > 0 ? 'Review conversion' : 'Enter an amount'}
              </button>
              <p className="mt-3 text-[11px] text-neutral-500 flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0" />Trading, investing and other services use your {cur} balance. Convert crypto to {cur} to use it there.</p>
            </>
          )}

      {picker && (
        <Sheet title={fromCoin ? 'Convert from' : 'Buy'} note={fromCoin ? 'Coins you hold' : 'Coins available'} onClose={() => setPicker(false)}>
          <ul>
            {coins.map((a) => (
              <li key={a.symbol}>
                <button type="button" onClick={() => { setParam('coin', a.symbol); setPicker(false); setQuote(null); }} className="ui-row w-full flex items-center gap-3 px-2 py-2.5 rounded-2xl text-left">
                  <CoinIcon symbol={a.symbol} icon={a.icon} size={36} />
                  <span className="flex-1 min-w-0"><span className="block text-sm">{a.name}</span><span className="block text-[11px] text-neutral-500">{fromCoin ? `${qty(a.balance)} ${a.symbol}` : price(a.price, cur)}</span></span>
                  {coin?.symbol === a.symbol && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      )}

      {review && quote && (
        <Sheet title="Confirm conversion" note="Filled at the live price when you confirm" onClose={() => !busy && setReview(false)}>
          <div className="flex items-center justify-center gap-4 py-3">
            {fromCoin ? coinIcon : fiatIcon}<ArrowDownUp className="w-4 h-4 text-neutral-500 rotate-90" />{fromCoin ? fiatIcon : coinIcon}
          </div>
          <div className="rounded-2xl bg-white/[.04] border border-white/[.07] p-4 text-xs space-y-2.5">
            <div className="flex justify-between"><span className="text-neutral-400">You pay</span><span className="font-semibold tabular-nums">{fromCoin ? `${qty(quote.pay.amount)} ${quote.pay.unit}` : money(quote.pay.amount, cur)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Rate</span><span className="tabular-nums">1 {quote.symbol} = {price(quote.price, cur)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Fee</span><span className="tabular-nums">{quote.fee ? money(quote.fee, cur) : 'No fee'}</span></div>
            <div className="h-px bg-white/[.07]" />
            <div className="flex justify-between text-sm"><span className="text-neutral-300">You receive</span><span className="font-semibold text-emerald-400 tabular-nums">{fromCoin ? money(quote.receive.amount, cur) : `${qty(quote.receive.amount)} ${quote.receive.unit}`}</span></div>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">If the price moves more than 1.5% before you confirm, you&apos;ll see the new amount first.</p>
          <button type="button" onClick={confirm} disabled={busy} className="mt-4 w-full h-12 rounded-2xl bg-blue-600 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-500 disabled:opacity-60 transition">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}Confirm conversion
          </button>
        </Sheet>
      )}
    </div>
  );
}
