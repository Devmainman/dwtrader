import React from "react";

const TicketHeader = () => {
  return (
    <section className="flex justify-between items-center px-5 py-6 mt-5 rounded-xl bg-zinc-900">
      <h2 className="text-sm font-medium tracking-normal leading-4 text-zinc-100">
        Support Tickets
      </h2>
      <button className="px-5 py-2.5 text-xs tracking-normal leading-4 text-center bg-red-600 rounded-3xl text-zinc-100">
        Close Ticket
      </button>
    </section>
  );
};

export default TicketHeader;
