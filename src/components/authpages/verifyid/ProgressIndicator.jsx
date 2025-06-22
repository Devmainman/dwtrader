import React from "react";

function ProgressIndicator({ step, totalSteps, className = "" }) {
  return (
    <section className={`flex flex-col items-end w-full ${className}`}>
      <p className="text-sm font-medium tracking-normal leading-tight text-center text-stone-300">
        Step {step}/{totalSteps}
      </p>
      <div className="flex gap-4 items-start mt-4">
        <div className="flex shrink-0 rounded-3xl bg-stone-300 h-[3px] w-[76px]" />
        <div className="flex shrink-0 h-0.5 rounded-3xl bg-neutral-600 w-[76px]" />
        <div className="flex shrink-0 h-0.5 rounded-3xl bg-neutral-600 w-[76px]" />
        <div className="flex shrink-0 h-0.5 rounded-3xl bg-neutral-600 w-[76px]" />
      </div>
    </section>
  );
}

export default ProgressIndicator;
