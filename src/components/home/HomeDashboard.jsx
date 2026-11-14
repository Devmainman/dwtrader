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
    <section className="overflow-x-hidden px-4 sm:px-5 pb-35 py-4 sm:py-6 mx-auto w-full max-w-[390px] md:max-w-[640px] lg:max-w-[1400px] lg:px-6 lg:pb-10 bg-neutral-900 rounded-3xl text-white">
      {/* Phones: one column (unchanged). Desktop: the same sections in a two-column grid. */}
      <div className="space-y-4 w-full lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-5 lg:items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 lg:bg-[#1D1D1F] lg:rounded-2xl lg:p-5 lg:border lg:border-white/5 lg:p-6"><WalletSection /></div>
        <div className="lg:col-span-5 xl:col-span-4 lg:flex"><MarketOverview /></div>
        <div className="lg:col-span-7 xl:col-span-8"><TradingChart /></div>
        <div className="lg:col-span-5 xl:col-span-4 lg:self-start"><TradingPackage /></div>
        <div className="lg:col-span-7 xl:col-span-8 lg:bg-[#1D1D1F] lg:rounded-2xl lg:p-5 lg:border lg:border-white/5"><CryptoList /></div>
        <div className="lg:col-span-5 xl:col-span-4 lg:bg-[#1D1D1F] lg:rounded-2xl lg:p-5 lg:border lg:border-white/5"><EarnProducts /></div>
        <div className="lg:col-span-12 lg:bg-[#1D1D1F] lg:rounded-2xl lg:p-5 lg:border lg:border-white/5"><TradingNFTs /></div>
      </div>
    </section>
  );
}

export default HomeDashboard;
