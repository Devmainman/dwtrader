// Desktop-only navigation (1024px and wider). Phones never render it: the whole
// component is `hidden lg:flex`, and the phone keeps its bottom nav and drawer.
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Gem, TrendingUp, Bot, Users, Cpu, PieChart, Building2, Layers,
  ArrowDownToLine, ArrowUpFromLine, History, Snowflake, CreditCard, Wallet, Trophy,
  User, Crown, Signal, Bell, LifeBuoy, Gift, LogOut, Sparkles,
} from "lucide-react";
import logo from "../../assets/Group.svg";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL } from "../../api/config";

const GROUPS = [
  { title: null, items: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/assets", label: "Assets", icon: Gem },
  ] },
  { title: "Trade", items: [
    { to: "/trademain", label: "Live trading", icon: TrendingUp },
    { to: "/trade", label: "Trading packages", icon: Bot },
    { to: "/copytrade", label: "Copy trading", icon: Users, also: ["/copy-positions"] },
    { to: "/ai-trader", label: "AI Smart Trader", icon: Sparkles },
    { to: "/mining", label: "Mining", icon: Cpu },
  ] },
  { title: "Invest", items: [
    { to: "/invest", label: "Investing", icon: PieChart },
    { to: "/real-estate", label: "Real estate", icon: Building2 },
    { to: "/staking", label: "Staking", icon: Layers },
  ] },
  { title: "Money", items: [
    { to: "/deposite", label: "Deposit", icon: ArrowDownToLine },
    { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
    { to: "/transactionhistory", label: "Transactions", icon: History },
    { to: "/cold-storage", label: "Cold storage", icon: Snowflake },
    { to: "/cards", label: "Cards", icon: CreditCard },
    { to: "/rewards", label: "Rewards", icon: Trophy },
    { to: "/wallets", label: "Connect wallet", icon: Wallet },
  ] },
  { title: "Account", items: [
    { to: "/settings", label: "Profile", icon: User },
    { to: "/accountupgrade", label: "Upgrade account", icon: Crown },
    { to: "/signal-packages", label: "Signal packages", icon: Signal },
    { to: "/notification", label: "Notifications", icon: Bell },
    { to: "/support", label: "Support", icon: LifeBuoy, also: ["/opensupport"] },
    { to: "/referrals", label: "Referrals", icon: Gift },
  ] },
];

export default function DesktopSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useUserAuth();
  const [brand, setBrand] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/public/settings`).then((r) => r.json()).then((d) => setBrand(d?.settings?.websiteName || "")).catch(() => {});
  }, []);

  const isOn = (it) => pathname === it.to || pathname.startsWith(`${it.to}/`) || (it.also || []).some((p) => pathname.startsWith(p));
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "";

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-[900] w-[248px] flex-col bg-[var(--page)] border-r border-white/5 text-zinc-100">
      <Link to="/dashboard" className="flex items-center gap-2.5 px-5 h-[68px] shrink-0">
        <img src={logo} alt="" className="w-8 h-8 brand-logo" />
        <span className="text-[15px] font-semibold tracking-tight truncate">{brand || "Dashboard"}</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:thin]">
        {GROUPS.map((g, gi) => (
          <div key={gi} className={gi ? "mt-5" : "mt-1"}>
            {g.title && <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const on = isOn(it);
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={`flex items-center gap-3 h-9 px-3 rounded-xl text-[13px] transition-colors ${on ? "bg-blue-600/15 text-white font-medium" : "text-neutral-400 hover:text-zinc-100 hover:bg-white/5"}`}
                    >
                      <it.icon className={`w-[17px] h-[17px] shrink-0 ${on ? "text-blue-400" : ""}`} strokeWidth={1.9} />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-300 flex items-center justify-center text-xs font-semibold shrink-0">
            {(name || "?").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate">{name || "Your account"}</p>
            {user?.email && name !== user.email && <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>}
          </div>
          <button type="button" onClick={() => logout?.()} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5" aria-label="Log out" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
