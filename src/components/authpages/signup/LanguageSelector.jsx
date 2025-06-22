import React from "react";

function LanguageSelector() {
  return (
    <div className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-1.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[165px]">
      <div className="flex gap-1.5 items-center self-stretch my-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fe0b4a5b59d1f3e1b1c1b03dfd5ecbf2c884834?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          alt="Language icon"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe13adf58238a00e3955f9c8aa81b59b3ee51257?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
          alt="Dropdown icon"
        />
      </div>
      <span className="self-stretch my-auto text-xs text-neutral-600">
        Select Language
      </span>
    </div>
  );
}

export default LanguageSelector;
