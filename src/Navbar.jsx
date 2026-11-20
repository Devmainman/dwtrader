import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDownToLine, ArrowUpFromLine, CandlestickChart, Bot, Copy, Coins, Building2,
  LineChart, Cpu, CreditCard, Lock, Wallet, X, PieChart, Trophy
} from "lucide-react";
import "./Navbar.css";

import logo from "./assets/Group.svg";
import homeActive from "./assets/home-active.svg";
import homeInactive from "./assets/home.svg";
import tradeActive from "./assets/trend-up-active.svg";
import tradeInactive from "./assets/trend-up.svg";
import walletIcon from "./assets/empty-wallet.svg";
import profileIcon from "./assets/profile.svg";

const TABS = [
  { to: "/dashboard", label: "Home", active: homeActive, inactive: homeInactive },
  { to: "/trademain", label: "Trade", active: tradeActive, inactive: tradeInactive },
  null, // centre action button
  { to: "/support", label: "Support", active: walletIcon, inactive: walletIcon },
  { to: "/settings", label: "Profile", active: profileIcon, inactive: profileIcon }
];

const ACTIONS = [
  { to: "/deposite", label: "Deposit", icon: ArrowDownToLine },
  { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/assets", label: "Assets", icon: PieChart },
  { to: "/trade", label: "Bots", icon: Bot },
  { to: "/copytrade", label: "Copy", icon: Copy },
  { to: "/staking", label: "Stake", icon: Coins },
  { to: "/invest", label: "Stocks", icon: LineChart },
  { to: "/real-estate", label: "Real estate", icon: Building2 },
  { to: "/mining", label: "Mining", icon: Cpu },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/rewards", label: "Rewards", icon: Trophy },
  { to: "/wallets", label: "Wallets", icon: Wallet },
  { to: "/cold-storage", label: "Vault", icon: Lock }
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
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${leaving ? "qa-fade-out" : "qa-fade-in"}`} onClick={() => close()} />
      <div className={`absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+112px)] mx-auto max-w-[360px] rounded-[28px] bg-[#1C1C1E] shadow-2xl p-5 ${leaving ? "qa-sheet-out" : "qa-sheet-in"}`}>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[17px] font-semibold text-white">Quick actions</p>
          <button type="button" onClick={() => close()} className="w-[30px] h-[30px] rounded-full bg-[#2C2C2E] flex items-center justify-center text-[#8E8E93]" aria-label="Close"><X className="w-3.5 h-3.5" /></button>
        </div>
        <div className="grid grid-cols-4 gap-y-4 gap-x-2">
          {ACTIONS.map((a, i) => (
            <button key={a.to + a.label} type="button" onClick={() => close(a.to)}
              className="flex flex-col items-center gap-1.5 qa-item active:scale-90 transition-transform" style={{ animationDelay: `${60 + i * 22}ms` }}>
              <span className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center bg-[#2C2C2E] text-white"><a.icon className="w-[22px] h-[22px]" strokeWidth={1.8} /></span>
              <span className="text-[11px] text-[#EBEBF5]/70">{a.label}</span>
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
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      {open && <QuickActions onClose={() => setOpen(false)} />}
      <nav className="navbar" style={style}>
        <div className="navbar-content">
          {TABS.map((t) => {
            if (!t) {
              return (
                <button key="action" type="button" className={`nav-logo action-item ${open ? "is-open" : ""}`} onClick={() => setOpen((v) => !v)} aria-label="Quick actions" aria-expanded={open}>
                  <img src={logo} alt="" className="nav-icon action-icon brand-logo" />
                </button>
              );
            }
            const active = location.pathname === t.to;
            return (
              <Link key={t.to} to={t.to} className={`nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                <img src={active ? t.active : t.inactive} alt="" className="nav-icon" />
                <span className="nav-label">{t.label}</span>
                <span className="nav-dot" />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
