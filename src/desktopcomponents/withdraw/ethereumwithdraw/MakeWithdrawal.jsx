"use client";
import * as React from "react";
import WithdrawalForm from "./WithdrawalForm";
import WithdrawalInstructions from "./WithdrawalInstructions";

function MakeWithdrawal() {
  return (
    <section className="overflow-hidden pt-10 pr-10 pb-11 pl-0 bg-neutral-900 max-md:px-5 max-md:pt-24">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-[79%] max-md:ml-0 max-md:w-full">
          <WithdrawalForm />
        </div>
        <div className="ml-5 w-[21%] max-md:ml-0 max-md:w-full">
          <WithdrawalInstructions />
        </div>
      </div>
    </section>
  );
}

export default MakeWithdrawal;
