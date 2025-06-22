"use client";
import * as React from "react";
import LanguageSelector from "./LanguageSelector";
import OtpInput from "./OtpInput";
import ProgressIndicator from "./ProgressIndicator";
import Button from "./Button";

function SignUpScreen() {
  return (
    <main className="flex overflow-hidden flex-col px-10 py-14 bg-neutral-900 min-h-screen max-md:px-5">
      <header className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba0d4a928424dfcc0ecb125dd1d307b1996c4247?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Company logo"
          className="object-contain shrink-0 self-stretch my-auto aspect-[4.83] w-[174px]"
        />
        <LanguageSelector />
      </header>

      <section className="flex overflow-hidden z-10 flex-col justify-center items-center self-center px-12 py-10 -mt-8 max-w-full rounded-3xl border border-solid bg-zinc-900 border-neutral-600 w-[570px] max-md:px-5">
        <div className="w-full font-medium max-w-[470px] max-md:max-w-full">
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

        <PhoneVerification />
        <OtpVerification />
        <ProgressIndicator currentStep={3} totalSteps={3} />
      </section>
    </main>
  );
}

function PhoneVerification() {
  return (
    <div className="mt-8 max-w-full w-[350px]">
      <div className="flex flex-col w-full">
        <div className="w-full">
          <h2 className="text-lg font-medium leading-tight text-zinc-100">
            Verify your Phone Number
          </h2>
          <p className="mt-2.5 text-xs tracking-normal leading-4 text-neutral-400">
            <span className="font-medium text-sm leading-[17px] tracking-[-0.14px] text-[#9f9f9f]">
              We will send you a verification OTP to your Phone number{" "}
            </span>
            <span className="font-medium text-base leading-[19px] tracking-[0.16px] text-blue-600">
              +23482006466489.
            </span>
            <br />
            <span className="font-medium text-sm leading-[17px] tracking-[-0.14px] text-[#9f9f9f]">
              Enter the 6 digit code sent to your phone number
            </span>
          </p>
        </div>
        <div className="flex gap-1.5 items-start self-start mt-5 text-xs">
          <p className="text-neutral-500">Didn't receive the code?</p>
          <p className="font-semibold text-indigo-700">Resend code in 00:50</p>
        </div>
      </div>
      <Button variant="success" className="mt-8 w-full">
        Request OTP
      </Button>
    </div>
  );
}

function OtpVerification() {
  return (
    <div className="flex flex-col mt-8 max-w-full w-[350px]">
      <div className="w-full">
        <h2 className="w-full text-lg font-medium leading-tight text-zinc-100">
          Enter OTP below
        </h2>
        <OtpInput length={6} className="mt-8" />
      </div>
      <Button
        variant="primary"
        className="self-center mt-10 max-w-full w-[325px]"
      >
        Verify
      </Button>
    </div>
  );
}

export default SignUpScreen;
