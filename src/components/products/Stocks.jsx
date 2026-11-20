import { useEffect, useMemo, useState } from 'react';
import { LineChart, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { stocksApi } from '../../api/products';
import {
  Panel, Stat, Button, Badge, Modal, Field, inputClass, Tabs,
  Loading, ErrorState, Empty, useLoader, useAction, formatMoney, formatNumber, formatDate
} from './ui';

const Change = ({ value }) => {
  const v = Number(value) || 0;
  const Icon = v >= 0 ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${v >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      <Icon className="w-3.5 h-3.5" />{v >= 0 ? '+' : ''}{v.toFixed(2)}%
    </span>
  );
};

const Logo = ({ stock }) => (stock.logo
  ? <img src={stock.logo} alt="" className="w-9 h-9 rounded-full bg-white object-contain" />
  : <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold">{stock.symbol.slice(0, 2)}</div>);

function TradeModal({ open, stock, side, holding, currency, balance, onClose, onDone }) {
  const { busy, run } = useAction();
  const [value, setValue] = useState('');
  if (!open || !stock) return null;

  const price = stock.localPrice;
  const n = Number(value) || 0;
  const fee = side === 'buy' ? n * (stock.feePercent / 100) : n * price * (stock.feePercent / 100);
  const estShares = side === 'buy' ? n / price : n;
  const total = side === 'buy' ? n + fee : n * price - fee;
  const invalid = !(n > 0) || (side === 'buy' ? n + fee > balance : n > holding);

  const submit = async () => {
    const res = await run(
      () => (side === 'buy' ? stocksApi.buy(stock.symbol, n) : stocksApi.sell(stock.symbol, n, Math.abs(n - holding) < 1e-9)),
      side === 'buy' ? `Bought ${stock.symbol}` : `Sold ${stock.symbol}`
    );
    if (res) { setValue(''); onDone(); onClose(); }
  };

  return (
    <Modal
      open={open}
      title={`${side === 'buy' ? 'Buy' : 'Sell'} ${stock.symbol}`}
      onClose={onClose}
      footer={(<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={busy} disabled={invalid} variant={side === 'buy' ? 'primary' : 'danger'} onClick={submit}>{side === 'buy' ? 'Buy' : 'Sell'}</Button></>)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><Logo stock={stock} /><div><p className="font-medium">{stock.name}</p><p className="text-xs text-neutral-400">{stock.exchange}</p></div></div>
        <div className="text-right"><p className="font-semibold">{formatMoney(price, currency)}</p><Change value={stock.changePercent} /></div>
      </div>
      <Field
        label={side === 'buy' ? `Amount to invest (${currency})` : 'Shares to sell'}
        hint={side === 'buy' ? `Available ${formatMoney(balance, currency)}` : `You own ${formatNumber(holding, 6)} shares`}
      >
        <div className="flex gap-2">
          <input type="number" min="0" step="any" autoFocus className={inputClass} value={value} onChange={(e) => setValue(e.target.value)} />
          {side === 'sell' && <Button variant="secondary" onClick={() => setValue(String(holding))}>All</Button>}
        </div>
      </Field>
      <dl className="text-sm space-y-1.5 bg-neutral-900 rounded-lg p-3">
        <div className="flex justify-between"><dt className="text-neutral-400">{side === 'buy' ? 'Estimated shares' : 'Gross value'}</dt><dd>{side === 'buy' ? formatNumber(estShares, 6) : formatMoney(n * price, currency)}</dd></div>
        <div className="flex justify-between"><dt className="text-neutral-400">Fee ({stock.feePercent}%)</dt><dd>{formatMoney(fee, currency)}</dd></div>
        <div className="flex justify-between font-medium"><dt>{side === 'buy' ? 'Total cost' : 'You receive'}</dt><dd>{formatMoney(Math.max(0, total), currency)}</dd></div>
      </dl>
      <p className="text-xs text-neutral-500 mt-3">Orders fill at the listed price. Prices can change and investments can lose value.</p>
    </Modal>
  );
}

/** Market list, holdings and orders. Rendered as the Stocks tab of the Investing page. */
export function StocksPanel({ onChange }) {
  const [tab, setTab] = useState('market');
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const market = useLoader(() => stocksApi.list(), []);
  const portfolio = useLoader(() => stocksApi.portfolio(), []);
  const orders = useLoader(() => (tab === 'orders' ? stocksApi.orders({ limit: 50 }) : Promise.resolve(null)), [tab]);
  const [trade, setTrade] = useState(null); // { stock, side }
  // Prices follow the real market: refresh every 30 seconds while the page is open (not while a trade is being entered).
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === 'visible' && !trade) { market.reload(); portfolio.reload(); } }, 30000);
    return () => clearInterval(t);
  }, [market.reload, portfolio.reload, trade]);
  const lastUpdate = useMemo(() => {
    const ts = (market.data?.stocks || []).map((x) => (x.priceSource !== 'manual' && x.lastPriceAt ? new Date(x.lastPriceAt).getTime() : 0)).filter(Boolean);
    return ts.length ? new Date(Math.max(...ts)) : null;
  }, [market.data]);

  const holdingsBySymbol = useMemo(
    () => Object.fromEntries((portfolio.data?.positions || []).map((p) => [p.symbol, p.shares])),
    [portfolio.data]
  );
  const stocks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (market.data?.stocks || []).filter((s) =>
      (!sector || s.sector === sector) && (!q || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)));
  }, [market.data, search, sector]);

  const refresh = () => { market.reload(); portfolio.reload(); onChange?.(); };
  const currency = market.data?.currency || portfolio.data?.currency || 'USD';
  const p = portfolio.data;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Stocks value" value={formatMoney(p?.totals?.marketValue, currency)} />
        <Stat label="Total return" value={formatMoney(p?.totals?.pnl, currency)} tone={(p?.totals?.pnl || 0) >= 0 ? 'up' : 'down'} />
        <Stat label="Cash available" value={formatMoney(p?.availableBalance, currency)} />
      </div>

      <Tabs value={tab} onChange={setTab} how={[['Find a stock', 'Browse the Market tab.'], ['Buy', 'Pay from your balance. Shares appear in My holdings.'], ['Sell when ready', 'Sell from My holdings and the proceeds return to your balance.']]} tabs={[{ value: 'market', label: 'Market' }, { value: 'holdings', label: 'My holdings' }, { value: 'orders', label: 'Orders' }]} />

      {tab === 'market' && (
        <Panel>
          {lastUpdate && (
            <p className="text-[11px] text-neutral-500 mb-3 flex items-center gap-1.5">
              <span className="relative flex w-2 h-2"><span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping" /><span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" /></span>
              Live market prices · updated {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
              <input className={`${inputClass} pl-9`} placeholder="Search by name or symbol" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className={`${inputClass} sm:w-48`} value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="">All sectors</option>
              {(market.data?.sectors || []).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {market.loading && !market.data ? <Loading /> : market.error ? <ErrorState message={market.error} onRetry={market.reload} /> : stocks.length === 0 ? (
            <Empty icon={LineChart} title="No stocks found" text="Try a different search or check back later." />
          ) : (
            <ul className="divide-y divide-neutral-800">
              {stocks.map((s) => (
                <li key={s.symbol} className="py-3 flex items-center gap-3">
                  <Logo stock={s} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{s.symbol} <span className="text-neutral-400 font-normal text-sm">· {s.name}</span></p>
                    <p className="text-xs text-neutral-500">{s.sector}{s.dividendYield ? ` · ${s.dividendYield}% dividend` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatMoney(s.localPrice, currency)}</p>
                    <Change value={s.changePercent} />
                  </div>
                  <div className="flex gap-1.5">
                    <Button className="px-3" onClick={() => setTrade({ stock: s, side: 'buy' })}>Buy</Button>
                    {holdingsBySymbol[s.symbol] > 0 && <Button variant="secondary" className="px-3" onClick={() => setTrade({ stock: s, side: 'sell' })}>Sell</Button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      {tab === 'holdings' && (
        <Panel>
          {portfolio.loading && !p ? <Loading /> : !p?.positions?.length ? (
            <Empty icon={LineChart} title="No holdings yet" text="Buy fractional shares from as little as a few dollars." action={<Button onClick={() => setTab('market')}>Browse market</Button>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead className="text-neutral-400 text-left"><tr><th className="py-2">Stock</th><th>Shares</th><th>Avg cost</th><th>Value</th><th>Return</th><th /></tr></thead>
                <tbody className="divide-y divide-neutral-800">
                  {p.positions.map((h) => {
                    const stock = market.data?.stocks?.find((s) => s.symbol === h.symbol);
                    return (
                      <tr key={h.symbol}>
                        <td className="py-3 font-medium">{h.symbol}<p className="text-xs text-neutral-500 font-normal">{h.name}</p></td>
                        <td>{formatNumber(h.shares, 6)}</td>
                        <td>{formatMoney(h.avgCost, currency)}</td>
                        <td>{formatMoney(h.marketValue, currency)}</td>
                        <td className={h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatMoney(h.pnl, currency)} ({h.pnlPercent}%)</td>
                        <td className="text-right">{stock && <Button variant="secondary" className="px-3" onClick={() => setTrade({ stock, side: 'sell' })}>Sell</Button>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}

      {tab === 'orders' && (
        <Panel>
          {orders.loading ? <Loading /> : !orders.data?.items?.length ? <Empty title="No orders yet" /> : (
            <ul className="divide-y divide-neutral-800 text-sm">
              {orders.data.items.map((o) => (
                <li key={o._id} className="py-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium"><Badge tone={o.side === 'buy' ? 'success' : 'danger'}>{o.side.toUpperCase()}</Badge> <span className="ml-1">{o.symbol}</span></p>
                    <p className="text-xs text-neutral-500">{formatDate(o.createdAt)} · {formatNumber(o.shares, 6)} shares</p>
                  </div>
                  <div className="text-right">
                    <p>{formatMoney(o.amount, o.currency)}</p>
                    <p className="text-xs text-neutral-500">fee {formatMoney(o.fee, o.currency)}{o.side === 'sell' ? ` · P/L ${formatMoney(o.realizedPnl, o.currency)}` : ''}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      <TradeModal
        open={!!trade}
        stock={trade?.stock}
        side={trade?.side}
        holding={holdingsBySymbol[trade?.stock?.symbol] || 0}
        currency={currency}
        balance={p?.availableBalance || 0}
        onClose={() => setTrade(null)}
        onDone={refresh}
      />
    </>
  );
}
