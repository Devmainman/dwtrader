"use client";
import React from "react";
import TradeStats from "../trade/TradeStats";
import UserProfileSection from "../referrals/UserProfileSection";

function ProfileCard() {
  return (
   
      <div className="flex flex-col justify-center px-2.5 py-1 rounded-3xl bg-[var(--card)] min-h-[194px]">
        <div className="flex flex-col justify-center w-full">
          <UserProfileSection
            avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/9855861c82e24f2b25334a5d3f5796d4f90361b305891ddd5ccfc7c1dab288e7?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            name="William Grace"
            id="RI3300676"
            accountType="Basic"
          />
          {/* Horizontal Line */}
          <hr className="border-t-[0.1px] mb-3 border-[var(--line-strong)]" />

          
        </div>
        <TradeStats />
      </div>
    
  );
}

function StatItem({ icon, label, value, hasBorder = false, centered = false }) {
  return (
    <div
      className={`flex flex-col justify-center self-stretch px-4 py-2 my-auto w-28 ${
        hasBorder ? "border-r border-neutral-500" : ""
      }`}
    >
      <div className="flex flex-col justify-center w-full">
        <div
          className={`flex ${
            centered ? "justify-center" : ""
          } gap-2.5 items-center w-full text-xs text-neutral-400`}
        >
          {icon && (
            <img
              src={icon}
              alt=""
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
            />
          )}
          <div className="self-stretch my-auto">{label}</div>
        </div>
        <div
          className={`mt-2.5 text-sm tracking-normal leading-tight ${
            centered ? "text-center" : ""
          } text-zinc-100`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
