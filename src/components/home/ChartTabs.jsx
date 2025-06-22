"use client";
import React from "react";

function ChartTabs() {
  return (
    <nav className="w-full overflow-x-auto hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
      <div className="flex gap-10 justify-between items-center p-1.5 min-w-[360px] text-xs tracking-normal leading-tight text-center border-b border-neutral-600 text-neutral-400">
        <a href="#" className="self-stretch my-auto text-blue-600 whitespace-nowrap">
          Chart
        </a>
        <a href="#" className="self-stretch my-auto whitespace-nowrap">
          Order Book
        </a>
        <a href="#" className="self-stretch my-auto whitespace-nowrap">
          Market
        </a>
        <a href="#" className="self-stretch my-auto whitespace-nowrap">
          History
        </a>
      </div>
    </nav>
  );
}

export default ChartTabs;
