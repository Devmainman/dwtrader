"use client";
import React from "react";
import CopyButton from "./CopyButton";

function BankTransferForm() {
  return (
    <div className="flex flex-col justify-center min-w-60 w-[437px] max-md:max-w-full">
      <div className="flex gap-10 justify-between items-center w-full leading-tight max-md:max-w-full">
        <h3 className="self-stretch my-auto text-[16px] font-medium tracking-normal text-stone-300">
          Bank Transfer
        </h3>
        <div className="flex gap-2.5 items-center self-stretch my-auto text-xs font-semibold tracking-normal whitespace-nowrap text-zinc-100">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d1b87dee10b71877ef9cfc9ac305feb7c4decf071319fa852808fd06aca6fd4?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[34px]"
            alt="Bank icon"
          />
          <span className="self-stretch my-auto">Bank</span>
        </div>
      </div>
      <div className="mt-2 w-full max-w-[437px] max-md:max-w-full">
        <div className="flex gap-10 items-center w-[full] text-[10px] max-md:max-w-auto">
          <label className="flex-1 shrink self-stretch my-auto font-semibold basis-5 text-neutral-400">
            Bank Name:
          </label>
          <div className="gap-2.5 self-stretch px-2.5 py-3 my-auto rounded-md bg-zinc-900 min-h-9 min-w-60 text-zinc-100 w-[243px]">
            Citi Bank
          </div>
        </div>
        <div className="flex gap-7 justify-center items-center mt-2.5 w-full text-[10px] max-md:max-w-full">
          <label className="flex-1 shrink self-stretch my-auto font-semibold basis-5 text-neutral-400">
            Account Name:
          </label>
          <div className="gap-2.5 self-stretch px-2.5 py-3.5 my-auto rounded-md bg-zinc-900 min-h-[38px] min-w-60 text-zinc-100 w-[243px]">
            StarLba Ltd.
          </div>
        </div>
        <div className="flex gap-4 justify-center items-center mt-2.5 w-full max-md:max-w-full">
          <label className="flex-1 shrink self-stretch my-auto text-[10px] font-semibold basis-5 text-neutral-400">
            Account Number:
          </label>
          <div className="flex gap-2.5 items-center self-stretch px-2.5 py-2 my-auto rounded-md bg-zinc-900 min-h-9 min-w-60 w-[243px]">
            <span className="flex-1 shrink self-stretch my-auto text-[10px] basis-5 text-zinc-100">
              564356789765
            </span>
            <CopyButton textToCopy="564356789765" />
          </div>
        </div>
        <div className="flex gap-4 items-center mt-2.5 w-full text-[10px] max-md:max-w-full">
          <label className="flex-1 shrink self-stretch my-auto font-medium basis-5 text-neutral-400">
            Amount (NGN)
          </label>
          <input
            type="text"
            placeholder="Deposit Amount"
            className="overflow-hidden gap-2.5 self-stretch px-2.5 py-5 my-auto rounded-lg bg-neutral-800 min-h-[52px] min-w-60 text-neutral-400 w-[243px]"
          />
        </div>
      </div>
    </div>
  );
}

export default BankTransferForm;
