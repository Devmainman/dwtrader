"use client";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import VerificationContent from "./VerificationContent";

function SignInScreen() {
  return (
    <main className="flex overflow-hidden flex-col px-5 pt-14 pb-72 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <header className="flex gap-10 justify-between items-center w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4b3bb70a67ee4319f886f95e875e6b0ae8a411f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Logo"
          className="object-contain shrink-0 self-stretch my-auto aspect-[1.08] w-[43px]"
        />
        <LanguageSelector />
      </header>
      <VerificationContent />
    </main>
  );
}

export default SignInScreen;
