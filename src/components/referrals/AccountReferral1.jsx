"use client";
import * as React from "react";
import UserProfileSection from "./UserProfileSection";
import StatisticsSection from "./StatisticsSection";
import ReferralLinkSection from "./ReferralLinkSection";
import ReferredUsersList from "./ReferredUsersList";
import ReferralBenefitsSection from "./ReferralBenefitsSection";
import TradeStats from "../trade/TradeStats";

function AccountReferral1() {
  return (
    <section className="overflow-hidden px-3 py-3 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px] md:max-w-[640px] lg:max-w-[1200px] lg:px-6 lg:py-6 lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-6 lg:items-start">
      <div className="flex flex-col justify-center px-2.5 py-5 rounded-3xl bg-[var(--card)] min-h-[194px]">
        <div className="flex flex-col justify-center w-full">
          <UserProfileSection
            avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/9855861c82e24f2b25334a5d3f5796d4f90361b305891ddd5ccfc7c1dab288e7?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            name="William Grace"
            id="RI3300676"
            accountType="Basic"
          />
          {/* Horizontal Line */}
          <hr className="border-t-[0.1px] border-[var(--line-strong)]" />

          <TradeStats />
        </div>
      </div>

      <div className="mt-5 w-full lg:mt-0">
        <ReferralLinkSection />
        <ReferredUsersList />
        <ReferralBenefitsSection />
      </div>
    </section>
  );
}

export default AccountReferral1;
