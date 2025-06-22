"use client";
import * as React from "react";
import AddressVerificationForm from "./AddressVerificationForm";
import VerificationInfo from "./VerificationInfo";

function WebcamCapture() {
  return (
    <main className="flex overflow-hidden flex-col px-10 pt-14 pb-24 bg-neutral-900 max-md:px-5">
      <header className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba0d4a928424dfcc0ecb125dd1d307b1996c4247?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Logo"
          className="object-contain shrink-0 self-stretch my-auto aspect-[4.83] w-[174px]"
        />
        <div className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-1.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[165px]">
          <div className="flex gap-1.5 items-center self-stretch my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/47e29e9a5b12fd4be4f46400d5c3e47bf3d50091?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Language icon"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe8114f191a4eaa7f5b5fefa446b486122890a72?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Arrow icon"
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
          </div>
          <span className="self-stretch my-auto text-xs text-neutral-500">
            Select Language
          </span>
        </div>
      </header>

      <section className="self-center mt-16 w-full max-w-[1232px] max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[67%] max-md:ml-0 max-md:w-full">
            <AddressVerificationForm />
          </div>
          <div className="ml-5 w-[33%] max-md:ml-0 max-md:w-full">
            <VerificationInfo />
          </div>
        </div>
      </section>
    </main>
  );
}

export default WebcamCapture;
