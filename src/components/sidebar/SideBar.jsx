import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useUserAuth } from "../../context/UserAuthContext";

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
  const { logout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout(); // Handles redirection
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  

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

  const LogoutIcon = () => (
    <svg
      className="w-5 h-5 stroke-white"
      fill="none"
      viewBox="0 0 24 25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4771 21.7451H8.3401C7.04824 21.8042 5.78507 21.3522 4.82389 20.4871C3.86272 19.6219 3.28082 18.4131 3.2041 17.1221V7.87814C3.28082 6.5872 3.86272 5.37838 4.82389 4.51321C5.78507 3.64804 7.04824 3.19608 8.3401 3.25514H13.4761"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.7951 12.5H7.44214"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M16.083 17.6363L20.487 13.2323C20.68 13.0375 20.7882 12.7744 20.7882 12.5003C20.7882 12.2261 20.68 11.963 20.487 11.7683L16.083 7.36426"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998] pointer-events-auto" />
      <nav
        ref={sidebarRef}
        className="fixed top-0 left-0 z-[9999] px-1 pt-9 pb-3.5 bg-black/90 max-w-[258px] h-full max-h-screen overflow-y-auto transition-transform duration-300 ease-in-out
        [&::-webkit-scrollbar]:w-[1px]
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#EB25C6]
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <div className="absolute top-2 right-2">
          <button onClick={toggleSidebar} className="p-2 text-white hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
          
        <button
          onClick={handleLogout}
          className="flex gap-2.5 items-center px-8 mt-6 w-full rounded-3xl min-h-[51px] text-stone-300 hover:bg-white/10"
        >
          <div
            className="flex items-center justify-center rounded-full w-[35px] h-[35px]"
            style={{
              background:
                "linear-gradient(80deg,#EB25C6_18.83%,#0E7BF8_103.47%)",
            }}
          >
             <LogoutIcon />
          </div>
          Logout
        </button>
      </nav>
    </>
  );
}

export default SideBar;
