"use client";
import React from "react";
import WithdrawalHeader from "./WithdrawalHeader";
import WithdrawalInputField from "./WithdrawalInputField";
import WithdrawalInstructions from "./WithdrawalInstructions";

function WithdrawalForm() {
  return (
    <main className="bg-neutral-900">
      <div className="w-full">
        <WithdrawalHeader />

        <form className="flex flex-col gap-4 mb-6">
          <WithdrawalInputField
            label="Amount (NGN)"
            placeholder="Withdrawal Amount"
          />
          <WithdrawalInputField label="Bank Name" placeholder="...." />
          <WithdrawalInputField label="Account Name" placeholder="....." />
          <WithdrawalInputField label="Account Number" placeholder="....." />
          <WithdrawalInputField
            label="Withdrawal Token"
            placeholder="Enter Withdrawal Token"
          />
        </form>

        <WithdrawalInstructions />
      </div>
    </main>
  );
}

export default WithdrawalForm;
