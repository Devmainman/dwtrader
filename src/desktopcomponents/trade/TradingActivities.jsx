"use client";
import React from "react";
import SearchBar from "./SearchBar";
import MetricCard from "./MetricCard";
import SignalStrengthBar from "./SignalStrengthBar";
import StatisticsCards from "../home/StatisticsCards";
import TradeActivities from "../../components/trade/TradeActivities";

function TradingActivities() {
  return (
    <main className="flex flex-col w-full max-w-[1229px] mx-auto pt-4 px-0 pb-16 bg-neutral-900 min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 w-full mb-6">
        <h1 className="text-[24px] md:text-[28px] font-medium text-zinc-100 whitespace-nowrap">
          Trading Activities
        </h1>
        <div className="w-full sm:w-auto">
          <SearchBar />
        </div>
      </header>

      {/* Main Section */}
      <section className="flex flex-col gap-6 w-full">
        {/* Dashboard Stats */}
        <StatisticsCards />

        {/* Additional Metrics */}
        <div className="flex flex-col gap-4">
          {/* You can map MetricCard components here if needed */}
          <SignalStrengthBar percentage={60} />
          <TradeActivities />
        </div>
      </section>
    </main>
  );
}

export default TradingActivities;
