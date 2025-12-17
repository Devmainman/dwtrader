"use client";
import React from "react";

function CopyTradingHeader({ 
  stats, 
  searchTerm, 
  setSearchTerm, 
  activeFilter, 
  setActiveFilter,
  sortBy,
  setSortBy 
}) {
  const filters = [
    { id: "all", label: "All Traders" },
    { id: "crypto", label: "Crypto" },
    { id: "forex", label: "Forex" },
    { id: "top", label: "Top Performers" }
  ];

  const sortOptions = [
    { id: "profit", label: "Highest Profit" },
    { id: "winRate", label: "Win Rate" },
    { id: "copiers", label: "Most Copiers" },
    { id: "trades", label: "Total Trades" }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2.5">
        <div>
          <h2 className="text-[28px] font-medium tracking-wide leading-tight text-zinc-100">Social Copy Trading</h2>
          <p className="text-[10px] text-stone-300 mt-1">
            Copy expert traders automatically
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] text-stone-300">Platform Stats</div>
          <div className="flex gap-2.5 mt-1">
            <div className="text-[10px]">
              <span className="text-stone-300">Traders: </span>
              <span className="text-zinc-100 font-semibold">{stats.totalTraders}</span>
            </div>
            <div className="text-[10px]">
              <span className="text-stone-300">Copiers: </span>
              <span className="text-zinc-100 font-semibold">{stats.totalCopiers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex overflow-hidden gap-2.5 items-center px-2.5 py-3 mt-5 text-[10px] whitespace-nowrap rounded-3xl border border-solid bg-neutral-800 border-neutral-900 min-h-10 text-zinc-100">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3dd8d9e5c2914eee7379de374edcd67171d5290700658ee90db2347c5d288de9?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
          alt="Search icon"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search traders by name or style..."
          className="self-stretch my-auto bg-transparent border-none outline-none w-full text-zinc-100 placeholder-neutral-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-stone-300 hover:text-zinc-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="relative mt-2.5">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-2.5 py-3 bg-neutral-800 border border-neutral-900 rounded-3xl text-[10px] text-zinc-100 outline-none appearance-none pr-10"
        >
          {sortOptions.map(option => (
            <option key={option.id} value={option.id}>
              Sort by: {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-3 pointer-events-none text-stone-300">
          ▼
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 mt-2.5">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold ${
              activeFilter === filter.id
                ? "bg-blue-700/80 text-zinc-100"
                : "bg-neutral-800 text-stone-300 hover:text-zinc-100 hover:bg-neutral-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CopyTradingHeader;