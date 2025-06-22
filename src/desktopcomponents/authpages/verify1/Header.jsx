import React from "react";

function Header() {
  return (
    <header className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba0d4a928424dfcc0ecb125dd1d307b1996c4247?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        alt="Company Logo"
        className="object-contain shrink-0 self-stretch my-auto aspect-[4.83] w-[174px]"
      />
      <div className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-1.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[165px]">
        <div className="flex gap-1.5 items-center self-stretch my-auto">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e30722a871d6e3614998dea288c5dfeecd139867?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Language Icon"
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe8114f191a4eaa7f5b5fefa446b486122890a72?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Arrow Icon"
            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
          />
        </div>
        <span className="self-stretch my-auto text-xs text-neutral-500">
          Select Language
        </span>
      </div>
    </header>
  );
}

export default Header;
