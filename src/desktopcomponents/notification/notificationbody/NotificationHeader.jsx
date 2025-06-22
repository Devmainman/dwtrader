import React from "react";

function NotificationHeader({ subject, date }) {
  return (
    <header className="flex flex-wrap gap-10 justify-between items-start max-w-full w-[1064px]">
      <div className="font-medium leading-tight min-w-60">
        <h2 className="text-sm tracking-normal text-stone-300">Subject:</h2>
        <p className="mt-1.5 text-lg text-zinc-100">{subject}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium tracking-normal leading-tight text-stone-300">
          Date
        </h3>
        <time className="mt-1.5 text-xs tracking-normal leading-none text-zinc-100 block">
          {date}
        </time>
      </div>
    </header>
  );
}

export default NotificationHeader;
