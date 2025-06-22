"use client";
import * as React from "react";
import InputField from "./InputField";

function WithdrawalForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex overflow-hidden flex-col px-5 py-7 mx-auto w-full rounded-xl bg-zinc-900 max-md:px-5 max-md:mt-10 max-md:max-w-full"
    >
      <h2 className="self-start text-sm font-medium tracking-normal leading-tight text-neutral-400">
        Make Withdrawal
      </h2>

      <div className="mt-5 w-full max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[57%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col justify-center w-full max-md:mt-10 max-md:max-w-full">
              <div className="flex gap-10 justify-between items-center w-full leading-tight max-md:max-w-full">
                <h3 className="self-stretch my-auto text-base font-medium tracking-normal text-stone-300">
                  Bank Transfer
                </h3>
                <div className="flex gap-2.5 items-center self-stretch my-auto text-xs font-semibold tracking-normal whitespace-nowrap text-zinc-100">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/125b75000dddf88484fe5cdcdec4725199363897a90a4ebcc739f4f35b7cebf9?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                    alt="Bitcoin logo"
                    className="object-contain shrink-0 self-stretch my-auto rounded-3xl aspect-square w-[34px]"
                  />
                  <span className="self-stretch my-auto">Bitcoin</span>
                </div>
              </div>

              <div className="mt-2 max-w-full text-xs w-[437px]">
                <div className="w-full max-md:max-w-full">
                  <InputField
                    label="Amount (NGN)"
                    placeholder="Withdrawal Amount"
                  />

                  <InputField
                    label="Wallet Address"
                    placeholder="...."
                    className="mt-4"
                  />

                  <InputField
                    label="Withdrawal Token"
                    placeholder="Enter Withdrawal Token"
                    className="mt-4"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="ml-5 w-[43%] max-md:ml-0 max-md:w-full">
            <button
              type="submit"
              className="overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 my-auto w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 max-md:mt-10"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default WithdrawalForm;
