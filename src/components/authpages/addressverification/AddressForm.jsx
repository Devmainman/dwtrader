"use client";
import React from "react";

function AddressForm() {
  return (
    <form className="w-full">
      <div className="w-full">
        <h2 className="text-lg font-medium leading-tight text-zinc-100">
          Address Verification
        </h2>
        <p className="mt-1.5 text-xs tracking-normal leading-4 text-neutral-500">
          We will need to authenticate your account credibility details with
          Your Address
        </p>
      </div>

      <input
        type="text"
        placeholder="Street Address"
        className="overflow-hidden px-5 py-5 mt-5 max-w-full text-xs tracking-normal leading-none rounded-lg border border-solid border-neutral-600 text-neutral-400 w-[350px]"
      />

      <input
        type="text"
        placeholder="City"
        className="overflow-hidden px-5 py-4 mt-5 max-w-full text-xs tracking-normal leading-none whitespace-nowrap rounded-lg border border-solid border-neutral-600 text-neutral-400 w-[350px]"
      />

      <input
        type="text"
        placeholder="State"
        className="overflow-hidden px-5 py-4 mt-5 max-w-full text-xs tracking-normal leading-none whitespace-nowrap rounded-lg border border-solid border-neutral-600 text-neutral-400 w-[350px]"
      />

      <input
        type="text"
        placeholder="Zip/Postal Code"
        className="overflow-hidden px-5 py-4 mt-5 max-w-full text-xs tracking-normal leading-none rounded-lg border border-solid border-neutral-600 text-neutral-400 w-[350px]"
      />

      <div className="flex overflow-hidden gap-2.5 justify-center items-center px-4 py-4 mt-5 w-full text-xs tracking-normal leading-none rounded-lg border-2 border-solid border-neutral-800 text-neutral-600">
        <span className="flex-1 shrink self-stretch my-auto basis-0">
          Select Country
        </span>
        <div className="flex shrink-0 self-stretch my-auto w-5 h-5" />
      </div>
    </form>
  );
}

export default AddressForm;
