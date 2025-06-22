"use client";
import React from "react";

function SearchBar() {
  return (
    <div className="flex gap-2.5 items-center px-2.5 py-1.5 w-full h-9 rounded-3xl bg-neutral-800">
      <div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[16px] h-[16px] flex-shrink-0"
        >
          <path
            d="M11.262 11.2803L13.3153 13.3337M12.6666 7.66699C12.6666 8.99307 12.1398 10.2648 11.2022 11.2025C10.2645 12.1402 8.99271 12.667 7.66663 12.667C6.34054 12.667 5.06877 12.1402 4.13109 11.2025C3.19341 10.2648 2.66663 8.99307 2.66663 7.66699C2.66663 6.34091 3.19341 5.06914 4.13109 4.13146C5.06877 3.19378 6.34054 2.66699 7.66663 2.66699C8.99271 2.66699 10.2645 3.19378 11.2022 4.13146C12.1398 5.06914 12.6666 6.34091 12.6666 7.66699Z"
            stroke="#EFEFEF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-xs text-stone-300">Search here</span>
    </div>
  );
}

export default SearchBar;
