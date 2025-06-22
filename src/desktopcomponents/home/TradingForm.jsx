"use client";
import React from "react";

function TradingForm() {
  return (
    <section className="flex overflow-hidden flex-col justify-center px-3 py-4 w-[358px] h-[336px] rounded-xl border border-solid bg-black bg-opacity-80 border-[color:var(--white-90,#505050)]">
      <div className="w-full">
        <div className="w-full whitespace-nowrap">
          <h3 className="text-[12px] tracking-normal leading-tight text-neutral-400">
            Package
          </h3>
          <div className="flex gap-5 items-center mt-1 w-full text-[10px]">
            <div className="flex overflow-hidden flex-1 shrink gap-10 justify-between items-center self-stretch px-2 py-2.5 my-auto rounded-lg border border-solid basis-0 bg-neutral-900 border-neutral-600 min-h-[34px] text-neutral-600">
              <span className="self-stretch my-auto">Features</span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/24449e3ac3913b7c17f84fc6c2a879f4840271dda8f34aca2a69338daa00a512?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Dropdown arrow"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              />
            </div>
            <div className="flex overflow-hidden flex-1 shrink gap-2.5 items-start self-stretch p-2.5 my-auto rounded-lg border border-solid basis-0 bg-neutral-900 border-neutral-600 text-neutral-500">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b407f4a4de1526b3dfc5bca6c8758729c573c866f6382893ac702a1e9861743?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Buy/Long icon"
                className="object-contain shrink-0 w-3.5 aspect-square"
              />
              <span className="flex-1 shrink basis-0">Buy/Long</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-start mt- w-full text-[10px] text-neutral-400">
          <div className="flex justify-between w-full">
            <div className="p-2.5">Rate:</div>
            <div className="p-2.5 whitespace-nowrap text-stone-300">--</div>
          </div>
          <div className="flex justify-between w-full">
            <div className="p-2.5">Min. Amount:</div>
            <div className="p-2.5 whitespace-nowrap text-stone-300">--</div>
          </div>
          <div className="flex justify-between w-full">
            <div className="p-2.5">Max. Amount:</div>
            <div className="p-2.5 whitespace-nowrap text-stone-300">--</div>
          </div>
        </div>

        <div className="flex gap-5 items-center mt- w-full">
          <div className="flex-1 shrink self-stretch my-auto basis-0">
            <label className="text-[12px] tracking-normal leading-tight text-neutral-400">
              Amount (NGN)
            </label>
            <input
              type="text"
              placeholder="Amount"
              className="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-2.5 py-3 mt-1 w-full text-[10px] whitespace-nowrap rounded-lg border border-solid basis-0 bg-neutral-900 border-neutral-800 min-h-[34px] text-neutral-600"
            />
          </div>
          <div className="flex-1 shrink self-stretch my-auto basis-0">
            <label className="text-xs tracking-normal leading-tight text-neutral-400">
              Duration
            </label>
            <div className="flex overflow-hidden gap-2.5 items-center p-2.5 mt-1 w-full text-[10px] rounded-lg border border-solid bg-neutral-900 border-neutral-800 min-h-[34px] text-neutral-500">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b407f4a4de1526b3dfc5bca6c8758729c573c866f6382893ac702a1e9861743?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Duration icon"
                className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
              />
              <span className="self-stretch my-auto">Select Duration</span>
            </div>
          </div>
        </div>
      </div>
      <button className="overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 mt-5 text-xs tracking-normal leading-none bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 max-md:mr-2">
        Trade Now
      </button>
    </section>
  );
}

export default TradingForm;
