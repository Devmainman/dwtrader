// Asset rows: the fiat wallet first, then each coin wallet (zero balances included).
// Tapping a row opens the asset sheet with its price, balance and actions.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, ShoppingCart, ChevronRight } from 'lucide-react';
import { CoinIcon, Sheet, money, qty, price, pct, mask } from './shared';

export function AssetRow({ a, currency, hidden, onOpen, fiat = false }) {
  return (
    <li>
      <button type="button" onClick={() => onOpen(a)} className="ui-row w-full flex items-center gap-3 px-2 py-2.5 rounded-2xl text-left">
        <CoinIcon symbol={a.symbol} icon={a.icon} fiat={fiat} size={40} />
        <span className="flex-1 min-w-0">
          <span className={`block text-sm font-medium text-zinc-100 ${fiat ? "leading-snug" : "truncate"}`}>{a.name}{!fiat && <span className="text-neutral-500 font-normal"> · {a.symbol}</span>}</span>
          <span className="block text-[11px] text-neutral-500 truncate">
            {fiat ? 'Fiat balance · used for trading and investing' : <>{price(a.price, currency)} <span className={a.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>{pct(a.change24h)}</span></>}
          </span>
        </span>
        <span className="text-right shrink-0">
          <span className="block text-sm font-semibold text-zinc-100 tabular-nums">{mask(money(a.value, currency), hidden)}</span>
          <span className="block text-[11px] text-neutral-500 tabular-nums">{mask(`${qty(a.balance)} ${a.symbol}`, hidden)}</span>
        </span>
      </button>
    </li>
  );
}

export function AssetSheet({ a, currency, fiat, convertEnabled, onClose }) {
  const navigate = useNavigate();
  const go = (to) => { onClose(); navigate(to); };
  const actions = fiat
    ? [
      { label: 'Deposit', icon: ArrowDownToLine, to: '/deposite?method=fiat', primary: true },
      { label: 'Withdraw', icon: ArrowUpFromLine, to: '/withdraw' },
      ...(convertEnabled ? [{ label: 'Buy crypto', icon: ShoppingCart, to: '/convert?direction=fiat_to_crypto' }] : [])
    ]
    : [
      ...(a.enabled ? [{ label: 'Deposit', icon: ArrowDownToLine, to: `/deposit/crypto?coin=${a.symbol}`, primary: true }] : []),
      ...(convertEnabled && a.balance > 0 ? [{ label: `Convert to ${currency}`, icon: ArrowLeftRight, to: `/convert?direction=crypto_to_fiat&coin=${a.symbol}` }] : []),
      ...(convertEnabled && a.enabled ? [{ label: `Buy ${a.symbol}`, icon: ShoppingCart, to: `/convert?direction=fiat_to_crypto&coin=${a.symbol}` }] : [])
    ];
  return (
    <Sheet title={a.name} note={fiat ? 'Your account currency' : `${a.symbol}${a.network ? ` · ${a.network}` : ''}`} onClose={onClose}>
      <div className="flex flex-col items-center text-center pt-1 pb-4">
        <CoinIcon symbol={a.symbol} icon={a.icon} fiat={fiat} size={56} />
        <p className="mt-3 text-[clamp(1.75rem,4vw,2rem)] font-medium tracking-wide leading-tight text-zinc-100 tabular-nums">{money(a.value, currency)}</p>
        <p className="text-xs text-neutral-400 tabular-nums">{qty(a.balance)} {a.symbol}</p>
        {!fiat && (
          <p className="mt-2 text-[11px] text-neutral-400">1 {a.symbol} = {price(a.price, currency)} <span className={a.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>{pct(a.change24h)} 24h</span></p>
        )}
      </div>
      {!fiat && !a.enabled && <p className="text-[11px] text-amber-400 text-center mb-3">{a.symbol} deposits are paused. You can still convert what you hold.</p>}
      <div className="space-y-2">
        {actions.map((x) => (
          <button key={x.label} type="button" onClick={() => go(x.to)}
            className={`w-full h-11 rounded-2xl flex items-center gap-3 px-4 text-sm transition active:scale-[0.98] ${x.primary ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/[.06] border border-white/[.08] text-zinc-100 hover:bg-white/10'}`}>
            <x.icon className="w-4 h-4" />{x.label}<ChevronRight className="w-4 h-4 ml-auto opacity-60" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/** The dashboard list: fiat first, then coins (held ones first). */
export default function AssetList({ data, hidden, limit = 6 }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const cur = data?.currency || 'USD';
  const coins = (data?.assets || []).slice(0, limit);
  return (
    <section>
      <div className="flex items-center justify-between mb-1 px-1">
        <p className="text-sm font-semibold text-zinc-100">Assets</p>
        <button type="button" onClick={() => navigate('/wallet')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5">View all assets<ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
      {!data ? (
        <div className="space-y-2 py-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-14 rounded-2xl skeleton" />)}</div>
      ) : (
        <ul className="ui-stagger -mx-1">
          <AssetRow a={{ ...data.fiat, symbol: data.fiat.symbol }} currency={cur} hidden={hidden} fiat onOpen={() => setOpen({ fiat: true, a: { ...data.fiat } })} />
          {coins.map((a) => <AssetRow key={a.symbol} a={a} currency={cur} hidden={hidden} onOpen={() => setOpen({ fiat: false, a })} />)}
        </ul>
      )}
      {data && (data.assets || []).length > limit && (
        <button type="button" onClick={() => navigate('/wallet')} className="mt-1 w-full h-10 rounded-2xl text-xs text-neutral-300 hover:text-zinc-100 hover:bg-white/5 transition">
          View all {data.assets.length + 1} assets
        </button>
      )}
      {open && <AssetSheet a={open.a} fiat={open.fiat} currency={cur} convertEnabled={data?.convertEnabled !== false} onClose={() => setOpen(null)} />}
    </section>
  );
}
