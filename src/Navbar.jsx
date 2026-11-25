// Phone tab bar: the calm dark glass pill with the white brand disc in the middle. The active
// icon fills in and pops, a small accent dot slides under it, the disc twists open Quick
// actions, and the bar tucks away while you scroll down and returns when you scroll up.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDownToLine, ArrowUpFromLine, Bot, Copy, Coins, Building2,
  LineChart, Cpu, CreditCard, Lock, Wallet, X, PieChart, Trophy, ArrowLeftRight, History
} from "lucide-react";
import "./Navbar.css";
import logo from "./assets/Group.svg";
import Duo from "./components/icons/Duo";

const TABS = [
  { to: "/dashboard", label: "Home", icon: "home" },
  { to: "/trademain", label: "Trade", icon: "chart", also: ["/trade"] },
  null, // centre action button
  { to: "/support", label: "Support", icon: "support", also: ["/opensupport"] },
  { to: "/settings", label: "Profile", icon: "user" }
];

const ACTIONS = [
  { to: "/deposite", label: "Deposit", icon: ArrowDownToLine, tone: "blue" },
  { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine, tone: "violet" },
  { to: "/convert", label: "Convert", icon: ArrowLeftRight, tone: "emerald" },
  { to: "/transactionhistory", label: "History", icon: History, tone: "slate" },
  { to: "/trade", label: "Bots", icon: Bot, tone: "sky" },
  { to: "/copytrade", label: "Copy", icon: Copy, tone: "blue" },
  { to: "/staking", label: "Stake", icon: Coins, tone: "amber" },
  { to: "/invest", label: "Stocks", icon: LineChart, tone: "emerald" },
  { to: "/real-estate", label: "Real estate", icon: Building2, tone: "rose" },
  { to: "/mining", label: "Mining", icon: Cpu, tone: "amber" },
  { to: "/cards", label: "Cards", icon: CreditCard, tone: "violet" },
  { to: "/rewards", label: "Rewards", icon: Trophy, tone: "amber" },
  { to: "/assets", label: "Portfolio", icon: PieChart, tone: "sky" },
  { to: "/wallets", label: "Wallets", icon: Wallet, tone: "slate" },
  { to: "/cold-storage", label: "Vault", icon: Lock, tone: "rose" }
];

function QuickActions({ onClose }) {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const close = (to) => {
    setLeaving(true);
    setTimeout(() => { onClose(); if (to) navigate(to); }, 180);
  };
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="fixed inset-0 z-[1100]" role="dialog" aria-modal="true" aria-label="Quick actions">
      <div className={`absolute inset-0 bg-black/55 backdrop-blur-[3px] ${leaving ? "qa-fade-out" : "qa-fade-in"}`} onClick={() => close()} />
      <div className={`qa-sheet absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+108px)] mx-auto max-w-[380px] rounded-[28px] p-4 ${leaving ? "qa-sheet-out" : "qa-sheet-in"}`}>
        <div className="flex items-center justify-between mb-3 px-1">
          <div><p className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-100">Quick actions</p><p className="text-[11px] text-neutral-500">Everything, one tap away</p></div>
          <button type="button" data-no-busy onClick={() => close()} className="topbar-btn !w-8 !h-8" aria-label="Close"><X className="w-3.5 h-3.5" /></button>
        </div>
        <div className="grid grid-cols-5 gap-y-3.5 gap-x-1">
          {ACTIONS.map((a, i) => (
            <button key={a.to + a.label} type="button" data-no-busy onClick={() => close(a.to)}
              className="flex flex-col items-center gap-1.5 qa-item active:scale-90 transition-transform" style={{ animationDelay: `${50 + i * 18}ms` }}>
              <span className={`qa-tile tone-${a.tone}`}><a.icon className="w-5 h-5" strokeWidth={1.9} /></span>
              <span className="text-[10px] font-medium text-neutral-400 leading-tight text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const Navbar = ({ style = {} }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const refs = useRef({});
  const [pill, setPill] = useState(null);
  useEffect(() => { setOpen(false); setHidden(false); }, [location.pathname]);

  const activeTab = TABS.find((t) => t && (location.pathname === t.to || (t.also || []).some((p) => location.pathname.startsWith(p))));

  // Glide the highlight to the active tab.
  useLayoutEffect(() => {
    const el = activeTab && refs.current[activeTab.to];
    setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [activeTab?.to]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tuck away while scrolling down, come back on scroll up (or near the top / bottom).
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const on = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 40;
        if (y < 80 || nearBottom) setHidden(false);
        else if (y > last + 6) setHidden(true);
        else if (y < last - 6) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      {open && <QuickActions onClose={() => setOpen(false)} />}
      <nav className={`navbar ${hidden && !open ? "is-hidden" : ""}`} style={style} aria-label="Main">
        <div className="navbar-content">
          {pill && <span className="nav-dot" style={{ transform: `translateX(${pill.left + pill.width / 2 - 9}px)` }} aria-hidden />}
          {TABS.map((t) => {
            if (!t) {
              return (
                <button key="action" type="button" data-no-busy className={`nav-logo ${open ? "is-open" : ""}`} onClick={() => setOpen((v) => !v)} aria-label="Quick actions" aria-expanded={open}>
                  <img src={logo} alt="" className="action-icon brand-logo" />
                </button>
              );
            }
            const active = activeTab === t;
            return (
              <Link key={t.to} ref={(el) => { refs.current[t.to] = el; }} to={t.to} className={`nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                <Duo key={active ? "on" : "off"} name={t.icon} size={24} soft={active ? 1 : 0} ink={active ? "var(--nav-ink)" : undefined} className="nav-icon" />
                <span className="nav-label">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
