"use client";
import React from "react";

function LanguageSelector() {
  return (
    <div className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-1.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[165px]">
      <div className="flex gap-1.5 items-center self-stretch my-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/134d3b2aca1761df7d13848f0cc138e242b69d04?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe13adf58238a00e3955f9c8aa81b59b3ee51257?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
        />
      </div>
      <p className="self-stretch my-auto text-xs text-neutral-600">
        Select Language
      </p>
    </div>
  );
}

export default LanguageSelector;
