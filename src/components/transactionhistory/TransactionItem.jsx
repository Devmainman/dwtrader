import React from "react";
import StatusBadge from "./StatusBadge";

function TransactionItem({
  date,
  bank,
  amount,
  details,
  type,
  status,
  showProof,
}) {
  return (
    <article className="flex overflow-hidden flex-col justify-center p-2.5 w-full rounded-xl lg:bg-[#161617] bg-[#1D1D1F] min-h-[123px]">
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-1.5 items-end self-stretch my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb100add594afa2e3defef8806dce13fa655cec06569aaefd0b5f91f45276b16?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 w-10 aspect-square"
              alt="Bank logo"
            />
            <div>
              <time className="text-xs text-stone-300">{date}</time>
              <h4 className="mt-1.5 text-sm font-medium tracking-normal leading-tight text-stone-300">
                {bank}
              </h4>
            </div>
          </div>
          <div className="flex flex-col flex-1 shrink justify-center items-end self-stretch my-auto whitespace-nowrap basis-0">
            <p className="text-[8px] text-stone-300">Amount</p>
            <p className="mt-1.5 text-[14px] font-medium tracking-normal leading-tight text-stone-300">
              {amount}
            </p>
          </div>
        </div>
        <div className="flex gap-14 items-center mt-3 w-full text-[8px]">
          <div className="self-stretch my-auto leading-3 text-stone-300">
            Bank Name : {details.bankName}
            <br />
            Account Name : {details.accountName}
            <br />
            Account Number : {details.accountNumber}
            <br />
            withdrawal token : {details.withdrawalToken}
          </div>
          <div className="self-stretch my-auto text-[10px] text-stone-300 w-[69px]">
            {type}
          </div>
          <div className="flex flex-col justify-center self-stretch my-auto text-center text-zinc-100">
            <StatusBadge status={status} />
            {showProof && (
              <button className="gap-3 self-stretch py-0.5 pr-2 pl-2 mt-2.5 bg-blue-600 rounded">
                View Poof
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default TransactionItem;
