"use client";
import React from "react";
import UploadProof from "./UploadProof";

function PaymentForm() {
  return (
    <article className="flex overflow-hidden flex-col px-5 py-7 mx-auto w-full rounded-xl bg-zinc-900 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <h2 className="self-start text-sm font-medium tracking-normal leading-tight text-neutral-400">
        Select Payment method
      </h2>
      <div className="flex flex-wrap gap-10 justify-between items-start mt-5 max-md:max-w-full">
        <div className="flex flex-col justify-center min-w-60 w-[437px] max-md:max-w-full">
          <div className="flex gap-10 justify-between items-center w-full leading-tight max-md:max-w-full">
            <h3 className="self-stretch my-auto text-base font-medium tracking-normal text-stone-300">
              Bank Transfer
            </h3>
            <div className="flex gap-2.5 items-center self-stretch my-auto text-xs font-semibold tracking-normal whitespace-nowrap text-zinc-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d8b157ef96b8f59494081052617b49290c375ff8d250658a2075cc2e611fadf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Ethereum logo"
                className="object-contain shrink-0 self-stretch my-auto rounded-3xl aspect-square w-[34px]"
              />
              <span className="self-stretch my-auto">Ethereum</span>
            </div>
          </div>
          <div className="mt-2 w-full max-w-[437px] max-md:max-w-full">
            <div className="flex gap-10 items-center w-full text-xs max-md:max-w-full">
              <label className="flex-1 shrink self-stretch my-auto font-semibold basis-5 text-neutral-400">
                Crypto Name:
              </label>
              <div className="gap-2.5 self-stretch px-2.5 py-3 my-auto whitespace-nowrap rounded-md bg-zinc-900 min-h-9 min-w-60 text-zinc-100 w-[243px]">
                Ethereum
              </div>
            </div>
            <div className="flex gap-4 justify-center items-center mt-2.5 w-full max-md:max-w-full">
              <label className="flex-1 shrink self-stretch my-auto text-xs font-semibold basis-[11px] text-neutral-400">
                Wallet Address:
              </label>
              <div className="flex gap-2.5 items-center self-stretch py-2 pr-px pl-2.5 my-auto rounded-md bg-zinc-900 min-h-9 min-w-60 w-[243px]">
                <div className="overflow-hidden gap-2.5 self-stretch my-auto w-36 text-xs whitespace-nowrap text-zinc-100">
                  7n82dh87b2bg738dgx78b2dgb872uyhy8xn
                </div>
                <button className="flex flex-col justify-center self-stretch px-2.5 py-1.5 my-auto text-xs text-blue-600 min-h-[23px] w-[78px]">
                  <div className="flex gap-2 justify-center items-center w-full">
                    <span className="self-stretch my-auto">Copy Now</span>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/aad06bfb0983fe8d0c12ede86937fa0a215e9e8cfc9453b383f674178ba642f3?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                      alt="Copy icon"
                      className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
                    />
                  </div>
                </button>
              </div>
            </div>
            <div className="flex gap-4 items-center mt-2.5 w-full text-xs max-md:max-w-full">
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
        <div className="flex flex-col min-w-60 w-[350px]">
          <UploadProof />
          <button className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-6 max-w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 w-[325px]">
            Submit
          </button>
        </div>
      </div>
    </article>
  );
}

export default PaymentForm;
