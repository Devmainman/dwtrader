import React from "react";

function ProgressIndicator() {
  return (
    <div className="flex flex-col mt-8 w-full max-md:max-w-full">
      <div className="self-end text-sm font-medium tracking-normal leading-tight text-center text-stone-300">
        Step 1/4
      </div>
      <div className="flex flex-wrap gap-4 items-start mt-4 w-full max-md:max-w-full">
        <div className="flex flex-1 shrink rounded-3xl basis-0 bg-stone-300 h-[3px] w-[180px]" />
        <div className="flex flex-1 shrink h-0.5 rounded-3xl basis-0 bg-neutral-600 w-[179px]" />
        <div className="flex flex-1 shrink h-0.5 rounded-3xl basis-0 bg-neutral-600 w-[180px]" />
        <div className="flex flex-1 shrink h-0.5 rounded-3xl basis-0 bg-neutral-600 w-[179px]" />
      </div>
    </div>
  );
}

export default ProgressIndicator;
