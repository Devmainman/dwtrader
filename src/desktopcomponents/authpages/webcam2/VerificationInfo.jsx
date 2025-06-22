"use client";
import * as React from "react";

function VerificationInfo() {
  return (
    <div className="flex flex-col w-full max-md:mt-2.5">
      <section className="flex overflow-hidden flex-col justify-center px-3.5 py-4 text-xs rounded-xl bg-zinc-900 text-neutral-400">
        <div className="w-full">
          <div className="w-full">
            <div className="flex gap-2 items-start w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Info icon"
                className="object-contain shrink-0 aspect-square w-[18px]"
              />
              <p className="flex-1 shrink basis-0">
                Thank you for registering with our platform! To ensure the
                security of your account and provide you with a seamless
                experience, we kindly request you to provide your address and
                upload a scanned copy or clear proof of address for verification
                purposes.
              </p>
            </div>

            <div className="flex gap-2 items-start mt-3.5 w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Info icon"
                className="object-contain shrink-0 aspect-square w-[18px]"
              />
              <p>The provided identity card should be one of the following:</p>
            </div>

            <div className="flex gap-2 items-start mt-3.5 w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Info icon"
                className="object-contain shrink-0 aspect-square w-[18px]"
              />
              <p className="flex-1 shrink basis-0">
                Please make sure that the uploaded document clearly displays
                your address:
              </p>
            </div>

            <div className="flex gap-2 items-start mt-3.5 w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Info icon"
                className="object-contain shrink-0 aspect-square w-[18px]"
              />
              <p className="flex-1 shrink basis-0">
                Rest assured that all information you provide will be handled
                with the utmost confidentiality and used solely for verification
                purposes in accordance with our privacy policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-16 max-w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 w-[325px] max-md:mt-10"
      >
        Next
      </button>
    </div>
  );
}

export default VerificationInfo;
