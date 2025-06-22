"use client";
import React from "react";

import WalletSection from "./WalletSection";
import MarketOverview from "./MarketOverview";
import TradingChart from "./TradingChart";
import TradingPackage from "./TradingPackage";
import CryptoList from "./CryptoList";
import EarnProducts from "./EarnProducts";
import TradingNFTs from "./TradingNFTs";

function HomeDashboard() {
  return (
    <section className="overflow-x-hidden px-4 sm:px-5 pb-35 py-4 sm:py-6 mx-auto w-full max-w-[390px] bg-neutral-900 rounded-3xl text-white">
      <div className="space-y-4 w-full">
        <WalletSection />
        <MarketOverview />
        <TradingChart />
        <TradingPackage />
        <CryptoList />
        <EarnProducts />
        <TradingNFTs />
      </div>
    </section>
  );
}

export default HomeDashboard;
