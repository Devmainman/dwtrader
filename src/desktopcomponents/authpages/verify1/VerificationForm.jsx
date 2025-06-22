"use client";
import React from "react";
import UploadSection from "./UploadSection";
import ProgressIndicator from "./ProgressIndicator";

function VerificationForm() {
  return (
    <section className="flex overflow-hidden flex-col justify-center px-12 py-10 rounded-3xl border border-solid bg-zinc-900 border-neutral-600 min-w-60 w-[866px] max-md:px-5 max-md:max-w-full">
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
      <div className="mt-8 w-full max-w-[766px] max-md:max-w-full">
        <div className="max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="w-6/12 max-md:ml-0 max-md:w-full">
              <div className="w-full max-md:mt-10">
                <div className="w-full">
                  <h2 className="text-lg font-medium leading-tight text-zinc-100">
                    Verify your ID card
                  </h2>
                  <p className="mt-4 text-xs tracking-normal leading-4 text-neutral-500">
                    We will need to authenticate your account credibility
                    details with an additional ID verification
                  </p>
                </div>
                <div className="flex overflow-hidden gap-2.5 justify-center items-center px-4 py-4 mt-5 w-full text-xs tracking-normal leading-none rounded-lg border-2 border-solid border-neutral-600 text-neutral-500">
                  <span className="flex-1 shrink self-stretch my-auto basis-0">
                    Method of verification
                  </span>
                  <div className="flex shrink-0 self-stretch my-auto w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="grow max-md:mt-10">
                <p className="text-xs tracking-normal leading-none text-neutral-500">
                  Front page
                </p>
                <UploadSection />
              </div>
            </div>
          </div>
        </div>
        <div className="ml-3.5 w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="w-6/12 max-md:ml-0 max-md:w-full">
              <button className="overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 mt-11 w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 max-md:mt-10">
                Continue
              </button>
            </div>
            <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="grow max-md:mt-10">
                <p className="text-xs tracking-normal leading-none text-neutral-500">
                  Back page
                </p>
                <UploadSection />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProgressIndicator />
    </section>
  );
}

export default VerificationForm;
