"use client";
import React from "react";

function CaptchaVerification() {
  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <p className="text-xs tracking-normal leading-4 text-yellow-700">
        Confirm you are not a robot
      </p>
      <div className="flex flex-col justify-between gap-2.5 w-full max-sm:flex-col">
        <div className="flex-1 px-5 py-4 text-xs text-center rounded-lg border border-blue-600 text-neutral-400">
          18 +9
        </div>
        <input
          type="text"
          placeholder="Enter Answer"
          className="flex-1 px-5 py-4 text-xs rounded-lg border bg-zinc-900 border-neutral-600 text-neutral-600"
        />
      </div>
    </div>
  );
}

export default CaptchaVerification;
