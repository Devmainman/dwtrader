"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import receive from "../../assets/game-icons_receive-money.svg";
import gift from "../../assets/gift.svg";
import userAdd from "../../assets/user-add.svg";
import { API_BASE_URL } from "../../api/config";
import { AnimatedNumber } from "../products/ui";
import { toast } from "../../lib/toast";
import { Search, Check, X, ChevronRight, PieChart, ArrowDownToLine, ArrowUpFromLine, History, Wallet, Layers, Cpu, Users } from "lucide-react";

// Quick sheets opened by the My Wallet and Reward pills.
const SHEETS = {
  wallet: {
    title: "My wallet",
    note: "Everything about your money, one tap away.",
    items: [
      { to: "/assets", icon: PieChart, label: "Assets", text: "Everything you own, valued together" },
      { to: "/deposite", icon: ArrowDownToLine, label: "Deposit", text: "Add money to your balance" },
      { to: "/withdraw", icon: ArrowUpFromLine, label: "Withdraw", text: "Send money out" },
      { to: "/transactionhistory", icon: History, label: "Transaction history", text: "Every deposit, withdrawal and payout" },
      { to: "/wallets", icon: Wallet, label: "Connected wallets", text: "Crypto wallets linked to your account" },
    ],
  },
  reward: {
    title: "Rewards",
    note: "Ways your balance earns more.",
    items: [
      { to: "/staking", icon: Layers, label: "Staking rewards", text: "Earn daily on locked coins" },
      { to: "/mining", icon: Cpu, label: "Mining output", text: "Rigs pay into your balance" },
      { to: "/referrals", icon: Users, label: "Referral bonus", text: "Earn when friends join" },
    ],
  },
};

