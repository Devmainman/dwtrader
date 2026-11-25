"use client";
import * as React from "react";
import FormField from "./FormField";
import UploadSection from "./UploadSection";
import InfoSection from "./InfoSection";

function DepositeStage4() {
  return (
    <section className="flex overflow-hidden flex-col px-4 py- mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <div className="w-full">
        <header className="flex gap-10 justify-between items-center w-full leading-tight">
          <h1 className="self-stretch my-auto text-base font-medium tracking-normal text-stone-300">
            Bank Transfer
          </h1>
          <div className="flex gap-2.5 items-center self-stretch my-auto text-10 font-semibold tracking-normal whitespace-nowrap text-zinc-100">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8194f7af357e09755184d14c6e930b3aac6fce05?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto rounded-3xl aspect-square w-[34px]"
              alt="Ethereum logo"
            />
            <span className="self-stretch my-auto">Ethereum</span>
          </div>
        </header>

        <form className="mt-4 w-full">
          <FormField
            label="Crypto Name:"
            value="Ethereum"
            readOnly={true}
            type="text"
          />

          <div className="flex flex-col justify-center mt-4 w-full">
            <div className="flex gap-7 items-center w-full">
              <label className="self-stretch my-auto text-[10px] font-semibold text-neutral-400">
                Wallet Address:
              </label>
              <div className="flex overflow-hidden shrink gap-2.5 items-center self-stretch px-2.5 py-2 my-auto rounded-md basis-0 bg-[var(--card)] min-h-9 min-w-60">
                <p className="overflow-hidden flex-1 shrink self-stretch my-auto text-[10px] whitespace-nowrap text-zinc-100">
                  7n82dh87b2bg738dgx78b2dgb872uyhy8xn
                </p>
                <button className="flex gap-2 justify-center items-center self-stretch px-2.5 py-1.5 my-auto text-[10px] text-blue-600 min-h-[23px] w-[]">
                  <span className="self-stretch my-auto">Copy Now</span>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0fce323440263bc21fb70ede8976e4f959d9d08?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                    className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
                    alt="Copy icon"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center mt-4 w-full text-xs">
            <label className="self-stretch my-auto font-medium text-neutral-400">
              Amount (NGN)
            </label>
            <input
              type="text"
              placeholder="Deposit Amount"
              className="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-2.5 py-5 my-auto rounded-lg basis-0 bg-[var(--card)] min-h-[52px] min-w-60 text-neutral-400"
            />
          </div>
        </form>
      </div>

      <UploadSection />

      <button className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-5 w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl max-w-[325px] min-h-[42px] text-zinc-100">
        Submit
      </button>

      <InfoSection />
    </section>
  );
}

export default DepositeStage4;
