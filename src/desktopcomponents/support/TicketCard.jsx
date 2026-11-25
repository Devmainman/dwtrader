import React from "react";

function TicketCard({ title, date, priority, status, iconSrc, }) {
  const isOpen = status === "Open";

  return (
    <article className="flex flex-col items-start self-stretch px-3 py-5 my-auto rounded-xl border border-solid bg-[var(--card)] border-neutral-600 min-w-60 w-[334px]">
      <h3 className="text-[14px] tracking-normal leading-tight text-zinc-100">
        {title}
      </h3>

      <div className="flex gap-5 justify-between items-start self-stretch mt-2.5 w-full">
        <div className="flex gap-9">
          <time className="self-start text-[10px] basis-auto text-neutral-400">
            {date}
          </time>
          <div className="whitespace-nowrap">
            <p className="text-[8px] text-neutral-500">Priority</p>
            <p className="text-[10px] text-fuchsia-600">{priority}</p>
          </div>
        </div>
        {iconSrc && (
          <img
            src={iconSrc}
            className="object-contain shrink-0 w-6 aspect-square"
            alt="Ticket icon"
          />
        )}
      </div>

      <span
        className={`flex-1 shrink gap-2.5 self-start px-2.5 py-1 mt-2.5 text-[10px] text-center whitespace-nowrap rounded-md basis-0 min-h-[18px] text-stone-300 ${
          isOpen ? "bg-blue-600" : "bg-red-600"
        }`}
      >
        {status}
      </span>
    </article>
  );
}

export default TicketCard;
