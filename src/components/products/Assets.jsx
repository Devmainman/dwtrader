// Assets: everything the user holds, in one place.
// Visual language: iOS Settings / Storage — one big number, a segmented
// capsule bar, inset grouped lists with hairline separators.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Wallet, Coins, LineChart, Building2, Bot, Copy, Lock, CreditCard, Cpu, PieChart } from 'lucide-react';
import { portfolioApi } from '../../api/products';
import { CoinIcon } from '../wallet/shared';
import { Page, Loading, ErrorState, Empty, AnimatedNumber, useLoader, formatMoney } from './ui';

const ICONS = { cash: Wallet, coins: Coins, crypto: Coins, stocks: LineChart, realEstate: Building2, trading: Bot, copyTrading: Copy, coldStorage: Lock, cards: CreditCard, mining: Cpu };

/** Capsule split into segments, like iPhone Storage. Each segment grows in from the left. */
function SegmentBar({ groups }) {
  return (
    <div className="flex h-3 w-full gap-[3px] rounded-full overflow-hidden bg-white/[0.06]" role="img" aria-label="Allocation by product">
      {groups.map((g, i) => (
        <span
          key={g.key}
          className="h-full assets-seg first:rounded-l-full last:rounded-r-full"
          style={{ flexGrow: Math.max(g.share, 0.6), flexBasis: 0, background: g.color, animationDelay: `${120 + i * 70}ms` }}
          title={`${g.label} ${g.share}%`}
        />
      ))}
    </div>
  );
}

