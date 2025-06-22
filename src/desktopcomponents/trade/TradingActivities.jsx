"use client";
import React from "react";
import SearchBar from "./SearchBar";
import MetricCard from "./MetricCard";
import SignalStrengthBar from "./SignalStrengthBar";
import StatisticsCards from "../home/StatisticsCards";
import TradeActivities from "../../components/trade/TradeActivities"; // If not used, you can remove this import

function TradingActivities() {
  return (
    <main className="flex flex-col w-[1111px] pt-4 px-4 pb-16 bg-neutral-900 min-h-screen overflow-x-hidden">

  <header className="flex flex-wrap items-center justify-between gap-4 w-full mb-6">
    <h1 className="text-[24px] md:text-[28px] font-medium text-zinc-100 whitespace-nowrap">
      Trading Activities
    </h1>
    <div className="w-full sm:w-auto">
      <SearchBar />
    </div>
  </header>

  <section className="flex flex-col gap-1 w-[1111px]">
   <StatisticsCards />
    <div className="flex flex-col gap-3 justify-start sm:justify-center">
      {/* MetricCard components (add responsive widths inside those) */}
    
    <SignalStrengthBar percentage={60} />
    <TradeActivities />
    </div>

    
  </section>
</main>


  );
}

export default TradingActivities;
