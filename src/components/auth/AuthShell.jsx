// Shared frame for sign-in, sign-up and password reset. Phones: one calm column.
// Desktop: a brand panel with live crypto prices on the left, the form on the right.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wallet, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react';
import LanguageDropdown from '../navigation/LanguageDropdown';
import useBrand from '../../lib/useBrand';
import logo from '../../assets/Group.svg';

const COINS = ['BTC', 'ETH', 'SOL'];

function useTicker() {
  const [rows, setRows] = useState({});
  useEffect(() => {
    let alive = true;
    const load = () => fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(COINS.map((c) => `${c}USDT`)))}`)
      .then((r) => r.json())
      .then((d) => { if (alive && Array.isArray(d)) setRows(Object.fromEntries(d.map((x) => [x.symbol.replace('USDT', ''), { p: +x.lastPrice, c: +x.priceChangePercent }]))); })
      .catch(() => {});
    load();
    const t = setInterval(load, 15000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return rows;
}

function BrandPanel({ brand }) {
  const rows = useTicker();
  return (
    <aside className="auth-panel hidden lg:flex flex-col justify-between p-10 xl:p-14">
      <Link to="/" className="flex items-center gap-2.5 relative z-[1]">
        <img src={logo} alt="" className="w-9 h-9 brand-logo" />
        {brand && <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">{brand}</span>}
      </Link>
      <div className="relative z-[1] max-w-[440px]">
        <h2 className="text-[38px] xl:text-[44px] leading-[1.05] font-light tracking-[-0.035em] text-white">Your crypto,<br /><span className="font-semibold">all in one place.</span></h2>
        <ul className="mt-8 space-y-3.5">
          {[
            [Wallet, 'A wallet for every coin, valued live'],
            [ArrowLeftRight, 'Convert crypto and cash in seconds'],
            [ShieldCheck, 'Verified accounts and protected withdrawals']
          ].map(([Icon, t]) => (
            <li key={t} className="flex items-center gap-3 text-[14px] text-white/80"><span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><Icon className="w-4 h-4 text-white" /></span>{t}</li>
          ))}
        </ul>
      </div>
      <div className="relative z-[1] grid grid-cols-3 gap-3">
        {COINS.map((c, i) => {
          const r = rows[c];
          const up = (r?.c ?? 0) >= 0;
          return (
            <div key={c} className="auth-coin" style={{ animationDelay: `${i * 0.6}s` }}>
              <div className="flex items-center gap-2">
                <img src={`https://assets.coincap.io/assets/icons/${c.toLowerCase()}@2x.png`} alt="" className="w-6 h-6 rounded-full" />
                <span className="text-[12px] font-semibold text-white">{c}</span>
              </div>
              <p className="mt-2 text-[15px] font-medium tabular-nums text-white">{r ? `$${r.p.toLocaleString('en-US', { maximumFractionDigits: r.p > 100 ? 0 : 2 })}` : '—'}</p>
              {r && <p className={`text-[11px] tabular-nums flex items-center gap-0.5 ${up ? 'text-emerald-300' : 'text-red-300'}`}>{up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(r.c).toFixed(2)}%</p>}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default function AuthShell({ title, subtitle, children, footer }) {
  const brand = useBrand();
  return (
    <div className="auth-root min-h-[100dvh] grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-[var(--page)] text-zinc-100">
      <BrandPanel brand={brand} />
      <main className="flex flex-col min-h-[100dvh]">
        <header className="flex items-center justify-between px-5 sm:px-8 h-[68px] shrink-0">
          <Link to="/" className="flex items-center gap-2 lg:invisible">
            <img src={logo} alt="" className="w-8 h-8 brand-logo" />
            {brand && <span className="text-[15px] font-semibold tracking-[-0.02em]">{brand}</span>}
          </Link>
          <LanguageDropdown variant="icon" />
        </header>
        <div className="flex-1 flex items-start sm:items-center justify-center px-5 sm:px-8 pb-10 pt-4 sm:pt-0">
          <div className="w-full max-w-[400px] auth-rise">
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] leading-tight">{title}</h1>
            {subtitle && <p className="text-[13px] text-neutral-400 mt-1.5">{subtitle}</p>}
            <div className="mt-7">{children}</div>
            {footer && <div className="mt-6 text-center text-[13px] text-neutral-400">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

/** Text input with a floating label feel: label above, big comfortable field. */
export function AuthField({ label, error, right, ...props }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium text-neutral-400 mb-1.5">{label}</span>
      <span className={`auth-input ${error ? 'is-error' : ''}`}>
        <input {...props} className="flex-1 min-w-0 bg-transparent outline-none text-[14px] text-zinc-100 placeholder:text-neutral-500" />
        {right}
      </span>
      {error && <span className="block text-[12px] text-red-400 mt-1.5">{error}</span>}
    </label>
  );
}
