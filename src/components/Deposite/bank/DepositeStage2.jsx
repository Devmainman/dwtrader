"use client";
import React from "react";
import BankTransferInfo from "./BankTransferInfo";
import AmountInput from "./AmountInput";
import UploadProof from "./UploadProof";
import InstructionsPanel from "./InstructionsPanel";

function DepositeStage2() {
  return (
    <section className="flex overflow-hidden flex-col px-5 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <div className="w-full">
        <BankTransferInfo />
        <AmountInput />
      </div>
      <UploadProof />
      <button className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-5 w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl max-w-[325px] min-h-[42px] text-zinc-100">
        Submit
      </button>
      <InstructionsPanel />
    </section>
  );
}

export default DepositeStage2;

