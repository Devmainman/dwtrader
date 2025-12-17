"use client";
import React from "react";
import MetricCard from "./MetricCard";
import SignalStrengthBar from "../trade/SignalStrengthBar";
import ReferralLinkSection from "../../components/referrals/ReferralLinkSection";
import CommissionsTable from "./CommissionsTable";
import ReferralInfoPanel from "./ReferralInfoPanel";
import StatisticsCards from "../home/StatisticsCards";

function Referrals() {
  const referralLink = "/register?refID=USR7719462596";

  return (
    <main className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <header className="flex items-center justify-between w-full max-md:flex-wrap">
        <h1 className="text-[28px] font-medium tracking-normal leading-tight text-zinc-100">
          Referral
        </h1>
        <div className="flex items-center gap-2.5 p-2.5 text-xs rounded-3xl bg-neutral-800 min-h-9 w-[950px] text-stone-300 max-md:w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/16a762dc4e54facae15cdcaf16e3cf4c2ceb22854bd6d9c1b71dfffd282a7387?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="w-4 aspect-square"
            alt="Search icon"
          />
          <span>Search here</span>
        </div>
      </header>



      <section className="mt-3 w-full max-w-auto max-md:mr-1 max-md:max-w-full">
        <StatisticsCards />
        <div className="mt-5">
        <SignalStrengthBar />
        </div>
      </section>

      <ReferralLinkSection referralLink={referralLink} />

    <section className="flex gap-4 mt-3 w-full max-w-auto max-md:mr-1 max-md:max-w-full">
      <CommissionsTable />
      <ReferralInfoPanel referralLink={referralLink} />
    </section>
    </main>
  );
}

export default Referrals;