function QuickSheet({ sheet, onClose, onGo }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div className="fixed inset-0 z-[9000] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label={sheet.title}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fade-in_200ms_ease_both]" onClick={onClose} />
      <div className="relative w-full md:max-w-sm bg-[#1C1C1E] border border-white/10 rounded-t-[28px] md:rounded-[28px] shadow-2xl animate-[sheet-in_420ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="mx-auto mt-2 w-9 h-1 rounded-full bg-white/20 md:hidden" />
        <div className="flex items-center justify-between px-5 pt-3 pb-2">
          <div>
            <p className="text-sm font-semibold text-zinc-100">{sheet.title}</p>
            <p className="text-[11px] text-neutral-500">{sheet.note}</p>
          </div>
          <button type="button" onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-neutral-400" aria-label="Close"><X className="w-3.5 h-3.5" /></button>
        </div>
        <ul className="px-2 pb-[calc(env(safe-area-inset-bottom)+14px)]">
          {sheet.items.map((it, i) => (
            <li key={it.to} style={{ animationDelay: `${i * 30}ms` }} className="animate-[rise-in_300ms_ease_both]">
              <button type="button" onClick={() => onGo(it.to)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 active:scale-[0.98] transition">
                <span className="w-9 h-9 rounded-full bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0"><it.icon className="w-4 h-4" strokeWidth={1.9} /></span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-zinc-100">{it.label}</span>
                  <span className="block text-[11px] text-neutral-500 truncate">{it.text}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  );
}

function WalletSection() {
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null); // "wallet" | "reward" | null
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyQuery, setCurrencyQuery] = useState("");
  const [switching, setSwitching] = useState("");

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/account/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch balance");

      const { data } = await res.json();
      setBalanceData(data);
      setSelectedCurrency(data.currency); // track active currency
    } catch (err) {
      console.error("Balance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const res = await fetch(`${API_BASE_URL}/users/currencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      const json = await res.json();
  
      if (!json?.data || !Array.isArray(json.data)) {
        setCurrencies([]);
        return;
      }
  
      setCurrencies(json.data);
    } catch (err) {
      console.error("Currency fetch error:", err);
      setCurrencies([]);
    }
  };
  
  

  const updateCurrency = async (currencyCode) => {
    if (currencyCode === selectedCurrency) { setShowCurrencyDropdown(false); return; }
    setSwitching(currencyCode);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/users/preferences`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ currency: currencyCode }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Could not change currency");
      const from = selectedCurrency;
      setSelectedCurrency(currencyCode);
      setShowCurrencyDropdown(false);
      setCurrencyQuery("");
      await fetchBalance();
      toast.success(`Balance now in ${currencyCode}`, {
        description: json.rate ? `Converted at 1 ${from} = ${Number(json.rate).toLocaleString("en-US", { maximumSignificantDigits: 6 })} ${currencyCode}` : undefined,
      });
    } catch (err) {
      toast.error(err.message || "Could not change currency");
    } finally {
      setSwitching("");
    }
  };

  const getCurrencySymbol = (currencyCode) => {
    try {
      const formatted = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(1);
  
      // Extract symbol by removing the "1" from the formatted string
      return formatted.replace(/1/g, '').trim();
    } catch (err) {
      return currencyCode; // fallback
    }
  };
  

  useEffect(() => {
    getCurrencySymbol();
    fetchBalance();
    fetchCurrencies();
    const interval = setInterval(fetchBalance, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !balanceData) {
    return (
      <div className="flex flex-col max-w-full text-[10px] w-[156px]">
        <h2 className="text-stone-300">Current Balance</h2>
        <div className="h-8 mt-1.5 bg-neutral-700 rounded animate-pulse"></div>
        <div className="h-4 mt-1.5 bg-neutral-700 rounded animate-pulse w-3/4"></div>
      </div>
    );
  }
  
  // ✅ Compute balance here:
  const computedBalance =
    balanceData?.rawBalance && balanceData?.rate
      ? balanceData.rawBalance * balanceData.rate
      : balanceData?.balance ?? 0;
  

  // My Wallet and Reward open a quick sheet; Refer2Earn and Receive go straight to their page.
  const buttons = [
    { title: "My Wallet", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dcd09ccda7422eb1961e4dd5192988764591da463acc92bc3c2a51b77bbf01b0?placeholderIfAbsent=true", sheet: "wallet" },
    { title: "Reward", icon: gift, sheet: "reward" },
    { title: "Refer2Earn", icon: userAdd, to: "/referrals" },
    { title: "Receive", icon: receive, to: "/deposite" },
  ];

  return (
    <section className="w-full relative">
      <div className="flex overflow-x-auto items-center text-[clamp(0.625rem,1vw,0.75rem)] text-stone-300 gap-2 w-full px-2 whitespace-nowrap hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
        {buttons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={() => (btn.sheet ? setSheet(btn.sheet) : navigate(btn.to))}
            className={`flex items-center gap-1 px-2 py-1 flex-shrink-0 whitespace-nowrap rounded-full border-2 border-solid transition-all duration-200 active:scale-95 hover:border-neutral-600 ${sheet && sheet === btn.sheet ? "border-blue-500/60" : "border-neutral-800"}`}
          >
            <img src={btn.icon} className="object-contain w-4 h-4 rounded-full" alt={`${btn.title} icon`} />
            <span className="text-center">{btn.title}</span>
            {btn.sheet && (
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b709d68c4907d194d0fea4be3a83f2b9ab9df95150216f7881181d4183b92cca?placeholderIfAbsent=true"
                className="object-contain w-3.5 h-3.5"
                alt=""
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col justify-center mt-3 w-full">
        <p className="text-left text-[clamp(0.625rem,1vw,0.75rem)] text-stone-300">Current Balance</p>

        <div className="flex justify-between items-center mt-3 w-full whitespace-nowrap">
          <div className="flex gap-1 items-center text-[clamp(1.75rem,4vw,2rem)] font-medium tracking-wide leading-tight text-zinc-100 relative">
            <div className="flex items-center cursor-pointer" onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
            <span className="text-xl font-bold">
            {getCurrencySymbol(selectedCurrency)}
            </span>

            <AnimatedNumber
              className="ml-1"
              value={balanceData.balance}
              format={(n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            />

              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/70c54a492ef2cc51c02fd96eb404cf1be4a19214c0947459d4589fe00f397e54?placeholderIfAbsent=true"
                className="object-contain w-5 aspect-square ml-2"
                alt="Dropdown icon"
              />
            </div>

          </div>

          <Link
            to="/deposite"
            className="p-2 text-[clamp(0.625rem,1vw,0.75rem)] tracking-normal leading-none text-center bg-blue-600 rounded-3xl text-zinc-100 w-[86px]"
          >
            Deposit
          </Link>
        </div>
      </div>
      {sheet && <QuickSheet sheet={SHEETS[sheet]} onClose={() => setSheet(null)} onGo={(to) => { setSheet(null); navigate(to); }} />}
      {showCurrencyDropdown && createPortal(
        <div className="fixed inset-0 z-[9000] flex items-end md:items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fade-in_200ms_ease_both]" onClick={() => setShowCurrencyDropdown(false)} />
          <div className="relative w-full md:max-w-sm max-h-[80dvh] flex flex-col bg-[#1C1C1E] border border-white/10 rounded-t-[28px] md:rounded-[28px] shadow-2xl animate-[sheet-in_420ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <div className="mx-auto mt-2 w-9 h-1 rounded-full bg-white/20 md:hidden" />
            <div className="flex items-center justify-between px-5 pt-3 pb-2">
              <div>
                <p className="text-sm font-semibold text-zinc-100">Display currency</p>
                <p className="text-[11px] text-neutral-500">Your balance converts at today&apos;s market rate.</p>
              </div>
              <button type="button" onClick={() => setShowCurrencyDropdown(false)} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-neutral-400" aria-label="Close"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="px-5 pb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input value={currencyQuery} onChange={(e) => setCurrencyQuery(e.target.value)} placeholder="Search currency" className="w-full h-9 pl-8 pr-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
            </div>
            <ul className="overflow-y-auto px-2 pb-[calc(env(safe-area-inset-bottom)+12px)]">
              {currencies
                .filter((cur) => !currencyQuery || `${cur.code} ${cur.title}`.toLowerCase().includes(currencyQuery.toLowerCase()))
                .map((cur, i) => (
                  <li key={cur.code} style={{ animationDelay: `${Math.min(i, 10) * 18}ms` }} className="animate-[rise-in_300ms_ease_both]">
                    <button
                      type="button"
                      disabled={!!switching}
                      onClick={() => updateCurrency(cur.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition active:scale-[0.98] ${cur.code === selectedCurrency ? "bg-blue-500/10" : "hover:bg-white/5"}`}
                    >
                      <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-xs font-semibold text-zinc-200">{getCurrencySymbol(cur.code).slice(0, 3)}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-zinc-100">{cur.code}</span>
                        <span className="block text-[11px] text-neutral-500 truncate">{cur.title}</span>
                      </span>
                      {switching === cur.code ? <span className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                        : cur.code === selectedCurrency && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

export default WalletSection;
