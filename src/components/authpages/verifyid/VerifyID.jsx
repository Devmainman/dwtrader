"use client";
import React from "react";
import ProgressIndicator from "./ProgressIndicator";
import ImageUploadSection from "./ImageUploadSection";
import VerificationRequirements from "./VerificationRequirements";

function VerifyID() {
  return (
    <main className="flex overflow-hidden flex-col px-4 py-14 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <header className="flex gap-10 justify-between items-center w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4b3bb70a67ee4319f886f95e875e6b0ae8a411f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto aspect-[1.08] w-[43px]"
          alt="Logo"
        />
        <button className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-1.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[165px]">
          <div className="flex gap-1.5 items-center self-stretch my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b88faece91f79d1a7f706589aff2deaebece96e2?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              alt="Language icon"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c72e8739b18dba6f14a8a80c45fd199c01c7331?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              alt="Arrow icon"
            />
          </div>
          <span className="self-stretch my-auto text-xs text-neutral-600">
            Select Language
          </span>
        </button>
      </header>

      <ProgressIndicator step={4} totalSteps={4} className="mt-12" />

      <section className="mt-9">
        <div className="w-full">
          <div className="w-full">
            <h1 className="text-lg font-medium leading-tight text-zinc-100">
              Verify your ID card
            </h1>
            <p className="mt-1.5 text-xs tracking-normal leading-4 text-neutral-500">
              We will need to authenticate your account credibility details with
              an additional ID verification
            </p>
          </div>
          <div className="flex overflow-hidden gap-2.5 justify-center items-center px-4 py-4 mt-5 w-full text-xs tracking-normal leading-none rounded-lg border-2 border-solid border-neutral-600 text-neutral-500">
            <span className="flex-1 shrink self-stretch my-auto basis-0">
              Method of verification
            </span>
            <div className="flex shrink-0 self-stretch my-auto w-5 h-5" />
          </div>
        </div>

        <ImageUploadSection title="Front page" className="mt-8" />
        <ImageUploadSection title="Back page" className="mt-8" />
      </section>

      <VerificationRequirements className="mt-8" />

      <button className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-9 w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl max-w-[325px] min-h-[42px] text-zinc-100">
        Continue
      </button>
    </main>
  );
}

export default VerifyID;
