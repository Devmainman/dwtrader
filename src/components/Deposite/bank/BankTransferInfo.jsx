import React from "react";

function BankTransferInfo() {
  return (
    <div className="w-full">
      <div className="flex gap-10 justify-between items-center w-full leading-tight">
        <h2 className="self-stretch my-auto text-base font-medium tracking-normal text-stone-300">
          Bank Transfer
        </h2>
        <div className="flex gap-2.5 items-center self-stretch my-auto text-xs font-semibold tracking-normal whitespace-nowrap text-zinc-100">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2082827a841a6d58a0559ef08e22c3a5226a32d2?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[34px]"
            alt="Bank icon"
          />
          <span className="self-stretch my-auto">Bank</span>
        </div>
      </div>
      <div className="mt-2.5 w-full">
        <div className="flex gap-10 items-center w-full text-[10px]">
          <label className="self-stretch my-auto text-neutral-400">
            Bank Name:
          </label>
          <div className="gap-2.5 self-stretch px-2.5 py-3 my-auto rounded-md bg-[#1D1D1F] min-h-9 min-w-60 text-zinc-100 w-[243px]">
            Citi Bank
          </div>
        </div>
        <div className="flex gap-6 justify-center items-center mt-2.5 w-full text-[10px]">
          <label className="self-stretch my-auto text-neutral-400">
            Account Name:
          </label>
          <div className="gap-2.5 self-stretch px-2.5 py-3.5 my-auto rounded-md bg-[#1D1D1F] min-h-[38px] min-w-60 text-zinc-100 w-[243px]">
            StarLba Ltd.
          </div>
        </div>
        <div className="flex gap-3 justify-center items-center mt-2.5 w-full">
          <label className="self-stretch my-auto text-[10px] text-neutral-400">
            Account Number:
          </label>
          <div className="flex gap-2 items-center self-stretch px-2.5 py-2 my-auto rounded-md bg-[#1D1D1F] min-h-9 min-w-60 w-[243px]">
            <span className="flex-1 shrink self-stretch my-auto text-[10px] basis-5 text-zinc-100">
              564356789765
            </span>
            <button className="flex flex-col justify-center self-stretch my-auto text-[10px] text-blue-600 min-h-[23px] w-[78px]">
              <div className="flex gap-2 justify-center items-center w-full">
                <span className="self-stretch my-auto">Copy Now</span>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0fce323440263bc21fb70ede8976e4f959d9d08?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
                  alt="Copy icon"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankTransferInfo;
