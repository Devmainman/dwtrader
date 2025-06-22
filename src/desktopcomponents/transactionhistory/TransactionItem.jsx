import React from "react";

function TransactionItem({ transaction }) {
  const {
    bank,
    date,
    method,
    type,
    amount,
    status,
    statusColor,
    action,
    actionColor,
    details,
  } = transaction;

  return (
    <article className="flex flex-col flex-1 shrink px-2.5 py-4 w-full rounded-xl basis-0 bg-neutral-900 min-w-60 max-md:max-w-full">
      <div className="w-full max-md:max-w-full">
        <div className="flex flex-col justify-center w-full max-md:max-w-full">
          <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
            <div className="flex gap-1.5 items-center self-stretch my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb100add594afa2e3defef8806dce13fa655cec06569aaefd0b5f91f45276b16?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
                alt="Bank icon"
              />
              <div className="self-stretch my-auto">
                <div className="text-[8px] text-neutral-400">Icon</div>
                <div className="text-[14px] font-medium tracking-normal leading-tight text-zinc-100">
                  {bank}
                </div>
              </div>
            </div>

            <div className="self-stretch my-auto w-[108px]">
              <div className="text-[8px] text-neutral-400">Date</div>
              <div className="text-[10px] text-zinc-100">{date}</div>
            </div>

            <div className="self-stretch my-auto">
              <div className="text-[8px] text-neutral-400">Method</div>
              <div className="text-[10px] text-zinc-100">{method}</div>
            </div>

            <div className="self-stretch my-auto whitespace-nowrap">
              <div className="text-[8px] text-neutral-400">Type</div>
              <div className="text-[10px] text-zinc-100">{type}</div>
            </div>

            <div className="self-stretch my-auto">
              <div className="text-[8px] text-neutral-400">Amount</div>
              <div className="text-[10px] text-zinc-100">{amount}</div>
            </div>

            <div className="self-stretch my-auto text-[8px] whitespace-nowrap">
              <div className="text-neutral-400">Status</div>
              <div className="flex flex-col justify-center mt-1 text-center text-zinc-100">
                <div
                  className={`gap-3 self-stretch py-0.5 pr-2 pl-2 ${statusColor} rounded`}
                >
                  {status}
                </div>
              </div>
            </div>

            <div className="self-stretch my-auto text-[8px]">
              <div className="text-neutral-400">Action</div>
              <div
                className={`gap-3 self-stretch py-0.5 pr-2 pl-2 mt-1 text-center ${actionColor} rounded text-zinc-100`}
              >
                {action}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="self-start mt-4">
        <div className="text-[10px] text-neutral-400">Details</div>
        <div className="text-[8px] text-zinc-100 whitespace-pre-line">
          {details}
        </div>
      </div>
    </article>
  );
}

export default TransactionItem;
