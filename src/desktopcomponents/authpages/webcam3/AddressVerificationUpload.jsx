"use client";
import * as React from "react";
import LanguageSelector from "./LanguageSelector";
import UploadImageButton from "./UploadImageButton";
import ProgressIndicator from "./ProgressIndicator";
import InfoSidebar from "./InfoSidebar";

function AddressVerificationUpload() {
  return (
    <main className="flex overflow-hidden flex-col px-10 py-12 bg-neutral-900 max-md:px-5">
      <header className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba0d4a928424dfcc0ecb125dd1d307b1996c4247?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Company Logo"
          className="object-contain shrink-0 self-stretch my-auto aspect-[4.83] w-[174px]"
        />
        <LanguageSelector />
      </header>

      <section className="self-end mt-16 mr-16 max-w-full w-[901px] max-md:mt-10 max-md:mr-2.5">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[64%] max-md:ml-0 max-md:w-full">
            <article className="flex overflow-hidden flex-col justify-center items-center px-12 py-10 mx-auto w-full rounded-3xl border border-solid bg-zinc-900 border-neutral-600 max-md:px-5 max-md:mt-2.5 max-md:max-w-full">
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

              <div className="mt-8 max-w-full w-[350px]">
                <div className="w-full">
                  <h2 className="text-lg font-medium leading-tight text-zinc-100">
                    Address Verification
                  </h2>
                  <p className="mt-1.5 text-xs tracking-normal leading-4 text-neutral-500">
                    We will need to authenticate your account credibility
                    details with Your Address
                  </p>
                </div>

                <UploadImageButton />
              </div>

              <div className="flex gap-4 items-center mt-8 text-xs tracking-normal leading-none whitespace-nowrap text-zinc-100">
                <button className="overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 my-auto rounded-3xl border border-solid bg-zinc-900 border-[color:var(--Primary-Blue,#E8742A)] min-h-[42px] w-[167px]">
                  Back
                </button>
                <button className="overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 my-auto bg-blue-600 rounded-3xl min-h-[42px] w-[167px]">
                  Submit
                </button>
              </div>

              <ProgressIndicator currentStep={1} totalSteps={4} />
            </article>
          </div>

          <div className="ml-5 w-[36%] max-md:ml-0 max-md:w-full">
            <InfoSidebar />
          </div>
        </div>
      </section>
    </main>
  );
}

export default AddressVerificationUpload;
