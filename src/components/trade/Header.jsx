import React from "react";

function Header() {
  return (
    <header className="flex overflow-hidden gap-5 justify-between self-stretch px-5 py-3 w-full bg-zinc-900">
      <div className="flex gap-2.5">
        <div className="flex shrink-0 self-start mt-1 w-8 h-8 rounded-3xl border border-solid bg-zinc-900 border-neutral-800" />
        <div className="flex overflow-hidden gap-2.5 items-center px-2.5 py-1.5 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
          <div className="flex gap-1.5 items-center self-stretch my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5f8ed9f733e16e2603347d12aeb36216cf7b3ac411558a058730e639b24ad7e5?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              alt="Language icon"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/58e58666aed9c64d29651bdbc9df9e441e50fffd1129fbbc5d7a08480840840d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              alt="Dropdown icon"
            />
          </div>
          <p className="self-stretch my-auto text-xs text-neutral-600">
            Select Language
          </p>
        </div>
      </div>
      <div className="flex gap-2.5 items-center my-auto">
        <div className="flex shrink-0 self-stretch my-auto w-8 h-8 rounded-3xl border border-solid bg-zinc-900 border-neutral-800" />
        <div className="flex shrink-0 self-stretch my-auto w-8 h-8 rounded-3xl border border-solid bg-zinc-900 border-neutral-800" />
      </div>
    </header>
  );
}

export default Header;
