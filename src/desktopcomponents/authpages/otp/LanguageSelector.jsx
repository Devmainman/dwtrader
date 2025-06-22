import React from "react";

function LanguageSelector() {
  return (
    <button
      className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-1.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[165px]"
      aria-label="Select language"
    >
      <div className="flex gap-1.5 items-center self-stretch my-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e5f8283cd881c2e2cda0663c549523d3932c7830?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Globe icon"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe8114f191a4eaa7f5b5fefa446b486122890a72?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Dropdown icon"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
        />
      </div>
      <span className="self-stretch my-auto text-xs text-neutral-500">
        Select Language
      </span>
    </button>
  );
}

export default LanguageSelector;
