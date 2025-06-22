"use client";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";
import CaptchaVerification from "./CaptchaVerification";
import ActionButton from "./ActionButton";

function SignInScreen() {
  return (
    <main className="overflow-hidden px-5 pt-14 pb-40 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <header className="flex gap-10 justify-between items-center w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4b3bb70a67ee4319f886f95e875e6b0ae8a411f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto aspect-[1.08] w-[43px]"
          alt="Logo"
        />
        <LanguageSelector />
      </header>

      <section className="flex flex-col mt-10">
        <div className="w-full">
          <div className="max-w-full text-zinc-100 w-[185px]">
            <h1 className="text-3xl font-medium tracking-normal">Welcome</h1>
            <p className="text-xs tracking-normal leading-none">
              We're so excited to have again
            </p>
          </div>

          <form className="flex overflow-hidden flex-col justify-center mt-5 w-full">
            <div className="w-full">
              <FormInput
                placeholder="Enter your email address"
                errorMessage="Email already exist!"
                hasError={true}
              />

              <PasswordInput placeholder="Enter password" className="mt-5" />

              <PasswordInput placeholder="Confirm password" className="mt-5" />
            </div>
            <p className="mt-1 text-xs text-red-600">Password doesn't match!</p>
          </form>
        </div>

        <CaptchaVerification />

        <div className="self-center mt-11 w-full text-xs tracking-normal leading-none max-w-[330px]">
          <ActionButton primary>Sign Up</ActionButton>
          <ActionButton secondary className="mt-4">
            Already have an account
          </ActionButton>
        </div>
      </section>
    </main>
  );
}

export default SignInScreen;
