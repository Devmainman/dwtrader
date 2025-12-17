"use client";
import React from "react";

function MarketTabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex overflow-x-auto gap-1.5 items-center w-full mt-5 text-[10px] text-stone-300 whitespace-nowrap scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-3xl border border-solid transition-colors min-w-fit ${
            activeTab === tab 
              ? "border-blue-700/80 bg-blue-700/10 text-zinc-100" 
              : "border-neutral-900 bg-neutral-800 text-stone-300 hover:text-zinc-100 hover:bg-neutral-700"
          }`}
        >
          <span className="font-semibold">{tab}</span>
        </button>
      ))}
    </div>
  );
}

export default MarketTabs;