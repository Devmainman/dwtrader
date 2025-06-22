"use client";
import React from "react";

function PaymentInstructions() {
  return (
    <aside className="flex overflow-hidden flex-col justify-center px-5 py-5 mx-auto w-full rounded-xl bg-zinc-900 min-h-[352px] max-md:mt-10">
      <div className="w-full font-medium">
        <h2 className="flex-1 shrink gap-2.5 self-stretch w-full text-sm tracking-normal leading-4 basis-0 text-zinc-100">
          Lets Proceed with that Deposit
        </h2>
        <p className="mt-3 text-xs text-neutral-500">
          To make a deposit, please follow these simple steps:
        </p>
      </div>
      <div className="flex gap-1.5 items-start mt-5 w-full text-xs leading-4 text-neutral-400">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e9e9d8ddfd919bbe933ecd04837b89a029ae6bab454b9d47f24949776978d45?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Bullet point"
          className="object-contain shrink-0 aspect-square w-[18px]"
        />
        <p className="flex-1 shrink basis-0">
          Payment Information: Initiate the payment by transferring the funds to
          the provided payment details.{" "}
        </p>
      </div>
      <div className="flex gap-1.5 items-start mt-5 w-full text-xs leading-4 text-neutral-400">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e9e9d8ddfd919bbe933ecd04837b89a029ae6bab454b9d47f24949776978d45?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Bullet point"
          className="object-contain shrink-0 aspect-square w-[18px]"
        />
        <p className="flex-1 shrink basis-0">
          Proof of Payment: After making the payment, upload the proof of
          payment in the designated section. This ensures a seamless update to
          your account.
        </p>
      </div>
      <p className="mt-5 text-xs text-neutral-400">
        Once completed, our team will verify the payment and credit the amount
        to your account promptly. For any assistance, our dedicated support team
        is available to help you.
      </p>
    </aside>
  );
}

export default PaymentInstructions;
