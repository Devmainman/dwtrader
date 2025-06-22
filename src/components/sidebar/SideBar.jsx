import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutItem from "./LogoutItem";
import { useSidebar } from "../../context/SidebarContext";
import dashboard from "../../assets/dashboard.svg";
import deposit from "../../assets/deposit.svg";
import notification from "../../assets/notification.svg";
import profile from "../../assets/profile.svg";
import referrals from "../../assets/referrals.svg";
import transaction from "../../assets/transaction.svg";
import tradingactivities from "../../assets/tradingactivities.svg";
import ticket from "../../assets/ticket.svg";
import upgrade from "../../assets/upgrade.svg";
import withdraw from "../../assets/withdraw.svg";
import logout from "../../assets/logout.svg";


function SideBar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  if (!isOpen) return null;

  const menuItems = [
    { name: "Dashboard", path: "/", icon: dashboard },
    { name: "Profile", path: "/settings", icon: profile },
    { name: "Trading Activities", path: "/trade", icon: tradingactivities },
    { name: "Deposit", path: "/deposite", icon: deposit },
    { name: "Withdraw", path: "/withdraw", icon: withdraw },
    { name: "Transaction History", path: "/transactionhistory", icon: transaction },
    { name: "Upgrade Account", path: "/accountupgrade", icon: upgrade },
    { name: "Notification", path: "/notification", icon: notification },
    { name: "Support Ticket", path: "/support", icon: ticket },
    { name: "Referrals", path: "/referrals", icon: referrals },
  ];

  return (
    <>
      {/* Overlay (Optional: Keep for visual effect) */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Sidebar Container */}
      <nav
        ref={sidebarRef}
        className="fixed top-0 left-0 z-[9999] overflow-hidden px-1 pt-9 pb-3.5 bg-black/90 max-w-[258px] h-full transition-transform duration-300 ease-in-out
         max-h-screen overflow-y-auto
  [&::-webkit-scrollbar]:w-[1px] 
  [&::-webkit-scrollbar-track]:bg-transparent 
  [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#EB25C6]
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button onClick={toggleSidebar} className="p-2 text-white hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Items */}
        <ul className="mt-4 w-full text-sm font-medium tracking-normal leading-tight text-stone-300">
          {menuItems.map(({ name, path, icon }, index) => {
            const isActive = location.pathname === path;
            return (
              <li
                key={index}
                className={`flex gap-2.5 items-center px-8 mt-2.5 w-full rounded-3xl min-h-[51px] transition-all ${
                  isActive ? "bg-black text-white font-semibold" : "hover:bg-white/10"
                }`}
              >
                <div
                  className="flex items-center justify-center rounded-full w-[35px] h-[35px]"
                  style={{
                    background: "linear-gradient(80deg,#EB25C6_18.83%,#0E7BF8_103.47%)",
                  }}
                >
                  <img src={icon} alt={`${name} Icon`} className="w-5 h-5" />
                </div>
                <Link to={path} className="w-full">
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <LogoutItem />
      </nav>
    </>
  );
}


export default SideBar;
