import React from "react";

function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex flex-col self-stretch mt-8 w-full max-md:max-w-full">
      <div className="self-end text-sm font-medium tracking-normal leading-tight text-center text-stone-300">
        Step {currentStep}/{totalSteps}
      </div>
      <div className="flex gap-4 items-start mt-4 w-full max-md:max-w-full">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`flex flex-1 shrink rounded-3xl basis-0 ${
              index < currentStep
                ? "bg-stone-300 h-[3px]"
                : "bg-stone-300 h-0.5"
            } w-[${100 / totalSteps}%]`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProgressIndicator;
