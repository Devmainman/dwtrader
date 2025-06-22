"use client";
import React from "react";

const SearchBar = ({ placeholder, iconSrc }) => {
  return (
    <div className="flex overflow-hidden flex-wrap gap-2.5 items-center self-stretch p-2.5 text-xs rounded-3xl bg-neutral-800 min-h-9 min-w-60 text-stone-300 w-[879px] max-md:max-w-full">
      <img
        src={iconSrc}
        className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
        alt="Search icon"
      />
      <p className="self-stretch my-auto">{placeholder}</p>
    </div>
  );
};

export default SearchBar;
