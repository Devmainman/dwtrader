"use client";
import React from "react";

const StatItem = ({ icon, label, value, hasBorder = true }) => {
  return (
    <div
      className={`flex flex-col justify-center self-stretch px-4 py-4 w-28 ${
        hasBorder ? "border-r border-neutral-500" : ""
      }`}
    >
      <div className="flex flex-col justify-center w-full">
        <div className="flex gap-2.5 items-center w-full text-xs text-neutral-400">
          {icon && (
            <img
              src={icon}
              alt={`${label} icon`}
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
            />
          )}
          <span className="self-stretch my-auto">{label}</span>
        </div>
        <p className="mt-2.5 text-sm tracking-normal leading-tight text-center text-zinc-100">
          {value}
        </p>
      </div>
    </div>
  );
};

const StatisticsSection = () => {
  return (
    <section className="flex gap-1 items-center mt-3.5 w-full font-medium">
      <StatItem
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/367eaff211a16f1f083132f5c8c030cfbed06dd6491208092cd14d71eec84f62?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        label="Total Profit"
        value="$ 500.00"
      />
      <StatItem icon="" label="Total Trade" value="$ 250.27" />
      <StatItem
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/9bcdc510de335cff961d56e6ebcd36102e121f9f7611aea92b3419c9f91950e0?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        label="Referrals"
        value="$ 15.00"
        hasBorder={false}
      />
    </section>
  );
};

export default StatisticsSection;
