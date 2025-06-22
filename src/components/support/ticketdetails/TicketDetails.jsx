import React from "react";

function TicketDetails() {
  return (
    <div className="mt-2.5 w-full">
      <div className="flex gap-7 items-center w-full whitespace-nowrap">
        <label className="self-stretch my-auto text-xs font-semibold text-neutral-400">
          Priority:
        </label>
        <div className="flex gap-2.5 items-center self-stretch px-2.5 py-2.5 my-auto rounded-md border border-solid bg-neutral-900 border-[#1D1D1F] min-h-9 min-w-60 w-[281px]">
          <span className="flex-1 shrink self-stretch my-auto text-xs basis-5 text-neutral-600">
            Medium
          </span>
          <span className="flex shrink gap-2.5 self-stretch px-2.5 py-1 my-auto text-[8px] text-center bg-blue-600 rounded-md basis-0 min-h-[18px] text-stone-300 w-[43px]">
            Open
          </span>
        </div>
      </div>

      <div className="flex gap-7 items-center mt-2.5 w-full text-xs">
        <label className="self-stretch my-auto font-semibold text-neutral-400">
          Subject:
        </label>
        <div className="gap-2.5 self-stretch px-2.5 py-3.5 my-auto rounded-md border border-solid bg-neutral-900 border-[#1D1D1F] min-h-[38px] min-w-60 text-neutral-600 w-[281px]">
          There is no picture in this very ticket
        </div>
      </div>

      <div className="flex gap-10 items-center mt-2.5 w-full text-xs">
        <label className="self-stretch my-auto font-semibold text-neutral-400">
          Date:
        </label>
        <div className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-3 my-auto rounded-md border border-solid basis-0 bg-neutral-900 border-[#1D1D1F] min-h-9 min-w-60 text-neutral-600 w-[281px]">
          24 Nov, 2024 15:36pm
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
