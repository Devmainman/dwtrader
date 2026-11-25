import React from "react";

/**
 * SupportTicket component for displaying individual support tickets
 * @param {Object} props - Component props
 * @param {string} props.title - Ticket title
 * @param {string} props.timestamp - Ticket timestamp
 * @param {string} props.priority - Ticket priority level
 * @param {string} props.status - Ticket status (Open/Closed)
 * @param {string} props.iconUrl - URL for the ticket icon
 */
const SupportTicket = ({ title, timestamp, priority, status, iconUrl }) => {
  const isOpen = status.toLowerCase() === "open";

  return (
    <article className="flex flex-col px-3 py-4 w-full rounded-xl border-r bg-[var(--card)] border-neutral-600 mb-5 last:mb-0">
      <div className="flex gap-3">
        <div className="flex flex-col grow  w-fit">
          <h3 className="text-[14px] tracking-normal leading-tight text-zinc-100">
            {title}
          </h3>
          <div className="flex gap-5 items-start self-start mt-2.5">
            <time className="text-[10px] text-neutral-400">{timestamp}</time>
            <div className="whitespace-nowrap w-[43px]">
              <p className="text-[8px] text-neutral-500">Priority</p>
              <p className="text-[10px] text-fuchsia-600">{priority}</p>
            </div>
          </div>
        </div>
        <img
          src={iconUrl}
          alt="Ticket icon"
          className="object-contain shrink-0 self-end mt-7 w-6 aspect-square"
        />
      </div>
      <span
        className={`self-start px-2.5 py-1 mt-2.5 text-[8px] text-center whitespace-nowrap rounded-md min-h-[18px] text-stone-300 ${
          isOpen ? "bg-blue-600" : "bg-red-600"
        }`}
      >
        {status}
      </span>
    </article>
  );
};

export default SupportTicket;
