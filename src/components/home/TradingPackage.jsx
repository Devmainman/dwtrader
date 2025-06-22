"use client";
import React from "react";

function TradingPackage() {
  return (
    <section className="overflow-hidden px-3.5 py-4 mt-7 w-full rounded-xl bg-black bg-opacity-80 max-w-[480px]">
      <div className="w-full whitespace-nowrap">
        <h2 className="text-[clamp(11px,2vw,14px)] tracking-normal leading-tight text-zinc-100">
          Package
        </h2>

        {/* First Row: Features & Buy/Long */}
        <div className="flex gap-3 justify-between items-center mt-1 w-full overflow-x-auto no-scrollbar text-[clamp(10px,2.5vw,13px)] hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
          {/* Feature Dropdown */}
          <div className="flex gap-10 justify-between items-center px-2 py-2.5 my-auto rounded-lg border border-solid bg-neutral-900 border-neutral-600 min-h-[34px] text-neutral-600 min-w-[154px]">
            <span className="my-auto">Features</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0a92fffbcf2cfe6e749c4da273c8eacc57651db4d2549a2746e95eeee75cc14?placeholderIfAbsent=true"
              className="object-contain w-4 aspect-square"
              alt="Dropdown arrow"
            />
          </div>

          {/* Buy/Long Button */}
          <div className="flex gap-2.5 items-center p-2.5 my-auto rounded-lg border border-solid bg-neutral-900 border-neutral-600 text-neutral-500 min-w-[154px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca387fb10bcfc33fffcf6905fbc9e1feac1c3e02413c04ee641f2748544d5264?placeholderIfAbsent=true"
              className="object-contain w-3.5 aspect-square"
              alt="Buy icon"
            />
            <span>Buy/Long</span>
          </div>
        </div>
      </div>

      {/* Amount + Duration (scrolls horizontally if needed) */}
      <div className="flex gap-4 justify-between items-center mt-5 overflow-x-auto no-scrollbar hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
        {/* Amount Input */}
        <div className="min-w-[153px]">
          <label className="text-[clamp(11px,2vw,13px)] tracking-normal leading-tight text-zinc-100">
            Amount (NGN)
          </label>
          <input
            type="text"
            placeholder="Amount"
            className="px-2.5 py-3 mt-1 w-full text-[clamp(10px,2vw,13px)] rounded-lg border border-solid bg-neutral-900 border-neutral-800 text-neutral-600 min-h-[34px]"
          />
        </div>

        {/* Duration Select */}
        <div className="min-w-[153px]">
          <label className="text-[clamp(11px,2vw,13px)] tracking-normal leading-tight text-zinc-100">
            Duration
          </label>
          <div className="flex gap-2.5 items-center p-2.5 mt-1 w-full text-[clamp(10px,2vw,13px)] rounded-lg border border-solid bg-neutral-900 border-neutral-800 text-neutral-500 min-h-[34px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca387fb10bcfc33fffcf6905fbc9e1feac1c3e02413c04ee641f2748544d5264?placeholderIfAbsent=true"
              className="object-contain w-3.5 aspect-square"
              alt="Duration icon"
            />
            <span>Select Duration</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button className="mt-7 px-2.5 py-3.5 w-full text-[clamp(11px,2vw,14px)] bg-blue-600 text-zinc-100 rounded-3xl min-h-[42px]">
        Trade Now
      </button>
    </section>
  );
}

export default TradingPackage;
