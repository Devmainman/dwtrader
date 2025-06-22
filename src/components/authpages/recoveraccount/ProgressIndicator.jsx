import React from "react";

function ProgressIndicator({ currentStep, totalSteps }) {
  // Generate an array of steps for rendering
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <section className="flex flex-col gap-4 items-end mt-12">
      <p className="text-sm tracking-normal leading-4 text-stone-300">
        Step {currentStep}/{totalSteps}
      </p>
      <div className="flex gap-4 items-start">
        {steps.map((step) => (
          <div
            key={step}
            className={`${
              step === currentStep
                ? "rounded-3xl bg-stone-300 h-[3px]"
                : "h-0.5 rounded-3xl bg-neutral-600"
            } w-[106px]`}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}

export default ProgressIndicator;
