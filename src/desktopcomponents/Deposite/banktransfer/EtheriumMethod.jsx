"use client";
import React from "react";
import BankTransferForm from "./BankTransferForm";
import PaymentProofUpload from "./PaymentProofUpload";
import DepositInstructions from "./DepositInstructions";

function SelectPaymentMethod() {
  return (
    <section className="overflow-hidden h-[352px] w-[1080px] pt-1 pr-0 pb-20 bg-neutral-900 max-md:px-5 max-md:pt-24">
      <div className="flex gap- max-md:flex-col">
        <div className="w-[79%] max-md:ml-0 max-md:w-full">
          <article className="flex overflow-hidden flex-col px-5 py-7 mx-auto w-full rounded-xl bg-[#1D1D1F] max-md:px-5 max-md:mt-10 max-md:max-w-full">
            <h2 className="self-start text-[14px] font-medium tracking-normal leading-tight text-neutral-400">
              Select Payment method
            </h2>

            {/* Flexbox to display both forms on the same line */}
            <div className="flex gap-10 items-start mt-5 max-md:max-w-full">
              <div className="w-[437px] ">
                <BankTransferForm />
              </div>
              <div className="w-[350px] ">
                <PaymentProofUpload />
              </div>
            </div>
          </article>
        </div>

        <div className="ml-2 w-[21%] max-md:ml-0 max-md:w-full">
          <DepositInstructions />
        </div>
      </div>
    </section>
  );
}

export default SelectPaymentMethod;
