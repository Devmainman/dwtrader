"use client";
import React from "react";

const ReferralLinkSection = ({ referralLink }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    // Could add a toast notification here in a real implementation
  };

  return (
    <div className="flex flex-wrap gap-2.5 items-start mt-5 w-full max-w-[1133px] max-md:max-w-full">
      <div className="flex overflow-hidden flex-col justify-center px-4 py-2.5 text-xs tracking-normal leading-none bg-blue-600 rounded-3xl border border-solid border-[color:var(--Primary-Blue,#2563EB)] text-zinc-100 w-[107px]">
        <span className="gap-1.5 self-stretch">Referral link</span>
      </div>
      <div className="flex overflow-hidden flex-wrap flex-1 shrink gap-2.5 justify-center items-center px-2.5 py-3 text-xs whitespace-nowrap rounded-md basis-3.5 bg-[#1D1D1F] min-h-9 min-w-60 text-zinc-100 max-md:max-w-full">
        <span className="flex-1 shrink self-stretch my-auto basis-0 max-md:max-w-full">
          {referralLink}
        </span>
        <button onClick={handleCopy} aria-label="Copy referral link">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c2e6ce406b846df1e32886f2ca803662ac5244a9badc7521e710fb2ee1875ad8?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
            alt="Copy icon"
          />
        </button>
      </div>
    </div>
  );
};

export default ReferralLinkSection;
