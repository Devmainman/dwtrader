import React from "react";

function InfoSection() {
  return (
    <article className="overflow-hidden px-3 py-4 mt-8 w-full rounded-xl bg-[#1D1D1F]">
      <header className="w-full font-medium">
        <div className="flex gap-2.5 items-center w-full text-[14px] tracking-normal leading-tight text-zinc-100">
          <h2 className="flex-1 shrink self-stretch my-auto basis-0">
            Lets Proceed with that Deposit
          </h2>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/28f76ca51ab932c417ae5480603e7ceb025031fd?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
            alt="Information icon"
          />
        </div>
        <p className="mt-3 text-[10px] text-neutral-500">
          To make a deposit, please follow these simple steps:
        </p>
      </header>

      <div className="flex gap-1.5 items-start mt-1.5 text-[10px] leading-4 text-neutral-400">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 aspect-square w-[18px]"
          alt="Step icon"
        />
        <p className="flex-1 shrink basis-0">
          Payment Information: Initiate the payment by transferring the funds to
          the provided payment details.{" "}
        </p>
      </div>

      <div className="flex gap-1.5 items-start mt-4 text-[10px] leading-4 text-neutral-400">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 aspect-square w-[18px]"
          alt="Step icon"
        />
        <p className="flex-1 shrink basis-0">
          Proof of Payment: After making the payment, upload the proof of
          payment in the designated section. This ensures a seamless update to
          your account.
        </p>
      </div>

      <p className="mt-4 text-[10px] text-neutral-400">
        Once completed, our team will verify the payment and credit the amount
        to your account promptly. For any assistance, our dedicated support team
        is available to help you.
      </p>
    </article>
  );
}

export default InfoSection;
