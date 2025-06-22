"use client";
import React from "react";

function LanguageSelector() {
  return (
    <button className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-1.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[165px]">
      <div className="flex gap-1.5 items-center self-stretch my-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7fb46963f559b8bfcdfa19861e94bb9ff88af8c9?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Language icon"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe13adf58238a00e3955f9c8aa81b59b3ee51257?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Dropdown icon"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
        />
      </div>
      <span className="self-stretch my-auto text-xs text-neutral-600">
        Select Language
      </span>
    </button>
  );
}

export default LanguageSelector;
