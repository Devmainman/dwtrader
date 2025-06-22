import React from "react";

function AmountInput() {
  return (
    <div className="flex gap-4 items-center mt-8 w-full text-[10px]">
      <label className="self-stretch my-auto font-medium text-neutral-400">
        Amount (NGN)
      </label>
      <input
        type="text"
        placeholder="Deposit Amount"
        className="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-2.5 py-5 my-auto rounded-lg basis-0 bg-[#1D1D1F] min-h-[52px] min-w-60 text-neutral-400"
      />
    </div>
  );
}

export default AmountInput;
