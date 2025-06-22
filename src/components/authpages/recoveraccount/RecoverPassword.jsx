"use client";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import ProgressIndicator from "./ProgressIndicator";
import EmailInput from "./EmailInput";
import ActionButton from "./ActionButton";

function RecoverPassword() {
  return (
    <main className="flex justify-center w-full bg-neutral-900 min-h-[screen]">
      <section className="relative px-5 rounded-3xl bg-neutral-900 min-h-[844px] w-[390px]">
        <header className="flex justify-between items-center pt-14 h-10">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ecfe5de30fb6227d26ec75e4fd3e471879ab5d5"
            alt="Company logo"
          />
          <LanguageSelector />
        </header>

        <ProgressIndicator currentStep={1} totalSteps={3} />

        <section className="flex flex-col gap-1.5 mt-9">
          <h1 className="text-lg leading-5 text-zinc-100">Recover Password</h1>
          <p className="text-xs tracking-normal leading-4 text-neutral-500">
            Lets recover your account by providing the email attached to your
            account
          </p>
        </section>

        <EmailInput />

        <div className="flex justify-center mt-10">
          <ActionButton text="Send Code" />
        </div>
      </section>
    </main>
  );
}

export default RecoverPassword;
