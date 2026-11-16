// Desktop-only panels for /dashboard (1024px and wider). Every export renders inside a
// `hidden lg:block` wrapper in HomeDashboard, so phones never see or lay them out.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet, TrendingUp, Banknote, Activity, ArrowDownToLine, ArrowUpFromLine, CandlestickChart,
  Users, Layers, Snowflake, Bell, ShieldCheck, ArrowRight,
} from "lucide-react";
import { portfolioApi, marketApi } from "../../api/products";
import { formatMoney } from "../products/ui";
import { API_BASE_URL } from "../../api/config";

/* ---------- desktop gate: below 1024px these render nothing and fetch nothing ---------- */

const mq = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)");
export function useDesktop() {
  const [on, setOn] = useState(() => !!mq()?.matches);
  useEffect(() => { const m = mq(); if (!m) return undefined; const f = () => setOn(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return on;
}
const desktopOnly = (C) => function DesktopOnly(props) { return useDesktop() ? <C {...props} /> : null; };

/* ---------- shared data (one fetch for all panels) ---------- */

let cache = null;
let inflight = null;
const load = () => {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = Promise.all([
      portfolioApi.summary().catch(() => null),
      marketApi.positions().catch(() => null),
    ]).then(([summary, pos]) => {
      cache = { summary, positions: (pos?.positions || []).filter((p) => p.status === "open") };
      setTimeout(() => { cache = null; inflight = null; }, 30000); // refresh on the next visit after 30 s
      return cache;
    });
  }
  return inflight;
};
function useDesktopData() {
  const [data, setData] = useState(cache);
  useEffect(() => { let alive = true; load().then((d) => alive && setData(d)); return () => { alive = false; }; }, []);
  return data;
}

const Card = ({ title, action, children, className = "" }) => (
  <section className={`rounded-2xl bg-[#1D1D1F] border border-white/5 p-5 ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        {title && <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </section>
);
const More = ({ to, label = "View all" }) => (
  <Link to={to} className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">{label}<ArrowRight className="w-3.5 h-3.5" /></Link>
);
const pnlOf = (p) => {
  if (typeof p.unrealizedPnl === "number") return p.unrealizedPnl;
  if (!p.currentPrice || !p.entryPrice || !p.quantity) return 0;
  const diff = (p.currentPrice - p.entryPrice) * p.quantity;
  return p.side === "short" ? -diff : diff;
};

/* ---------- 1. stats row ---------- */

function DesktopStatsInner() {
  const d = useDesktopData();
  const s = d?.summary;
  const cur = s?.currency || "USD";
  const invested = s ? Math.max(0, s.total - (s.breakdown?.cash || 0)) : 0;
  const open = d?.positions || [];
  const openPnl = open.reduce((a, p) => a + pnlOf(p), 0);
  const items = [
    { icon: Wallet, label: "Net worth", value: s ? formatMoney(s.total, cur) : "—", note: "Everything you own" },
    { icon: TrendingUp, label: "Invested", value: s ? formatMoney(invested, cur) : "—", note: s?.total ? `${((invested / s.total) * 100).toFixed(1)}% of net worth` : "Across all products" },
    { icon: Banknote, label: "Cash available", value: s ? formatMoney(s.breakdown?.cash || 0, cur) : "—", note: "Ready to trade or invest" },
    { icon: Activity, label: "Open positions", value: d ? String(open.length) : "—", note: open.length ? `${openPnl >= 0 ? "+" : ""}${formatMoney(openPnl, cur)} unrealised` : "No open trades", tone: open.length ? (openPnl >= 0 ? "text-emerald-400" : "text-red-400") : "text-neutral-500" },
  ];
  return (
    <div className="grid grid-cols-4 gap-5">
      {items.map(({ icon: Icon, label, value, note, tone }) => (
        <div key={label} className="rounded-2xl bg-[#1D1D1F] border border-white/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">{label}</p>
            <span className="w-8 h-8 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center"><Icon className="w-4 h-4" strokeWidth={1.9} /></span>
          </div>
          <p className="text-[22px] font-semibold tracking-tight tabular-nums mt-2 text-white">{value}</p>
          <p className={`text-[11px] mt-1 ${tone || "text-neutral-500"}`}>{note}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- 2. open positions ---------- */

function DesktopPositionsInner() {
  const d = useDesktopData();
  const open = d?.positions || [];
  return (
    <Card title="Open positions" action={<More to="/trademain" label="Trade" />} className="h-full">
      {!d ? <div className="h-24 rounded-xl bg-neutral-800/60 animate-pulse" /> : open.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-neutral-400">No open trades</p>
          <Link to="/trademain" className="inline-block mt-3 text-xs font-medium px-4 h-8 leading-8 rounded-full bg-blue-600 text-white">Open a trade</Link>
        </div>
      ) : (
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[11px] text-neutral-500">
              <th className="font-medium pb-2">Market</th><th className="font-medium pb-2">Side</th><th className="font-medium pb-2 text-right">Margin</th>
              <th className="font-medium pb-2 text-right">Entry</th><th className="font-medium pb-2 text-right">Now</th><th className="font-medium pb-2 text-right">P/L</th>
            </tr>
          </thead>
          <tbody>
            {open.slice(0, 5).map((p) => {
              const pnl = pnlOf(p);
              return (
                <tr key={p.id || p._id} className="border-t border-white/5">
                  <td className="py-2.5 font-medium text-zinc-100">{p.symbol}{p.leverage > 1 && <span className="ml-1.5 text-[10px] text-neutral-500">{p.leverage}x</span>}</td>
                  <td className={`py-2.5 capitalize ${p.side === "long" ? "text-emerald-400" : "text-red-400"}`}>{p.side}</td>
                  <td className="py-2.5 text-right tabular-nums text-zinc-200">{formatMoney(p.margin, p.currency)}</td>
                  <td className="py-2.5 text-right tabular-nums text-neutral-400">{Number(p.entryPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="py-2.5 text-right tabular-nums text-neutral-400">{p.currentPrice ? Number(p.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}</td>
                  <td className={`py-2.5 text-right tabular-nums font-medium ${pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>{pnl >= 0 ? "+" : ""}{formatMoney(pnl, p.currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}

/* ---------- 3. recent activity ---------- */

const ago = (iso) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
};

function DesktopActivityInner() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/notifications?limit=5`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => setItems(d?.notifications || [])).catch(() => setItems([]));
  }, []);
  return (
    <Card title="Recent activity" action={<More to="/notification" />} className="h-full">
      {!items ? <div className="h-24 rounded-xl bg-neutral-800/60 animate-pulse" /> : items.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-400">Nothing yet</p>
      ) : (
        <ul className="space-y-3">
          {items.slice(0, 5).map((n) => (
            <li key={n.id} className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-300">
                {n.type === "security" ? <ShieldCheck className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] text-zinc-100 truncate">{n.title}</p>
                <p className="text-[11px] text-neutral-500">{ago(n.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ---------- 4. allocation ---------- */

const PARTS = [
  ["cash", "Cash", "#71717a"], ["trading", "Trading", "var(--color-blue-500)"], ["copyTrading", "Copy trading", "#a78bfa"],
  ["staking", "Staking", "#f59e0b"], ["realEstate", "Real estate", "#14b8a6"], ["stocks", "Stocks", "#38bdf8"],
  ["coldStorage", "Cold storage", "#22d3ee"], ["mining", "Mining", "#84cc16"], ["cards", "Cards", "#f472b6"],
];

function DesktopAllocationInner() {
  const d = useDesktopData();
  const s = d?.summary;
  const total = s?.total || 0;
  const rows = s ? PARTS.map(([k, label, color]) => ({ k, label, color, v: s.breakdown?.[k] || 0 })).filter((r) => r.v > 0) : [];
  return (
    <Card title="Where your money is" action={<More to="/assets" label="Assets" />} className="h-full">
      {!s ? <div className="h-24 rounded-xl bg-neutral-800/60 animate-pulse" /> : (
        <>
          <div className="flex h-2.5 rounded-full overflow-hidden bg-neutral-800">
            {rows.map((r) => <span key={r.k} style={{ width: `${(r.v / total) * 100}%`, background: r.color }} />)}
          </div>
          <ul className="grid grid-cols-3 gap-x-6 gap-y-3 mt-5">
            {rows.map((r) => (
              <li key={r.k} className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                <span className="text-[12px] text-neutral-400 truncate">{r.label}</span>
                <span className="ml-auto text-[12px] tabular-nums text-zinc-200">{((r.v / total) * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

/* ---------- 5. quick actions ---------- */

const ACTIONS = [
  { to: "/deposite", label: "Deposit", icon: ArrowDownToLine },
  { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/trademain", label: "Trade", icon: CandlestickChart },
  { to: "/copytrade", label: "Copy", icon: Users },
  { to: "/staking", label: "Stake", icon: Layers },
  { to: "/cold-storage", label: "Vault", icon: Snowflake },
];

function DesktopQuickActionsInner() {
  return (
    <Card title="Quick actions" className="h-full">
      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-2 py-3 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 transition-colors">
            <span className="w-9 h-9 rounded-full bg-blue-600/15 text-blue-400 flex items-center justify-center"><Icon className="w-4 h-4" strokeWidth={1.9} /></span>
            <span className="text-[12px] text-zinc-200">{label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
export const DesktopStats = desktopOnly(DesktopStatsInner);
export const DesktopPositions = desktopOnly(DesktopPositionsInner);
export const DesktopActivity = desktopOnly(DesktopActivityInner);
export const DesktopAllocation = desktopOnly(DesktopAllocationInner);
export const DesktopQuickActions = desktopOnly(DesktopQuickActionsInner);
