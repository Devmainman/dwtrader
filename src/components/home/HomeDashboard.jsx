"use client";
import React from "react";

import { Portfolio, ActionBar, Assets, Markets, Activity } from "./Dash";
import MarketOverview from "./MarketOverview";
import TradingChart from "./TradingChart";
import TradingPackage from "./TradingPackage";
import { useDesktop, DesktopPositions } from "../desktop/DashboardExtras";

const Label = ({ children }) => <p className="px-1 pt-2 text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500">{children}</p>;

// Every block shows live data: wallets, Binance prices and history, the ledger, positions.
function HomeDashboard() {
  const desktop = useDesktop();

  if (desktop) {
    return (
      <section className="w-full max-w-[1280px] mx-auto px-6 py-6 pb-10 text-white">
        <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0 space-y-4">
            <Portfolio chartHeight={230} />
            <div className="grid grid-cols-2 gap-4 items-start">
              <Assets limit={6} />
              <Markets rows={7} />
            </div>
            <Label>Trade</Label>
            <TradingChart />
            <DesktopPositions />
          </div>
          <div className="w-[340px] xl:w-[360px] shrink-0 space-y-4 lg:sticky lg:top-[84px]">
            <ActionBar />
            <Activity limit={7} />
            <MarketOverview />
            <TradingPackage />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-x-hidden px-4 sm:px-5 pb-35 pt-3 sm:pt-5 mx-auto w-full max-w-[440px] md:max-w-[640px] text-white">
      <div className="space-y-3 w-full">
        <Portfolio />
        <ActionBar />
        <Assets limit={4} />
        <Markets />
        <Activity limit={5} />
        <Label>Trade</Label>
        <MarketOverview />
        <TradingChart />
        <TradingPackage />
      </div>
    </section>
  );
}

export default HomeDashboard;
