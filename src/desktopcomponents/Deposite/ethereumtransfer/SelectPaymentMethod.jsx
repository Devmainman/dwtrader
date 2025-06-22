"use client";
import * as React from "react";
import PaymentForm from "./PaymentForm";
import PaymentInstructions from "./PaymentInstructions";

function SelectPaymentMethod() {
  return (
    <section className="overflow-hidden pt-96 pr-10 pb-20 pl-20 bg-neutral-900 max-md:px-5 max-md:pt-24">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-[79%] max-md:ml-0 max-md:w-full">
          <PaymentForm />
        </div>
        <div className="ml-5 w-[21%] max-md:ml-0 max-md:w-full">
          <PaymentInstructions />
        </div>
      </div>
    </section>
  );
}

export default SelectPaymentMethod;
