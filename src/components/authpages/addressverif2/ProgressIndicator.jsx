import React from "react";

function ProgressIndicator() {
  return (
    <section className="flex flex-col gap-4 items-end px-5 mb-9">
      <p className="text-sm font-medium tracking-normal leading-4 text-center text-stone-300">
        Step 4/4
      </p>
      <div className="flex gap-4 items-start w-full">
        <div className="rounded-3xl bg-stone-300 h-[3px] w-[75.5px]" />
        <div className="h-0.5 rounded-3xl bg-neutral-600 w-[75.5px]" />
        <div className="h-0.5 rounded-3xl bg-neutral-600 w-[75.5px]" />
        <div className="h-0.5 rounded-3xl bg-neutral-600 w-[75.5px]" />
      </div>
    </section>
  );
}

export default ProgressIndicator;