function Group({ title, children, action }) {
  return (
    <section>
      {(title || action) && (
        <div className="flex items-end justify-between px-4 mb-1.5">
          {title && <h2 className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-500">{title}</h2>}
          {action}
        </div>
      )}
      <div className="rounded-2xl bg-[var(--card)] overflow-hidden">{children}</div>
    </section>
  );
}

function Row({ to, left, title, subtitle, value, sub, subTone }) {
  return (
    <Link to={to || '#'} className="group flex items-center gap-3 pl-4 pr-3 min-h-[60px] active:bg-white/[0.06] hover:bg-white/[0.03] transition-colors">
      {left}
      <div className="flex-1 min-w-0 flex items-center gap-3 py-3 border-b border-white/[0.06] group-last:border-b-0">
        <div className="flex-1 min-w-0">
          <p className="text-[15px] text-zinc-100 truncate">{title}</p>
          {subtitle && <p className="text-[12px] text-neutral-500 truncate mt-0.5">{subtitle}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[15px] text-zinc-100 tabular-nums">{value}</p>
          {sub && <p className={`text-[12px] tabular-nums mt-0.5 ${subTone || 'text-neutral-500'}`}>{sub}</p>}
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
      </div>
    </Link>
  );
}

const iconTile = (group, color, src, symbol) => {
  if (group === 'coins') return <CoinIcon symbol={symbol} icon={src} size={32} />;
  const Icon = ICONS[group] || PieChart;
  return (
    <span className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 overflow-hidden" style={{ background: src ? '#2C2C2E' : color }}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" /> : <Icon className="w-[17px] h-[17px] text-white" strokeWidth={2.2} />}
    </span>
  );
};

export default function Assets() {
  const { data, loading, error, reload } = useLoader(() => portfolioApi.holdings(), []);
  const [filter, setFilter] = useState('all');
  const cur = data?.currency || 'USD';
  const colorOf = useMemo(() => Object.fromEntries((data?.groups || []).map((g) => [g.key, g.color])), [data]);
  const items = useMemo(() => (data?.items || []).filter((i) => filter === 'all' || i.group === filter), [data, filter]);
  const pnl = data?.invested?.pnl ?? 0;
  const up = pnl >= 0;

  return (
    <Page title="Assets" subtitle="Everything you hold, valued in your currency.">
      {loading && !data ? <Loading rows={5} /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <div className="flex flex-col gap-7 lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
          {/* Summary */}
          <div className="flex flex-col gap-7 lg:sticky lg:top-4">
            <div className="px-1 assets-rise">
              <p className="text-[13px] text-neutral-500">Net worth</p>
              <AnimatedNumber value={data.total} format={(n) => formatMoney(n, cur)} className="block text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] text-white mt-1" />
              {data.invested.cost > 0 && (
                <p className="mt-2 text-[13px] text-neutral-400">
                  <span className={up ? 'text-[#30D158]' : 'text-[#FF453A]'}>
                    {up ? '+' : '−'}{formatMoney(Math.abs(pnl), cur)} ({up ? '+' : '−'}{Math.abs(data.invested.pnlPercent)}%)
                  </span>
                  {' '}on {formatMoney(data.invested.cost, cur)} invested
                </p>
              )}
              <div className="mt-5"><SegmentBar groups={data.groups} /></div>
            </div>

            <Group title="Allocation">
              {data.groups.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setFilter((f) => (f === g.key ? 'all' : g.key))}
                  className={`group w-full flex items-center gap-3 pl-4 pr-4 min-h-[48px] text-left transition-colors ${filter === g.key ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03] active:bg-white/[0.06]'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
                  <span className="flex-1 flex items-center gap-3 py-3 border-b border-white/[0.06] group-last:border-b-0 min-w-0">
                    <span className="flex-1 text-[15px] text-zinc-100 truncate">{g.label}</span>
                    <span className="text-[15px] text-zinc-100 tabular-nums">{formatMoney(g.value, cur)}</span>
                    <span className="w-12 text-right text-[13px] text-neutral-500 tabular-nums">{g.share}%</span>
                  </span>
                </button>
              ))}
            </Group>
          </div>

          {/* Holdings */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-1 p-[3px] rounded-[10px] bg-[var(--card)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[{ key: 'all', label: 'All' }, ...data.groups].map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setFilter(g.key)}
                  className={`shrink-0 h-8 px-3.5 rounded-[8px] text-[13px] font-medium transition-all duration-200 ${filter === g.key ? 'bg-[var(--card-3)] text-white shadow-[0_1px_3px_rgba(0,0,0,0.4)]' : 'text-neutral-400 hover:text-neutral-200'}`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {!items.length ? (
              <div className="rounded-2xl bg-[var(--card)]"><Empty icon={PieChart} title="Nothing here yet" text="Deposit crypto, invest, stake or trade and it will show up here." /></div>
            ) : (
              <Group title={filter === 'all' ? `${items.length} holding${items.length === 1 ? '' : 's'}` : data.groups.find((g) => g.key === filter)?.label}
                action={<button type="button" onClick={reload} className="text-[13px] text-[#0A84FF] hover:opacity-80">Refresh</button>}>
                <div key={filter} className="assets-fade">
                  {items.map((it) => {
                    const hasPnl = it.pnl != null;
                    const pUp = (it.pnl ?? 0) >= 0;
                    const qty = it.quantity != null ? `${Number(it.quantity).toLocaleString('en-US', { maximumFractionDigits: 6 })} ${it.unit || ''}`.trim() : null;
                    return (
                      <Row
                        key={`${it.group}-${it.id}`}
                        to={it.link}
                        left={iconTile(it.group, colorOf[it.group], it.icon, it.symbol)}
                        title={it.name}
                        subtitle={[qty, it.detail].filter(Boolean).join(' · ') || it.symbol}
                        value={formatMoney(it.value, cur)}
                        sub={hasPnl ? `${pUp ? '+' : '−'}${formatMoney(Math.abs(it.pnl), cur)}${it.pnlPercent != null ? ` · ${pUp ? '+' : '−'}${Math.abs(it.pnlPercent)}%` : ''}` : null}
                        subTone={hasPnl ? (pUp ? 'text-[#30D158]' : 'text-[#FF453A]') : undefined}
                      />
                    );
                  })}
                </div>
              </Group>
            )}
            <p className="px-4 text-[12px] text-neutral-600">Values update with live prices and are converted at today&apos;s exchange rate.</p>
          </div>
        </div>
      )}
    </Page>
  );
}
