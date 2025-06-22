"use client";
import React from "react";

function ProceedButton() {
  const handleProceed = () => {
    // Handle proceed action here
    console.log("Proceeding to next step");
  };

  return (
    <button
      onClick={handleProceed}
      className="p-2.5 mx-auto mt-14 mb-0 text-xs tracking-normal bg-blue-600 rounded-3xl h-[42px] text-zinc-100 w-[325px] max-sm:w-[calc(100%_-_30px)] flex items-center justify-center"
    >
      Proceed
    </button>
  );
}

export default ProceedButton;
