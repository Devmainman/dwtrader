"use client";
import * as React from "react";
import ProgressIndicator from "./ProgressIndicator";

function AddressVerificationForm() {
  return (
    <section className="flex overflow-hidden flex-col grow justify-center px-12 py-10 w-full rounded-3xl border border-solid bg-zinc-900 border-neutral-600 max-md:px-5 max-md:mt-2.5 max-md:max-w-full">
      <div className="max-w-full font-medium w-[470px]">
        <div className="w-full max-md:max-w-full">
          <h1 className="text-5xl tracking-wide text-zinc-100 max-md:max-w-full">
            Welcome
          </h1>
          <p className="text-sm tracking-normal leading-tight text-neutral-400">
            You're a few steps to completing your profile
          </p>
        </div>
        <div className="gap-2.5 self-stretch p-2.5 mt-5 max-w-full text-sm tracking-normal leading-tight rounded-lg bg-neutral-800 text-stone-300 w-[204px]">
          Account Authentication
        </div>
      </div>

      <form className="mt-8 w-full max-w-[720px] max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <h2 className="text-lg font-medium leading-tight text-zinc-100">
            Address Verification
          </h2>
          <p className="mt-1.5 text-xs tracking-normal leading-4 text-neutral-500">
            We will need to authenticate your account credibility details with
            Your Address
          </p>
        </div>

        <div className="flex flex-wrap gap-5 items-start mt-5 w-full text-xs tracking-normal leading-none text-neutral-400 max-md:max-w-full">
          <input
            type="text"
            placeholder="Street Address"
            className="overflow-hidden grow shrink px-5 py-5 rounded-lg border border-solid border-neutral-600 min-w-60 w-[280px] bg-transparent"
          />
          <input
            type="text"
            placeholder="City"
            className="overflow-hidden grow shrink px-5 py-4 whitespace-nowrap rounded-lg border border-solid border-neutral-600 min-w-60 w-[280px] bg-transparent"
          />
          <input
            type="text"
            placeholder="State"
            className="overflow-hidden grow shrink px-5 py-4 whitespace-nowrap rounded-lg border border-solid border-neutral-600 min-w-60 w-[280px] bg-transparent"
          />
          <input
            type="text"
            placeholder="Zip/Postal Code"
            className="overflow-hidden grow shrink px-5 py-4 rounded-lg border border-solid border-neutral-600 min-w-60 w-[280px] bg-transparent"
          />

          <div className="flex overflow-hidden grow shrink gap-2.5 justify-center items-center px-4 py-4 rounded-lg border-2 border-solid border-neutral-800 min-w-60 text-neutral-600 w-[280px]">
            <select className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent border-none outline-none appearance-none">
              <option value="">Select Country</option>
            </select>
            <div className="flex shrink-0 self-stretch my-auto w-5 h-5" />
          </div>
        </div>
      </form>

      <ProgressIndicator />
    </section>
  );
}

export default AddressVerificationForm;
