"use client";
import * as React from "react";
import PaymentMethodForm from "./PaymentMethodForm";
import PaymentProofUpload from "./PaymentProofUpload";
import DepositInstructions from "./DepositInstructions";

function SelectPaymentMethod() {
  return (
    <section
      className="overflow-hidden ml-0 bg-neutral-900 max-md:px-auto max-md:pt-auto"
      space={10}
    >
      <div className="flex gap-0 max-md:flex-col">
        <div className="w-[79%] max-md:ml-0 max-md:w-full">
          <article className="flex overflow-hidden flex-col px-5 py-7 mx-auto w-full rounded-xl bg-zinc-900 max-md:px-5 max-md:mt-10 max-md:max-w-full">
            <h2 className="self-start text-[14px] font-medium tracking-normal leading-tight text-neutral-400">
              Select Payment method
            </h2>
            <div className="flex flex gap-1 justify-between items-start mt- max-md:max-w-full">
              <PaymentMethodForm />
              <PaymentProofUpload />
            </div>
          </article>
        </div>
        <div className="ml-5 w-[21%] max-md:ml-0 max-md:w-full">
          <DepositInstructions />
        </div>
      </div>
    </section>
  );
}

export default SelectPaymentMethod;
