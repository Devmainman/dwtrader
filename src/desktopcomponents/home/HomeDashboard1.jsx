"use client";
import React from "react";
import StatisticsCards from "./StatisticsCards";
import UserProfile from "./UserProfile";
import TradingSection from "./TradingSection";
import MarketCoins from "./MarketCoins";
import NotificationSection from "./NotificationSection";
import MarketOverview from "./MarketOverview";
import TradeActivities from "./TradeActivities";
import PopularEarnProducts from "./PopularEarnProducts";
import RecentTransactions from "./RecentTransactions";
import TradingForm from "./TradingForm";
import NFTSection from "./NFTSection";

function HomeDashboard1() {
  return (
    <main className="bg-neutral-900 text-white min-h-screen px- sm:px-2 py-2">
      <h1 className="text-2xl sm:text-3xl font-medium mb-4">My Dashboard</h1>

      <div className="w-full flex flex-col gap-2">

        {/* Statistics Section */}
        <StatisticsCards />

        {/* Main Grid Section */}
        <div className="flex flex-col lg:flex-row gap-">

          {/* Left Section */}
          <div className="flex flex flex-col gap-6">
            <UserProfile />
            <TradingSection />

            <div className="flex flex-col md:flex-row gap-">
              {/* TradingForm + NFT */}
              <div className="flex flex flex-col ">
                <TradingForm />
                <NFTSection />
              </div>

              {/* MarketCoins + Notifications */}
              <div className="flex-1 flex flex-col gap-">
                <MarketCoins />
                <NotificationSection />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[350px] flex flex-col gap-">
            <MarketOverview />
            <TradeActivities />
            <PopularEarnProducts />
            <RecentTransactions />
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomeDashboard1;
