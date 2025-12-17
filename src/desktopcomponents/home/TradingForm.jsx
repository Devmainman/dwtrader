"use client";
import React from "react";

function TradingForm() {
  return (
    <section className="flex flex-col justify-center px-3 py-4 w-[358px] h-[336px] rounded-xl border border-neutral-600 bg-black bg-opacity-80 text-white">
      <div className="w-full">
        <h3 className="text-[12px] text-neutral-400">Package</h3>

        <div className="flex gap-5 mt-1 text-[10px]">
          <div className="flex items-center justify-between px-2 py-2.5 w-full rounded-lg bg-neutral-900 border border-neutral-600">
            <span>Features</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/24449e3ac3913b7c17f84fc6c2a879f4840271dda8f34aca2a69338daa00a512"
              alt="Dropdown"
              className="w-4"
            />
          </div>
          <div className="flex items-center gap-2.5 p-2.5 w-full rounded-lg bg-neutral-900 border border-neutral-600 text-neutral-500">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b407f4a4de1526b3dfc5bca6c8758729c573c866f6382893ac702a1e9861743"
              alt="Buy/Long"
              className="w-3.5"
            />
            <span>Buy/Long</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-3 text-[10px] text-neutral-400">
          {["Rate", "Min. Amount", "Max. Amount"].map((label, i) => (
            <div className="flex justify-between" key={i}>
              <div className="p-2.5">{label}:</div>
              <div className="p-2.5 text-stone-300">--</div>
            </div>
          ))}
        </div>

        <div className="flex gap-5 mt-2 w-full">
          <div className="flex-1">
            <label className="text-[12px] text-neutral-400">Amount (NGN)</label>
            <input
              type="text"
              placeholder="Amount"
              className="mt-1 px-2.5 py-3 w-full rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-600 text-[10px]"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-neutral-400">Duration</label>
            <div className="flex items-center gap-2.5 px-2.5 py-3 mt-1 w-full rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 text-[10px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b407f4a4de1526b3dfc5bca6c8758729c573c866f6382893ac702a1e9861743"
                alt="Duration"
                className="w-3.5"
              />
              <span>Select Duration</span>
            </div>
          </div>
        </div>
      </div>

      <button className="mt-5 w-full py-3.5 bg-blue-600 rounded-3xl text-xs text-zinc-100">
        Trade Now
      </button>
    </section>
  );
}

export default TradingForm;
