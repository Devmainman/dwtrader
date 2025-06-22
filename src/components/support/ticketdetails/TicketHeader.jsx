import React from "react";

function TicketHeader({ onBack }) {
  return (
    <header className="flex gap-10 justify-center items-center w-full text-zinc-100">
      <h1 className="flex-1 shrink self-stretch my-auto text-[14px] font-medium tracking-normal leading-tight basis-5">
        Ticket Details
      </h1>
      <button onClick={onBack} className="gap-2.5 self-stretch px-2.5 py-1.5 my-auto text-[10px] text-center bg-red-600 rounded-3xl min-h-[22px] w-[83px]">
        Close Ticket
      </button>
    </header>
  );
}

export default TicketHeader;
