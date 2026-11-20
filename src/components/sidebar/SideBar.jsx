import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useUserAuth } from "../../context/UserAuthContext";

// Import Lucide icons
import { 
  Cpu as MiningIcon, 
  Users as UsersIcon, 
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Gift, // Add this
  User, // Add for Profile
  Bell, // Add for Notification
  MessageSquare, // Add for Support Ticket
  PieChart,
  Building2,
  Layers,
  Snowflake,
  CreditCard,
  Trophy,
  Wallet,
  Gem,
  Sparkles
} from "lucide-react";

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

function SideBar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const { logout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [tradingGroupOpen, setTradingGroupOpen] = useState(true);

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
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: dashboard, LucideIcon: Activity },
    { name: "Profile", path: "/settings", icon: profile, LucideIcon: User },
    
    // Trading Group - Only Live Trading and Mining
    {
      name: "Trading",
      isGroup: true,
      groupId: "trading",
      isOpen: tradingGroupOpen,
      toggle: () => setTradingGroupOpen(!tradingGroupOpen),
      items: [
        { 
          name: "Trading Activities", 
          path: "/trade", 
          icon: tradingactivities,
          LucideIcon: BarChart3 
        },
        { 
          name: "Live Trading", 
          path: "/trademain", 
          LucideIcon: TrendingUp 
        },
        {
          name: "AI Smart Trader",
          path: "/ai-trader",
          LucideIcon: Sparkles
        },
        {
          name: "Mining",
          path: "/mining",
          LucideIcon: MiningIcon
        },
      ]
    },

    // COPY TRADING - one page with "Top Experts" and "Copying" tabs
    { name: "Copy Trading", path: "/copytrade", LucideIcon: UsersIcon, activePaths: ["/copytrade", "/copy-positions"] },

    // Wealth: Investing (stocks + real estate tabs), Real Estate, Staking
    { name: "Assets", path: "/assets", LucideIcon: Gem },
    { name: "Investing", path: "/invest", LucideIcon: PieChart },
    { name: "Real Estate", path: "/real-estate", LucideIcon: Building2 },
    { name: "Staking", path: "/staking", LucideIcon: Layers },

    // Wealth protection & spending
    { name: "Cold Storage", path: "/cold-storage", LucideIcon: Snowflake },
    { name: "Cards", path: "/cards", LucideIcon: CreditCard },
    { name: "Rewards", path: "/rewards", LucideIcon: Trophy },
    { name: "Connect Wallet", path: "/wallets", LucideIcon: Wallet },

    // Financial Section
    { name: "Deposit", path: "/deposite", icon: deposit, LucideIcon: DollarSign },
    { name: "Withdraw", path: "/withdraw", icon: withdraw, LucideIcon: DollarSign },
    { name: "Transaction History", path: "/transactionhistory", icon: transaction, LucideIcon: BarChart3 },
    
    // Account Section
    { name: "Upgrade Account", path: "/accountupgrade", icon: upgrade, LucideIcon: Activity },
    { name: "Signal Packages", path: "/signal-packages", icon: upgrade, LucideIcon: Activity },
    
    // Support & Community
    { name: "Notification", path: "/notification", icon: notification, LucideIcon: Bell },
    { name: "Support Ticket", path: "/support", icon: ticket, LucideIcon: MessageSquare },
    { name: "Referrals", path: "/referrals", icon: referrals, LucideIcon: Gift }, // Fixed: Use Gift icon
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

  const ChevronIcon = ({ isOpen }) => (
    <svg
      className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-blue-700)]
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <div className="absolute top-2 right-2">
          <button onClick={toggleSidebar} className="p-2 text-white hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="mt-4 w-full text-[13px] font-medium tracking-normal leading-tight text-stone-300">
          {menuItems.map((item, index) => {
            if (item.isGroup) {
              const isGroupActive = item.items.some(subItem => location.pathname === subItem.path);
              
              return (
                <li key={index} className="mb-2">
                  {/* Group Header */}
                  <button
                    onClick={item.toggle}
                    className={`flex justify-between items-center w-full px-8 py-3 rounded-3xl transition-all ${
                      isGroupActive ? "bg-black/30 text-white" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex items-center justify-center rounded-full w-[35px] h-[35px]"
                        style={{
                          background: "linear-gradient(80deg,var(--color-blue-700)_18.83%,var(--color-blue-500)_103.47%)",
                        }}
                      >
                        {item.GroupIcon ? (
                          <item.GroupIcon className="w-5 h-5 text-white" />
                        ) : item.groupId === "copytrading" ? (
                          <UsersIcon className="w-5 h-5 text-white" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className="text-[13px] text-stone-300 font-medium">{item.name}</span>
                    </div>
                    <ChevronIcon isOpen={item.isOpen} />
                  </button>

                  {/* Group Items */}
                  {item.isOpen && (
                    <div className="ml-8 pl-8 mt-1 border-l border-white/20">
                      {item.items.map((subItem, subIndex) => {
                        const isActive = location.pathname === subItem.path;
                        return (
                          <div
                            key={subIndex}
                            className={`flex gap-2.5 items-center px-4 mt-2 w-full rounded-3xl min-h-[45px] transition-all ${
                              isActive ? "bg-black text-white font-semibold" : "hover:bg-white/10"
                            }`}
                          >
                            <div
                              className="flex items-center justify-center rounded-full w-[30px] h-[30px]"
                              style={{
                                background: isActive 
                                  ? "linear-gradient(80deg,var(--color-blue-700)_18.83%,var(--color-blue-500)_103.47%)"
                                  : "rgba(255,255,255,0.1)",
                              }}
                            >
                              {subItem.LucideIcon ? (
                                <subItem.LucideIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-300'}`} />
                              ) : subItem.icon ? (
                                <img src={subItem.icon} alt={`${subItem.name} Icon`} className="w-4 h-4" />
                              ) : null}
                            </div>
                            <Link to={subItem.path} className="w-full">
                              <span className={isActive ? "text-white font-medium" : "text-stone-300"}>
                                {subItem.name}
                              </span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            }

            // Regular menu items
            const isActive = item.activePaths ? item.activePaths.includes(location.pathname) : location.pathname === item.path;
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
                    background: isActive 
                      ? "linear-gradient(80deg,var(--color-blue-700)_18.83%,var(--color-blue-500)_103.47%)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  {item.LucideIcon ? (
                    <item.LucideIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-stone-300'}`} />
                  ) : item.icon ? (
                    <img src={item.icon} alt={`${item.name} Icon`} className="w-5 h-5" />
                  ) : null}
                </div>
                <Link to={item.path} className="w-full">
                  <span className={isActive ? "text-white font-medium" : "text-stone-300"}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
          
        <button
          onClick={handleLogout}
          className="flex gap-2.5 items-center px-8 mt-6 w-full rounded-3xl min-h-[51px] text-stone-300 hover:bg-white/10 transition-all"
        >
          <div
            className="flex items-center justify-center rounded-full w-[35px] h-[35px]"
            style={{
              background: "linear-gradient(80deg,var(--color-blue-700)_18.83%,var(--color-blue-500)_103.47%)",
            }}
          >
             <LogoutIcon />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </>
  );
}

export default SideBar;