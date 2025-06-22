import React from "react";

function ProgressIndicator({ currentStep, totalSteps }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-end w-full">
      <p className="text-sm font-medium tracking-normal leading-tight text-center text-stone-300">
        Step {currentStep}/{totalSteps}
      </p>
      <div className="flex gap-4 items-start mt-4">
        {steps.map((step) => (
          <div
            key={step}
            className={`flex shrink-0 ${
              step === currentStep
                ? "rounded-3xl bg-stone-300 h-[3px]"
                : "h-0.5 rounded-3xl bg-neutral-600"
            } w-[76px]`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProgressIndicator;
