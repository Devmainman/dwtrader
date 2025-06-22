"use client";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import VerificationForm from "./VerificationForm";
import ProgressIndicator from "./ProgressIndicator";
import InstructionsSidebar from "./InstructionsSidebar";

function SignUpScreen() {
  return (
    <main className="flex overflow-hidden flex-col px-10 py-16 bg-neutral-900 max-md:px-5">
      <header className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba0d4a928424dfcc0ecb125dd1d307b1996c4247?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Company Logo"
          className="object-contain shrink-0 self-stretch my-auto aspect-[4.83] w-[174px]"
        />
        <LanguageSelector />
      </header>

      <section className="flex flex-wrap gap-2.5 items-start self-center mt-16 max-md:mt-10 max-md:max-w-full">
        <article className="flex overflow-hidden flex-col justify-center px-12 py-10 rounded-3xl border border-solid bg-zinc-900 border-neutral-600 min-w-60 w-[866px] max-md:px-5 max-md:max-w-full">
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

          <VerificationForm />
          <ProgressIndicator />
        </article>

        <InstructionsSidebar />
      </section>
    </main>
  );
}

export default SignUpScreen;
