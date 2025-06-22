import React from "react";
import head from "../../assets/head.svg";

function TopNavBar() {
  return (
    <header className="flex overflow-hidden flex-wrap gap-5 justify-between px-2 py-3.5 pr-6 w-full h-[86px] border-b border-solid bg-neutral-900 border-b-[color:var(--Rational,#EBD425)] max-md:pr-5 max-md:max-w-full">
      <div className="flex gap-5 items-center my-auto">
        
      <div className="flex items-center justify-center self-stretch my-auto w-10 h-10 rounded-3xl border border-solid bg-zinc-900 border-[color:var(--Linear-color,#EB25C6)] min-h-10">
  <img src={head} alt="Head Icon" className="w-5 h-5" />
</div>

      </div>
      <div className="flex gap-5 justify-between items-center px-8 border border-solid bg-black bg-opacity-80 border-[color:var(--Linear-color,#EB25C6)] min-h-[60px] rounded-[30px] max-md:px-5 max-md:max-w-full">
        <div className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-1.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[185px]">
          <div className="flex gap-1.5 items-center self-stretch my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7cd7eca7215955801d270671513c18e89ef9eb172eef6c40a5f22e6cb822e7fe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Language icon 1"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/01d0be5b9b8c71657b04c03b97b36199f1d1163497c1d65c14911f6c27bec167?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Language icon 2"
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
          </div>
          <span className="self-stretch my-auto text-xs text-neutral-500">
            Select Language
          </span>
        </div>
        <div className="flex gap-4 items-center self-stretch my-auto">
          <div className="flex gap-4 items-center self-stretch my-auto w-8">
            <div className="flex self-stretch my-auto w-8 h-8 rounded-3xl border border-solid bg-zinc-900 border-neutral-800 min-h-8" />
          </div>
          <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-2.5 my-auto min-h-[54px]">
            <div className="gap-3 self-stretch px-2 py-0.5 my-auto w-11 text-xs font-medium text-center whitespace-nowrap bg-blue-600 rounded text-zinc-100">
              Basic
            </div>
            <div className="flex gap-1.5 items-center self-stretch my-auto">
              <div className="flex gap-2.5 items-center self-stretch my-auto w-9">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/be74c8f726366926a08420712838ac9c17b176ef6ef51eb583f2990b3a1ea1ba?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="User avatar"
                  className="object-contain self-stretch my-auto w-9 aspect-square"
                />
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a2a6f2d5e5d9f3b657e2e6d3669060c6c24ff8680c6cecbaae17616b2a160611?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Dropdown arrow"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavBar;
