"use client";
import * as React from "react";
import ProgressIndicator from "./ProgressIndicator";
import VerificationHeader from "./VerificationHeader";
import UploadImageSection from "./UploadImageSection";
import VerificationInstructions from "./VerificationInstructions";
import LanguageSelector from "./LanguageSelector";

function SignUpScreen() {
  return (
    <main className="overflow-hidden px-4 py-14 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <header className="flex gap-10 justify-between items-center w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4b3bb70a67ee4319f886f95e875e6b0ae8a411f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Company logo"
          className="object-contain shrink-0 self-stretch my-auto aspect-[1.08] w-[43px]"
        />
        <LanguageSelector />
      </header>

      <section className="flex flex-col items-end mt-12 w-full">
        <ProgressIndicator currentStep={4} totalSteps={4} />
      </section>

      <section className="flex flex-col mt-9 w-full">
        <div className="w-full">
          <VerificationHeader />
          <UploadImageSection />
          <VerificationInstructions />
        </div>

        <button
          type="button"
          className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-9 max-w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 w-[325px]"
        >
          Continue
        </button>
      </section>
    </main>
  );
}

export default SignUpScreen;
