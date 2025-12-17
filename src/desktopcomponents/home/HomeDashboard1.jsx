"use client";
import React from "react";
import StatisticsCards from "./StatisticsCards";
import UserProfile from "./UserProfile";
import TradingSection from "./TradingSection";
import MarketCoins from "./MarketCoins";
import NotificationPanel from "../../components/notification/NotificationPanel";
import MarketOverview from "./MarketOverview";
import TradeActivities from "../../components/trade/TradeActivities";
import PopularEarnProducts from "./PopularEarnProducts";
import TransactionList from "../../components/transactionhistory/TransactionList";
import TradingForm from "./TradingForm";
import NFTSection from "./NFTSection";

function HomeDashboard1() {
  return (
    <main className="bg-neutral-900 text-white min-h-screen px-4 sm:px-6 py-4">
      <h1 className="text-2xl sm:text-3xl font-medium mb-4">My Dashboard</h1>

      <div className="w-full flex flex-col gap-6">

        {/* Statistics Section */}
        <StatisticsCards />

        {/* Main Grid Section */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Section */}
          <div className="flex flex-col gap-6 flex-1">
            <UserProfile />
            <TradingSection />

            <div className="flex flex-col md:flex-row gap-4">
              {/* TradingForm + NFT */}
              <div className="flex flex-col gap-4 flex-1">
                <TradingForm />
                <NFTSection />
              </div>

              {/* MarketCoins + Notifications */}
              <div className="flex flex-col gap-4 flex-1">
                <MarketCoins />
                <NotificationPanel />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[350px] flex flex-col gap-4">
            <MarketOverview />
            <TradeActivities />
            <PopularEarnProducts />
            <TransactionList />
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomeDashboard1;
