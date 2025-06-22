"use client";
import React from "react";
import WithdrawalHeader from "./WithdrawalHeader";
import WithdrawalInputField from "./WithdrawalInputField";
import WithdrawalInstructions from "./WithdrawalInstructions";

function WithdrawalForm() {
  return (
    <main className="p-5 w-full bg-neutral-900 min-h-screen">
      <div className="mx-auto max-w-[390px]">
        <WithdrawalHeader />

        <form className="flex flex-col gap-4 mb-6">
          <WithdrawalInputField
            label="Amount (NGN)"
            placeholder="Withdrawal Amount"
          />
          <WithdrawalInputField label="Wallet Address" placeholder="....." />
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
