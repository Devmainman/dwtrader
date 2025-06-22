"use client";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import ProgressIndicator from "./ProgressIndicator";
import PasswordInput from "./PasswordInput";
import ProceedButton from "./ProceedButton";

function PasswordChangeScreen() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <main className="relative mx-auto max-w-none rounded-3xl bg-neutral-900 h-[844px] w-[390px] max-md:w-full max-md:h-auto max-md:min-h-screen max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <header className="flex justify-between items-center px-5 pt-14 pb-0 max-sm:px-4 max-sm:pt-8 max-sm:pb-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ecfe5de30fb6227d26ec75e4fd3e471879ab5d5"
            className="h-10 w-[43px]"
            alt="Logo"
          />
          <LanguageSelector />
        </header>

        <section className="px-5 py-0 mt-12 max-sm:px-4">
          <ProgressIndicator currentStep={1} totalSteps={3} />
        </section>

        <section className="px-5 pt-9 pb-0 max-sm:px-4">
          <h1 className="mb-1.5 text-lg font-medium text-zinc-100">
            Change Password
          </h1>
          <p className="text-xs tracking-normal text-neutral-500">
            Choose a new password for your account
          </p>
        </section>

        <section className="flex flex-col gap-5 px-5 pt-10 pb-0 max-sm:px-4">
          <PasswordInput placeholder="Create New Password" />
          <PasswordInput placeholder="Confirm New Password" />
        </section>

        <ProceedButton />
      </main>
    </>
  );
}

export default PasswordChangeScreen;
