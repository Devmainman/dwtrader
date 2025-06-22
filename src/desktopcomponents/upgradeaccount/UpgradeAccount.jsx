"use client";
import React from "react";
import StatCard from "./StatCard";
import SignalStrength from "./SignalStrength";
import AccountTier from "./AccountTier";
import StatisticsCards from "../home/StatisticsCards";

function UpgradeAccount() {
  return (
    <section className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <h1 className="self-start text-3xl font-medium tracking-normal leading-tight text-zinc-100">
        Upgrade Account
      </h1>
      <div className="mt-2 w-full max-w-[1129px] max-md:max-w-full">
        <div className="mb-6">
        <StatisticsCards />
        </div>
        <SignalStrength percentage="60%" />
      </div>
      <div className="mt-5 w-full max-w-[1128px] max-md:max-w-full">
        <div className="flex flex-wrap gap-10 justify-center items-start w-full text-zinc-100 max-md:max-w-full">
          <h2 className="flex-1 shrink text-[16px] font-medium tracking-normal leading-tight basis-5 min-w-60 max-md:max-w-full">
            Account Upgrade
          </h2>
          <span className="gap-2.5 self-stretch px-2.5 py-1.5 text-[8px] font-semibold whitespace-nowrap bg-yellow-700 rounded-3xl min-h-[21px] w-[39px]">
            PRO
          </span>
        </div>
        <div className="flex flex-wrap gap-5 items-start mt-5 w-full text-stone-300 max-md:max-w-full">
          <AccountTier
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/bb52fb7e63d70d1a9991c958cd8ff3ee44ce6616b1cfb713452b560807c801e3?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Silver Level"
            price="1,000,00 NGN"
            features={[
              "Reduced Trading Fees: 20% discount on trading fees",
              "Enhanced Market Analysis: Access to bi-weekly market analysis and insights",
              "Priority Customer Support: Faster response times from support",
              "Advanced Trading Tools: Includes indicators and trend analysis tools",
              "Higher Withdrawal Limits: Increased withdrawal limits over Bronze",
            ]}
          />
          <AccountTier
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/9c01391db1f70f80ea1cbdf63d5392876cdab7bd65901d3d0c7aa3b82f4db74c?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Gold Level"
            price="2,000.00 NGN"
            features={[
              "Low Trading Fees: 30% discount on trading fees",
              "Comprehensive Market Analysis: Access to weekly reports with in-depth insights",
              "Dedicated Account Manager: Personal account manager for assistance",
              "Premium Trading Tools: Access to exclusive charting tools, indicators, and automated trading options",
              "Priority Withdrawals: Faster processing times on withdrawals",
            ]}
          />
          <AccountTier
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/040cdd8ad81e4d1c0a61025114ac8276679a64cd89689838acc6d1867adf9196?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Bronze Level"
            price="500.00 NGN"
            features={[
              "Lower Trading Fees: 10% discount on trading fees",
              "Basic Market Analysis: Access to weekly market reports and basic insights",
              "Customer Support: Access to standard customer support",
              "Basic Trading Tools: Includes price alerts, charting tools, and news updates",
              "Withdrawals: Standard withdrawal limits",
            ]}
          />
          <AccountTier
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/b469054eb549ea42322801d109f4739b2c07282a960c9cc4e87eff26f234df9f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Platinum Level"
            price="5,000.00 NGN"
            features={[
              "Minimal Trading Fees: 40% discount on trading fees",
              "Exclusive Market Insights: Daily reports and real-time market updates.",
              "VIP Customer Support: 24/7 support with the fastest response times",
              "Elite Trading Tools: Access to full trading suite, including AI-driven analysis",
              "Unlimited Withdrawals: No limit on daily withdrawals.",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default UpgradeAccount;
