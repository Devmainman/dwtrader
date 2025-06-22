import React from "react";

function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <>
      <p className="mb-4 text-sm font-medium tracking-normal text-right text-stone-300">
        Step {currentStep}/{totalSteps}
      </p>
      <div className="flex gap-4">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className="h-0.5 rounded-3xl bg-stone-300 w-[106px]"
          />
        ))}
      </div>
    </>
  );
}

export default ProgressIndicator;
