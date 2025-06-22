"use client";
import React, { useState } from "react";
import StatCard from "./StatCard";
import ProgressBar from "./ProgressBar";
import BalanceDisplay from "./BalanceDisplay";
import BankWithdraw from "./bankwithdraw/MakeWithdrawal";
import BitcoinWithdraw from "./bitcoinwithdraw/MakeWithdrawal";
import EthereumWithdraw from "./ethereumwithdraw/MakeWithdrawal";
import StatisticsCards from "../home/StatisticsCards";

function SelectWithdrawalMethod() {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <main className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <h1 className="self-start text-3xl font-medium tracking-normal leading-tight text-zinc-100">
        Withdraw
      </h1>

      <section className="mt-2 pr-2 w-full max-w-auto max-md:max-w-auto">
        <div className="mb-5">
          <StatisticsCards />
        </div>

        <ProgressBar label="Signal Strength" percentage="60%" />
      

      {!activeTab && (
        <section className="flex w-fulloverflow-hidden flex-col justify-center px-5 py-6 mt-5 rounded-xl bg-[#1D1D1F] max-w-auto max-md:pl-5 max-md:max-w-full">
          <h2 className="text-sm font-medium tracking-normal leading-tight text-neutral-400 max-md:max-w-full">
            Select Withdrawal Method
          </h2>

          <BalanceDisplay
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/2596105b5beffc7bcfb9aebc59c8abbd11f3536901ee74849e2b53dcd407b3f0"
            label="Balance"
            amount="4,867.00"
          />

          <div className="flex gap-2 w-[1128px] items-end mt-8 text-xs tracking-normal max-md:max-w-auto">
            <button
              className={`flex items-center gap-2 px-30 py-8 rounded-xl border text-white font-semibold ${
                activeTab === "bank" ? "bg-neutral-700 border-white" : "bg-neutral-800 border-neutral-600"
              }`}
              onClick={() => setActiveTab("bank")}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d1b87dee10b71877ef9cfc9ac305feb7c4decf071319fa852808fd06aca6fd4"
                alt="Bank Transfer Icon"
                className="w-6 h-6"
              />
              Bank Transfer
            </button>
            <button
              className={`flex items-center gap-2 px-30 py-8 rounded-xl border text-white font-semibold ${
                activeTab === "bitcoin" ? "bg-neutral-700 border-white" : "bg-neutral-800 border-neutral-600"
              }`}
              onClick={() => setActiveTab("bitcoin")}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/213a1f00f5059c90c95156216a5627d3948c47d56fe454b5e3843d1de87b9145"
                alt="Bitcoin Icon"
                className="w-6 h-6"
              />
              Bitcoin
            </button>
            <button
              className={`flex items-center gap-2 px-30 py-8 rounded-xl border text-white font-semibold ${
                activeTab === "ethereum" ? "bg-neutral-700 border-white" : "bg-neutral-800 border-neutral-600"
              }`}
              onClick={() => setActiveTab("ethereum")}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/273cd2ac58ca3b2189e2eae007210915e395c1e759cc4a6289cf13cd7b48a9e8"
                alt="Ethereum Icon"
                className="w-6 h-6"
              />
              Ethereum
            </button>
          </div>
        </section>
      )}
</section>
      {/* Conditionally render the selected withdrawal method */}
      {activeTab === "bank" && <BankWithdraw />}
      {activeTab === "bitcoin" && <BitcoinWithdraw />}
      {activeTab === "ethereum" && <EthereumWithdraw />}
    </main>
  );
}

export default SelectWithdrawalMethod;
