// Phone drawer (below 1024px). Slides in from the left with a spring, closes on the
// backdrop, Escape, a swipe left or any navigation. Same links as the desktop sidebar.
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, LogOut, ChevronRight, Crown } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { useUserAuth } from "../../context/UserAuthContext";
import { useBalance } from "../../context/BalanceContext";
import { NAV_GROUPS } from "../desktop/DesktopSidebar";
import { ModeSwitch } from "../navigation/ModeToggle";
import { formatMoney } from "../products/ui";
import useBrand from "../../lib/useBrand";
import logo from "../../assets/Group.svg";

function SideBar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useUserAuth();
  const balance = useBalance();
  const { pathname } = useLocation();
  const brand = useBrand();
  const [mounted, setMounted] = useState(isOpen);
  const [leaving, setLeaving] = useState(false);
  const touch = useRef(null);
  const panel = useRef(null);

  // Keep the drawer on screen while it animates out.
  useEffect(() => {
    if (isOpen) { setMounted(true); setLeaving(false); return undefined; }
    if (!mounted) return undefined;
    setLeaving(true);
    const t = setTimeout(() => { setMounted(false); setLeaving(false); }, 260);
    return () => clearTimeout(t);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => { if (isOpen) toggleSidebar(); };
  useEffect(() => { close(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  const isOn = (it) => pathname === it.to || pathname.startsWith(`${it.to}/`) || (it.also || []).some((p) => pathname.startsWith(p));
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "";
  const initials = [user?.firstName, user?.lastName].filter(Boolean).map((s) => s[0]).join("").toUpperCase() || "·";
  let i = 0; // running index for the staggered entrance

  // Swipe left to close.
  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, dx: 0 }; };
  const onTouchMove = (e) => {
    if (!touch.current) return;
    const dx = Math.min(0, e.touches[0].clientX - touch.current.x);
    touch.current.dx = dx;
    if (panel.current) panel.current.style.transform = `translateX(${dx}px)`;
  };
  const onTouchEnd = () => {
    const dx = touch.current?.dx || 0;
    touch.current = null;
    if (panel.current) panel.current.style.transform = "";
    if (dx < -70) close();
  };

  return (
    <div className="lg:hidden fixed inset-0 z-[9998]" role="dialog" aria-modal="true" aria-label="Menu">
      <div className={`absolute inset-0 bg-black/55 backdrop-blur-[3px] ${leaving ? "drawer-fade-out" : "drawer-fade-in"}`} onClick={close} />
      <nav ref={panel} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        className={`drawer absolute top-0 left-0 h-full w-[min(84vw,320px)] flex flex-col bg-[var(--page)] border-r border-white/[.07] shadow-2xl ${leaving ? "drawer-out" : "drawer-in"}`}>
        {/* Brand + close */}
        <div className="flex items-center gap-2.5 px-4 h-[60px] shrink-0">
          <img src={logo} alt="" className="w-7 h-7 brand-logo" />
          <span className="flex-1 text-[14px] font-semibold tracking-[-0.02em] text-zinc-100 truncate">{brand || "Menu"}</span>
          <button type="button" data-no-busy onClick={close} className="topbar-btn !w-9 !h-9" aria-label="Close menu"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* You */}
          <Link to="/settings" className="drawer-item block dash-panel !rounded-[20px] p-3.5 mb-4" style={{ animationDelay: "40ms" }}>
            <div className="flex items-center gap-3">
              <span className="topbar-avatar !w-11 !h-11 !text-[14px]">{initials}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-zinc-100 truncate">{name}</p>
                <p className="text-[11px] text-neutral-500 tabular-nums">{balance?.currency ? formatMoney(balance.balance || 0, balance.currency) : ""}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-600/10 border border-blue-500/15 px-3 py-2">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400"><Crown className="w-3.5 h-3.5" />{user?.accountTypeName || "Basic"} plan</span>
              <span className="text-[11px] text-neutral-400">Upgrade</span>
            </div>
          </Link>

          {NAV_GROUPS.map((g, gi) => (
            <div key={gi} className={gi ? "mt-4" : ""}>
              {g.title && <p className="drawer-item px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500" style={{ animationDelay: `${60 + i++ * 18}ms` }}>{g.title}</p>}
              <ul>
                {g.items.map((it) => {
                  const on = isOn(it);
                  return (
                    <li key={it.to} className="drawer-item" style={{ animationDelay: `${60 + i++ * 18}ms` }}>
                      <Link to={it.to} aria-current={on ? "page" : undefined}
                        className={`group relative flex items-center gap-3 h-11 px-3 rounded-2xl transition-colors ${on ? "bg-white/[.07] text-zinc-100" : "text-neutral-400 hover:text-zinc-100 hover:bg-white/[.04]"}`}>
                        {on && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-blue-500 drawer-bar" />}
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${on ? "bg-blue-600 text-white shadow-[0_6px_14px_-6px_var(--color-blue-600)]" : "bg-white/[.04] group-hover:bg-white/[.07]"}`}>
                          <it.icon className="w-4 h-4" strokeWidth={1.9} />
                        </span>
                        <span className="text-[13px] font-medium">{it.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="shrink-0 border-t border-white/[.07] p-3 space-y-2.5 pb-[calc(env(safe-area-inset-bottom)+12px)]">
          <ModeSwitch />
          <button type="button" onClick={() => logout?.()} className="w-full h-11 rounded-2xl flex items-center justify-center gap-2 text-[13px] font-semibold text-red-400 bg-red-500/[.08] hover:bg-red-500/[.14] transition">
            <LogOut className="w-4 h-4" />Sign out
          </button>
        </div>
      </nav>
    </div>
  );
}

export default SideBar;
