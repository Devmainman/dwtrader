"use client";
import React from "react";

function NavigationButtons() {
  const handleBack = () => {
    // Handle back navigation
    console.log("Back button clicked");
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submit button clicked");
  };

  return (
    <div className="flex gap-4 justify-between mt-8">
      <button
        onClick={handleBack}
        className="flex justify-center items-center text-xs tracking-normal leading-4 rounded-3xl border border-blue-600 bg-zinc-900 h-[42px] text-zinc-100 w-[167px]"
      >
        Back
      </button>
      <button
        onClick={handleSubmit}
        className="flex justify-center items-center text-xs tracking-normal leading-4 bg-blue-600 rounded-3xl h-[42px] text-zinc-100 w-[167px]"
      >
        Submit
      </button>
    </div>
  );
}

export default NavigationButtons;
