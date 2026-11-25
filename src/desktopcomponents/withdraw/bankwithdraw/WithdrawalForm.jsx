import React from "react";
import FormField from "./FormField";
import Button from "./Button";

function WithdrawalForm() {
  return (
    <article className="flex overflow-hidden flex-col px-5 pt-6 pb-11 mx-auto w-full rounded-xl bg-[var(--card)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
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
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d1b87dee10b71877ef9cfc9ac305feb7c4decf071319fa852808fd06aca6fd4?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                    className="object-contain shrink-0 self-stretch my-auto aspect-square w-[34px]"
                    alt="Bank icon"
                  />
                  <span className="self-stretch my-auto">Bank</span>
                </div>
              </div>
              <div className="mt-2 max-w-full text-xs w-[437px]">
                <div className="w-full max-md:max-w-full">
                  <FormField
                    label="Amount (NGN)"
                    placeholder="Withdrawal Amount"
                  />
                  <FormField
                    label="Bank Name"
                    placeholder="...."
                    className="mt-4"
                  />
                  <FormField
                    label="Account Name"
                    placeholder="....."
                    className="mt-4"
                  />
                  <FormField
                    label="Account Number"
                    placeholder="....."
                    className="mt-4"
                  />
                  <FormField
                    label="Withdrawal Token"
                    placeholder="Enter Withdrawal Token"
                    className="mt-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ml-5 w-[43%] max-md:ml-0 max-md:w-full">
            <Button className="max-md:mt-10">Submit</Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default WithdrawalForm;
