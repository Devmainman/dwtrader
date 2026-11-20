// Dashboard market chart: pick a coin and a timeframe, see the live price,
// the TradingView chart, and the day's open / high / low / volume underneath.
// Everything stays inside the card on any screen width.
import { useEffect, useRef, useState } from "react";

const COINS = [
  { sym: "BTC", name: "Bitcoin" },
  { sym: "ETH", name: "Ethereum" },
  { sym: "SOL", name: "Solana" },
  { sym: "BNB", name: "BNB" },
  { sym: "XRP", name: "XRP" },
];
const FRAMES = [
  { label: "1H", tv: "60" },
  { label: "4H", tv: "240" },
  { label: "1D", tv: "D" },
  { label: "1W", tv: "W" },
];

let tvLoader = null;
const loadTradingView = () => {
  if (window.TradingView) return Promise.resolve();
  if (!tvLoader) {
    tvLoader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://s3.tradingview.com/tv.js";
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return tvLoader;
};

const money = (n) =>
  n >= 1000 ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : n >= 1 ? n.toFixed(2) : n.toPrecision(4);
const compact = (n) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

function TradingChart() {
  const [coin, setCoin] = useState("BTC");
  const [frame, setFrame] = useState("D");
  const [stats, setStats] = useState(null);
  const [chartReady, setChartReady] = useState(false);
  const holder = useRef(null);

  // Live 24h numbers for the chosen coin.
  useEffect(() => {
    let alive = true;
    setStats(null);
    const load = () =>
      fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${coin}USDT`)
        .then((r) => r.json())
        .then((d) => {
          if (!alive || !d?.lastPrice) return;
          setStats({
            price: +d.lastPrice, open: +d.openPrice, high: +d.highPrice, low: +d.lowPrice,
            change: +d.priceChange, pct: +d.priceChangePercent, volume: +d.quoteVolume,
          });
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 10000);
    return () => { alive = false; clearInterval(id); };
  }, [coin]);

  // TradingView chart, rebuilt when the coin or timeframe changes.
  useEffect(() => {
    let cancelled = false;
    const el = holder.current;
    if (!el) return undefined;
    setChartReady(false);
    const id = `tv-${coin}-${frame}-${Date.now()}`;
    el.innerHTML = `<div id="${id}" style="width:100%;height:100%"></div>`;
    const surface = getComputedStyle(document.documentElement).getPropertyValue("--surface-1").trim() || "#1d1d1f";
    loadTradingView()
      .then(() => {
        if (cancelled || !window.TradingView) return;
        new window.TradingView.widget({
          container_id: id,
          autosize: true,
          symbol: `BINANCE:${coin}USDT`,
          interval: frame,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          backgroundColor: surface,
          gridColor: "rgba(255,255,255,0.04)",
          hide_top_toolbar: true,
          hide_side_toolbar: true,
          hide_legend: true,
          hide_volume: true,
          allow_symbol_change: false,
          save_image: false,
          enable_publishing: false,
          details: false,
          hotlist: false,
          calendar: false,
          withdateranges: false,
          disabled_features: ["header_widget", "left_toolbar", "timeframes_toolbar", "control_bar", "legend_widget", "context_menus"],
        });
        setTimeout(() => !cancelled && setChartReady(true), 900);
      })
      .catch(() => {});
    return () => { cancelled = true; if (el) el.innerHTML = ""; };
  }, [coin, frame]);

  const up = (stats?.change ?? 0) >= 0;
  const tone = up ? "text-emerald-400" : "text-red-400";

  return (
    <section className="mt-6 lg:mt-0 w-full min-w-0 rounded-2xl bg-[#1D1D1F] overflow-hidden">
      {/* coin + timeframe, one row */}
      <div className="flex items-center gap-2 px-3 pt-2.5">
        <div className="flex-1 min-w-0 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {COINS.map((c) => (
            <button
              key={c.sym}
              type="button"
              onClick={() => setCoin(c.sym)}
              className={`shrink-0 h-7 px-3 rounded-full text-[11px] font-medium transition ${coin === c.sym ? "bg-neutral-600 text-white" : "bg-neutral-800 text-neutral-400 hover:text-zinc-200"}`}
            >
              {c.sym}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 rounded-full bg-neutral-800 p-0.5">
          {FRAMES.map((f) => (
            <button
              key={f.tv}
              type="button"
              onClick={() => setFrame(f.tv)}
              className={`h-6 px-2 rounded-full text-[10px] font-medium transition ${frame === f.tv ? "bg-neutral-600 text-white" : "text-neutral-400"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* price on one line */}
      <div className="flex items-baseline gap-2 px-4 pt-2 min-w-0">
        <p className="text-[17px] font-semibold tracking-tight tabular-nums text-white truncate">{stats ? `$${money(stats.price)}` : "—"}</p>
        {stats && (
          <p className={`text-[11px] font-medium tabular-nums shrink-0 ${tone}`}>{up ? "+" : ""}{stats.pct.toFixed(2)}% today</p>
        )}
        <p className="ml-auto text-[10px] text-neutral-500 shrink-0">{coin}/USDT</p>
      </div>

      {/* chart */}
      <div className="relative mt-1.5 h-[180px] lg:h-[400px] w-full">
        <div ref={holder} className="absolute inset-0" />
        {!chartReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-5 h-5 rounded-full border-2 border-neutral-600 border-t-neutral-300 animate-spin" />
          </div>
        )}
      </div>

      {/* day stats */}
      <dl className="hidden lg:grid grid-cols-4 gap-2 px-4 py-3 text-center">
        {[
          ["Open", stats && `$${money(stats.open)}`],
          ["High", stats && `$${money(stats.high)}`],
          ["Low", stats && `$${money(stats.low)}`],
          ["Volume", stats && `$${compact(stats.volume)}`],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-[10px] text-neutral-500">{label}</dt>
            <dd className="text-[11px] font-medium tabular-nums text-zinc-200 truncate">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default TradingChart;
