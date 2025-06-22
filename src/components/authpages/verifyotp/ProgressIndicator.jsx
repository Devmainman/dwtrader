import React from "react";

function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <section className="flex flex-col gap-2.5 mb-8">
      <div className="flex justify-between items-center w-full">
        <button aria-label="Go back">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[24px] h-[24px]"
          >
            <path
              d="M9.56994 18.82C9.37994 18.82 9.18994 18.75 9.03994 18.6L2.96994 12.53C2.67994 12.24 2.67994 11.76 2.96994 11.47L9.03994 5.4C9.32994 5.11 9.80994 5.11 10.0999 5.4C10.3899 5.69 10.3899 6.17 10.0999 6.46L4.55994 12L10.0999 17.54C10.3899 17.83 10.3899 18.31 10.0999 18.6C9.95994 18.75 9.75994 18.82 9.56994 18.82Z"
              fill="#C7C7C7"
            ></path>
            <path
              d="M20.5 12.75H3.67004C3.26004 12.75 2.92004 12.41 2.92004 12C2.92004 11.59 3.26004 11.25 3.67004 11.25H20.5C20.91 11.25 21.25 11.59 21.25 12C21.25 12.41 20.91 12.75 20.5 12.75Z"
              fill="#C7C7C7"
            ></path>
          </svg>
        </button>
        <p className="text-sm tracking-normal leading-4 text-stone-300">
          Step {currentStep}/{totalSteps}
        </p>
      </div>
      <div className="flex gap-2.5 w-full">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`flex-1 h-0.5 rounded-3xl ${
              index < currentStep ? "bg-stone-300" : "bg-neutral-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default ProgressIndicator;
