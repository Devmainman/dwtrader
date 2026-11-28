// App top bar: frosted and sticky. Phones: menu, brand, then language, appearance,
// notifications and your avatar. Desktop (sidebar visible): the page name on the left.
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useUserAuth } from "../../context/UserAuthContext";
import LanguageDropdown from "./LanguageDropdown";
import NotificationDropdown from "../notification/NotificationDropdown";
import ModeToggle from "./ModeToggle";
import useBrand from "../../lib/useBrand";
import logo from "../../assets/Group.svg";

const TITLES = {
  "/dashboard": "Home", "/trademain": "Trade", "/trade": "Investment plans", "/copytrade": "Copy trading", "/copy-positions": "Copy trading",
  "/mining": "Mining", "/ai-trader": "AI Smart Trader", "/assets": "Portfolio", "/invest": "Investing", "/real-estate": "Real estate",
  "/staking": "Staking", "/deposite": "Deposit", "/deposit/crypto": "Deposit crypto", "/withdraw": "Withdraw", "/convert": "Convert",
  "/wallet": "Assets", "/transactionhistory": "History", "/cold-storage": "Cold storage", "/cards": "Cards", "/rewards": "Rewards",
  "/wallets": "Connect wallet", "/settings": "Settings", "/accountupgrade": "Upgrade", "/signal-packages": "Signal packages",
  "/notification": "Notifications", "/support": "Support", "/opensupport": "Support", "/referrals": "Refer & earn", "/payment": "Payment",
  "/signal-payment": "Payment"
};

function MenuButton({ open, onClick }) {
  return (
    <button type="button" data-no-busy onClick={onClick} aria-label="Open menu" aria-expanded={open} className="topbar-btn lg:hidden">
      <span className="relative w-[18px] h-3.5" aria-hidden>
        <span className={`menu-line top-0 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
        <span className={`menu-line top-[6px] w-3 ${open ? "opacity-0" : ""}`} />
        <span className={`menu-line top-3 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
      </span>
    </button>
  );
}

const TopNavBar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user } = useUserAuth();
  const { pathname } = useLocation();
  const brand = useBrand();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const initials = [user?.firstName, user?.lastName].filter(Boolean).map((s) => s[0]).join("").toUpperCase() || "·";
  const title = TITLES[pathname] || TITLES[`/${pathname.split("/")[1]}`] || "";

  return (
    <header className={`topbar sticky top-0 z-[800] h-[60px] w-full flex items-center gap-2 px-4 lg:px-8 ${scrolled ? "is-scrolled" : ""}`}>
      <MenuButton open={isOpen} onClick={toggleSidebar} />
      <Link to="/dashboard" className="flex items-center gap-2 min-w-0 lg:hidden ml-1">
        <img src={logo} alt="" className="w-7 h-7 brand-logo shrink-0" />
        {brand && <span className="text-[14px] font-semibold tracking-[-0.02em] text-zinc-100 truncate max-w-[120px]">{brand}</span>}
      </Link>
      <p key={title} className="hidden lg:block text-[15px] font-semibold tracking-[-0.02em] text-zinc-100 topbar-title">{title}</p>

      <div className="ml-auto flex items-center gap-2">
        <LanguageDropdown variant="icon" />
        <ModeToggle />
        <NotificationDropdown />
        <Link to="/settings" aria-label="Your profile and settings" className="topbar-avatar">{initials}</Link>
      </div>
    </header>
  );
};

export default TopNavBar;
