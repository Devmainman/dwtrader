import React from "react";

function StepIndicator({ currentStep, totalSteps }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="mt-12 text-right">
      <p className="mb-2.5 text-sm text-stone-300">
        Step {currentStep}/{totalSteps}
      </p>
      <div className="flex gap-2.5">
        {steps.map((step) => (
          <div
            key={step}
            className={`flex-1 h-0.5 rounded-3xl ${
              step <= currentStep ? "bg-blue-600" : "bg-neutral-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default StepIndicator;
