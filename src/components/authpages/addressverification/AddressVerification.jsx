"use client";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import ProgressIndicator from "./ProgressIndicator";
import AddressForm from "./AddressForm";
import InfoSection from "./InfoSection";

function AddressVerification() {
  return (
    <main className="flex overflow-hidden flex-col px-4 py-14 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <header className="flex gap-10 justify-between items-center w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4b3bb70a67ee4319f886f95e875e6b0ae8a411f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto aspect-[1.08] w-[43px]"
          alt="Logo"
        />
        <LanguageSelector />
      </header>

      <div className="mt-12 w-full">
        <ProgressIndicator currentStep={4} totalSteps={4} />
      </div>

      <div className="mt-9 w-full">
        <AddressForm />
      </div>

      <button
        type="submit"
        className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-8 w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl max-w-[325px] min-h-[42px] text-zinc-100"
      >
        Next
      </button>

      <InfoSection />
    </main>
  );
}

export default AddressVerification;
