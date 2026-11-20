import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";

// Import Lucide icons
import { 
  Cpu as MiningIcon, 
  Users as UsersIcon, 
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Gift,
  User,
  Bell,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  PieChart,
  Building2,
  Layers,
  Snowflake,
  CreditCard,
  Trophy,
  Wallet, Gem } from "lucide-react";

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

function Sidebar() {
  const location = useLocation();
  const { logout } = useUserAuth();

  const [tradingGroupOpen, setTradingGroupOpen] = useState(
    ["/trademain", "/mining", "/trade"].includes(location.pathname)
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
    <nav className="top-0 left-0 h-screen w-[258px] px-1 pt-12 pb-3.5 border-r bg-zinc-900 border-neutral-600 
      max-h-screen overflow-y-auto
      [&::-webkit-scrollbar]:w-1 
      [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">

      <div className="">
        <ul className="mt-12 w-full text-[13px] font-medium tracking-normal leading-tight text-stone-300">
          {/* Dashboard */}
          <li>
            <Link
              to="/"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <Activity className="w-6 h-6" />
              </div>
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Profile */}
          <li>
            <Link
              to="/settings"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/settings" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/settings" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <User className="w-6 h-6" />
              </div>
              <span>Profile</span>
            </Link>
          </li>

          {/* TRADING GROUP */}
          <li>
            <button
              onClick={() => setTradingGroupOpen(!tradingGroupOpen)}
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                ["/trademain", "/mining", "/trade"].includes(location.pathname)
                  ? "bg-black bg-opacity-80 text-white"
                  : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  ["/trademain", "/mining", "/trade"].includes(location.pathname)
                    ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]"
                    : "bg-transparent"
                }`}
              >
                <TrendingUp className="w-5 h-5" />
              </div>

              <span className="flex-1 text-left">Trading</span>
              <span className="text-xs">{tradingGroupOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
            </button>

            {/* DROPDOWN ITEMS */}
            {tradingGroupOpen && (
              <ul className="ml-12 mt-2 space-y-2 text-xs">
                <li>
                  <Link
                    to="/trade"
                    className={`flex gap-2.5 items-center px-4 py-2 rounded-xl ${
                      location.pathname === "/trade"
                        ? "bg-zinc-800 text-white"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    <div className="p-1.5 rounded-[50%] flex items-center justify-center w-8 h-8">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span>Trading Activities</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/trademain"
                    className={`flex gap-2.5 items-center px-4 py-2 rounded-xl ${
                      location.pathname === "/trademain"
                        ? "bg-zinc-800 text-white"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    <div className="p-1.5 rounded-[50%] flex items-center justify-center w-8 h-8">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span>Live Trading</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/mining"
                    className={`flex gap-2.5 items-center px-4 py-2 rounded-xl ${
                      location.pathname === "/mining"
                        ? "bg-zinc-800 text-white"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    <div className="p-1.5 rounded-[50%] flex items-center justify-center w-8 h-8">
                      <MiningIcon className="w-4 h-4" />
                    </div>
                    <span>Mining</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* COPY TRADING - one page with Top Experts / Copying tabs */}
          <li className="mt-2">
            <Link
              to="/copytrade"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                ["/copytrade", "/copy-positions"].includes(location.pathname) ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  ["/copytrade", "/copy-positions"].includes(location.pathname)
                    ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]"
                    : "bg-transparent"
                }`}
              >
                <UsersIcon className="w-6 h-6" />
              </div>
              <span>Copy Trading</span>
            </Link>
          </li>

          {/* Wealth: Investing (stocks + real estate tabs), Real Estate, Staking, protection & spending */}
          {[
            { to: "/assets", label: "Assets", Icon: Gem },
            { to: "/invest", label: "Investing", Icon: PieChart },
            { to: "/real-estate", label: "Real Estate", Icon: Building2 },
            { to: "/staking", label: "Staking", Icon: Layers },
            { to: "/cold-storage", label: "Cold Storage", Icon: Snowflake },
            { to: "/cards", label: "Cards", Icon: CreditCard },
            { to: "/rewards", label: "Rewards", Icon: Trophy },
            { to: "/wallets", label: "Connect Wallet", Icon: Wallet },
          ].map(({ to, label, Icon }) => (
            <li key={`solo-${to}`}>
              <Link
                to={to}
                className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                  location.pathname === to ? "bg-black bg-opacity-80 text-white" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                    location.pathname === to ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span>{label}</span>
              </Link>
            </li>
          ))}

          {/* Financial Section */}
          <li>
            <Link
              to="/deposite"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/deposite" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/deposite" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <DollarSign className="w-6 h-6" />
              </div>
              <span>Deposit</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/withdraw"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/withdraw" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/withdraw" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <DollarSign className="w-6 h-6" />
              </div>
              <span>Withdraw</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/transactionhistory"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/transactionhistory" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/transactionhistory" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <BarChart3 className="w-6 h-6" />
              </div>
              <span>Transaction History</span>
            </Link>
          </li>

          {/* Account Section */}
          <li>
            <Link
              to="/accountupgrade"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/accountupgrade" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/accountupgrade" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <Activity className="w-6 h-6" />
              </div>
              <span>Upgrade Account</span>
            </Link>
          </li>
           
          <li>
            <Link
              to="/signal-packages"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/signal-packages" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/signal-packages" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <Activity className="w-6 h-6" />
              </div>
              <span>Signal Packages</span>
            </Link>
          </li>

          {/* Support & Community */}
          <li>
            <Link
              to="/notification"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/notification" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/notification" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <Bell className="w-6 h-6" />
              </div>
              <span>Notification</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/support"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/support" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/support" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <MessageSquare className="w-6 h-6" />
              </div>
              <span>Support Ticket</span>
            </Link>
          </li>
          
          <li>
            <Link
              to="/referrals"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/referrals" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/referrals" ? "bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]" : "bg-transparent"
                }`}
              >
                <Gift className="w-6 h-6" />
              </div>
              <span>Referrals</span>
            </Link>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex gap-2.5 items-center px-4 mt-12 w-full rounded-3xl min-h-[51px] text-[13px] font-medium tracking-normal leading-tight whitespace-nowrap text-stone-300 hover:bg-black/30 transition-all"
        >
          <div className="p-2 rounded-[50%] flex items-center justify-center w-10 h-10 bg-[linear-gradient(180deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]">
            <LogoutIcon />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;