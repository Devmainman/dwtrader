"use client";
import React, { useState } from "react";
import SubscriptionTier from "./SubscriptionTier";
import TierSelector from "./TierSelector";
import ProceedButton from "./ProceedButton";

const AccountUpgrade = () => {
  const [selectedTier, setSelectedTier] = useState("Bronze Level");

  const proFeatures = [
    "Low Trading Fees: 30% discount on trading fees",
    "Comprehensive Market Analysis: Access to weekly reports with in-depth insights",
    "Dedicated Account Manager: Personal account manager for assistance",
    "Premium Trading Tools: Access to exclusive charting tools, indicators, and automated trading options",
    "Priority Withdrawals: Faster processing times on withdrawals",
  ];

  const basicFeatures = [
    "Lower Trading Fees: 10% discount on trading fees",
    "Basic Market Analysis: Access to weekly market reports and basic insights",
    "Customer Support: Access to standard customer support",
    "Basic Trading Tools: Includes price alerts, charting tools, and news updates",
    "Withdrawals: Standard withdrawal limits",
  ];

  return (
    <section className="flex flex-col items-end px-20 max-w-[513px] max-md:pl-5">
      <article className="flex overflow-hidden flex-col items-start pt-32 pr-5 pb-16 w-full rounded-3xl bg-neutral-900 max-w-[390px] max-md:pt-24">
        <header className="flex gap-10 justify-center items-start ml-5 text-zinc-100 max-md:ml-2.5">
          <h2 className="text-base font-medium tracking-normal leading-tight w-[226px]">
            Account Upgrade
          </h2>
          <span className="gap-2.5 self-stretch px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap bg-yellow-700 rounded-3xl min-h-[21px] w-[39px]">
            PRO
          </span>
        </header>

        <div className="flex gap-7 items-center self-stretch mt-6">
          {/* Left subscription tier - hidden on mobile */}
          <SubscriptionTier
            features={proFeatures}
            className="flex overflow-hidden flex-col items-start self-stretch py-5 pr-1.5 my-auto rounded-2xl border border-solid bg-zinc-900 border-neutral-600 w-[243px] max-md:hidden"
            buttonClassName="overflow-hidden gap-2 self-stretch py-2.5 pr-2 mt-6 text-xs tracking-normal leading-none whitespace-nowrap rounded-2xl border-solid border-[0.85px] border-[color:var(--Primary-Blue,#2563EB)] min-h-[30px] text-zinc-100"
            showIcons={false}
          />

          {/* Center subscription tier - visible on all devices */}
          <SubscriptionTier
            features={basicFeatures}
            className="overflow-hidden self-stretch px-6 py-6 my-auto rounded-3xl border border-solid bg-zinc-900 border-neutral-600 min-w-60 w-[286px] max-md:px-5"
            buttonClassName="overflow-hidden gap-2.5 self-stretch p-2.5 mt-5 text-xs tracking-normal leading-none whitespace-nowrap rounded-3xl border border-solid border-[color:var(--Primary-Blue,#2563EB)] min-h-[35px] text-zinc-100"
            showIcons={true}
            showImage={true}
          />

          {/* Right subscription tier - hidden on mobile */}
          <div className="flex overflow-hidden flex-col items-start self-stretch py-5 pl-1.5 my-auto rounded-2xl border border-solid bg-zinc-900 border-neutral-600 w-[244px] max-md:hidden">
            <div className="w-full">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`flex gap-2 items-center w-full ${
                    index > 0 ? "mt-3.5" : ""
                  }`}
                >
                  <div className="flex self-stretch my-auto w-0.5 min-h-[21px]" />
                </div>
              ))}
            </div>
            <button className="overflow-hidden gap-2.5 self-stretch py-2.5 pl-2.5 mt-6 text-xs tracking-normal leading-none whitespace-nowrap rounded-2xl border-solid border-[0.853px] border-[color:var(--Primary-Blue,#2563EB)] min-h-[30px] text-zinc-100">
              Subscribe
            </button>
          </div>
        </div>

        <footer className="flex flex-col mt-24 ml-5 w-full text-xs tracking-normal leading-none text-zinc-100 max-md:mt-10 max-md:ml-2.5">
          <TierSelector
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
          />

          <ProceedButton price="500,00 NGN" />
        </footer>
      </article>
    </section>
  );
};

export default AccountUpgrade;
