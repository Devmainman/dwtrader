"use client";
import React, { useState } from "react";

const BenefitItem = ({ icon, text }) => {
  return (
    <div className="flex gap-2.5 items-center mt-3 first:mt-0 w-full">
      <img
        src={icon}
        alt="Benefit icon"
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
      />
      <p className="self-stretch my-auto w-[268px]">{text}</p>
    </div>
  );
};

const ReferralBenefitsSection = () => {
  const [isCopied, setIsCopied] = useState(false);
  const referralLink = "/register?refID=USR7719462596";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const benefits = [
    "For every 1 referrals, users receive a bonus $10 in addition to the $5 per referral.",
    "Users who refer others get 5% off on trading fees for every successful referral, lasting for 30 days.",
    "After referring 10 people, users gain VIP status for one month, which includes perks like:",
  ];

  return (
    <section className="overflow-hidden px-5 py-4 mt-2.5 w-full rounded-xl bg-[#1D1D1F]">
      <header className="flex gap-10 justify-between items-center text-[14px] font-medium tracking-normal leading-tight text-zinc-100">
        <h3 className="self-stretch my-auto">Refer Your Friends</h3>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/efdfc2630c43287f6275b2f4ac37a651522a91dac07d5a4c8aa9bdfedbc4e8d2?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Refer icon"
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
        />
      </header>

      <div className="mt-3 w-full text-[10px] text-neutral-400">
        {benefits.map((benefit, index) => (
          <BenefitItem
            key={index}
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/ec72992227cd154fb2146c3e5d8ce946243da6ff1a40a849a3ff6168b935b4d6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            text={benefit}
          />
        ))}
      </div>

      <div className="flex flex-col items-end mt-3 w-full">
        <div className="flex gap-4 items-center w-full max-w-[314px]">
          <label className="self-stretch my-auto text-[10px] text-neutral-400">
            Referral link:
          </label>
          <div className="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-2.5 py-2.5 my-auto text-[8px] whitespace-nowrap rounded-md basis-0 bg-neutral-600 min-h-7 text-zinc-100">
            {referralLink}
          </div>
        </div>
        <button
          className="flex flex-col justify-center px-1.5 py-1.5 mt-1 text-[8px] text-blue-600 min-h-[23px] w-[78px]"
          onClick={handleCopy}
        >
          <div className="flex gap-2 justify-center items-center w-full">
            <span className="self-stretch my-auto">
              {isCopied ? "Copied!" : "Copy Now"}
            </span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fd1f31c640e4a8bc61ad64aa34bd7d9e147f00417163c84ba0f049ad7bf2b6f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Copy icon"
              className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
            />
          </div>
        </button>
      </div>
    </section>
  );
};

export default ReferralBenefitsSection;
