import React from "react";

function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex flex-col mt-8 max-w-full w-[414px]">
      <p className="self-end text-sm font-medium tracking-normal leading-tight text-right text-stone-300 max-md:max-w-full">
        Step {currentStep}/{totalSteps}
      </p>
      <div className="flex gap-2.5 items-start mt-2.5 w-full">
        {Array(totalSteps)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`flex flex-1 shrink h-0.5 rounded-3xl basis-0 ${
                index < currentStep ? "bg-stone-300" : "bg-neutral-700"
              }`}
              aria-hidden="true"
            />
          ))}
      </div>
    </div>
  );
}

export default ProgressIndicator;
