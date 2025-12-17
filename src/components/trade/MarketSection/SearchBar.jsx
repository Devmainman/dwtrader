"use client";
import React from "react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
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
        placeholder="Search crypto or forex pairs..."
        className="self-stretch my-auto bg-transparent border-none outline-none w-full text-zinc-100 placeholder-stone-300"
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
  );
}

export default SearchBar;