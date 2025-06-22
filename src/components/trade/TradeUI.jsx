"use client";
import React from "react";
import BalanceCard from "./BalanceCard";
import ActionButtons from "./ActionButtons";
import TradeStats from "./TradeStats";
import TradeActivities from "./TradeActivities";
import MarketSection from "./MarketSection";

function TradeUI() {
  return (
    <div className="flex flex-col w-full max-w-[390px] mx-auto pb-40 px-3 sm:px-6 py-6 space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-">
        <div className="md:col-span-2">
          <BalanceCard />
        </div>
        <div className="md:col-span-1">
          <ActionButtons />
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="w-full">
        <TradeStats />
      </div>
      
      {/* Activities Section */}
      <div className="w-full">
        <TradeActivities />
      </div>
      
      {/* Market Section */}
      <div className="w-full">
        <MarketSection />
      </div>
      
      {/* Call-to-action button */}
      <div className="w-full flex justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-[12px] text-white font-medium px-6 py-3 rounded-[20px] shadow-md transition-colors duration-200 w-full sm:w-auto">
          Set New Trade
        </button>
      </div>
    </div>
  );
}

export default TradeUI;