"use client";
import React from "react";

function VerificationButton() {
  const handleRequestVerification = () => {
    // Handle verification request logic here
    console.log("Verification link requested");
  };

  return (
    <button
      onClick={handleRequestVerification}
      className="overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 mt-8 w-full text-xs tracking-normal leading-none bg-green-700 rounded-3xl min-h-[42px] text-center"
    >
      Request Verification link
    </button>
  );
}

export default VerificationButton;
