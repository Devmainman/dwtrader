"use client";
import React from "react";

function MarketTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Hot Picks",
    "Popular",
    "New",
    "Top Gainers",
    "Meme",
    "24th Volume",
    "Losers",
  ];

  return (
    
    <div className="flex overflow-x-auto gap- items-center w-full text-[8px] text-stone-300 whitespace-nowrap scrollbar-hide">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`inline-flex items-center gap-1.5 px-5 py-1 rounded-3xl border-2 border-solid min-w-auto ${
        activeTab === tab ? "border-neutral-800" : "border-zinc-900"
      }`}
    >
      {tab}
      {activeTab === tab && (
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/cb0860dafad3c5bda4d5eeabc510610fd5f1ec638bd2768a02234cef629871fd?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 w-auto aspect-square"
          alt="Selected"
        />
      )}
    </button>
  ))}
</div>

  );
}

export default MarketTabs;
