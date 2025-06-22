"use client";
import React from "react";
import VerificationMethod from "./VerificationMethod";
import ImageUploader from "./ImageUploader";

function VerificationForm() {
  return (
    <div className="flex flex-wrap gap-11 justify-center items-start mt-8 w-full max-w-[766px] max-md:max-w-full">
      <VerificationMethod />
      <ImageUploader />
      <button className="overflow-hidden grow shrink gap-2.5 self-stretch px-2.5 py-3.5 text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] min-w-60 text-zinc-100 w-[260px]">
        Continue
      </button>
    </div>
  );
}

export default VerificationForm;
