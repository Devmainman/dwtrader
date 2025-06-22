import React from "react";
import { Link, useLocation } from "react-router-dom";
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

function Sidebar() {
  const location = useLocation();

  return (
    <nav className="top-0 left-0 h-screen w-[258px] px-1 pt-12 pb-3.5 border-r bg-zinc-900 border-neutral-600 
  max-h-screen overflow-y-auto
  [&::-webkit-scrollbar]:w-1 
  [&::-webkit-scrollbar-track]:bg-transparent 
  [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">

     
      <div className="">
        <ul className="mt-12 w-full text-[14px] font-medium tracking-normal leading-tight text-stone-300">
          <li>
            <Link
              to="/"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={dashboard} alt="Logo" className="w-6 h-6" />
              </div>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/trade"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/trade" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
             <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/trade" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={tradingactivities} alt="Logo" className="w-5 h-5" />
              </div>
              <span>Trading Activities</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/settings" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
             <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/settings" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={profile} alt="Logo" className="w-6 h-6" />
              </div>
              <span>Profile</span>
            </Link>
          </li>
         
          <li>
            <Link
              to="/deposite"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/deposite" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/deposite" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={deposit} alt="Logo" className="w-6 h-6" />
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
                  location.pathname === "/withdraw" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={withdraw} alt="Logo" className="w-6 h-6" />
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
                  location.pathname === "/transactionhistory" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={transaction} alt="Logo" className="w-6 h-6" />
              </div>
              <span>Transaction History</span>
            </Link>
          </li>
          <li>
            <Link
              to="/accountupgrade"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/accountupgrade" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
             <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/accountupgrade" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={upgrade} alt="Logo" className="w-6 h-6" />
              </div>
              <span>Upgrade Account</span>
            </Link>
          </li>
          <li>
            <Link
              to="/notification"
              className={`flex gap-2.5 items-center px-4 w-full rounded-3xl min-h-[51px] ${
                location.pathname === "/notification" ? "bg-black bg-opacity-80 text-white" : ""
              }`}
            >
              <div
                className={`p-2 rounded-[50%] flex items-center justify-center w-10 h-10 ${
                  location.pathname === "/notification" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={notification} alt="Logo" className="w-6 h-6" />
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
                  location.pathname === "/support" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={ticket} alt="Logo" className="w-6 h-6" />
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
                  location.pathname === "/referrals" ? "bg-[linear-gradient(180deg,#EB25C6_0%,#0E7BF8_100%)]" : "bg-transparent"
                }`}
              >
                <img src={referrals} alt="Logo" className="w-6 h-6" />
              </div>
              <span>Referrals</span>
            </Link>
          </li>
        </ul>
        <div className="flex gap-2.5 items-center px-4 mt-12 text-sm font-medium tracking-normal leading-tight whitespace-nowrap border-t border-neutral-600 min-h-[51px] text-stone-300 max-md:px-5 max-md:mt-10 max-md:ml-0.5">
        
        <img
                  src={logout}
                  alt="Logo"
               />
        <span className="self-stretch my-auto">Logout</span>
      </div>
      </div>
      
    </nav>
  );
}

export default Sidebar;
