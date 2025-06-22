"use client";
import * as React from "react";
import InstructionItem from "./InstructionItem";

function WithdrawalInstructions() {
  const instructionItems = [
    {
      text: "Payment Details: Request a withdrawal by providing the necessary payment information, such as your preferred method and account details.",
    },
    {
      text: "Verification: Our team will promptly review your withdrawal request and ensure all the provided details are accurate and complete.",
    },
    {
      text: "Processing: Once verified, your withdrawal will be processed promptly. The processing time may vary based on your chosen payment method.",
    },
    {
      text: "Confirmation: You will receive an email notification confirming the successful completion of your withdrawal.",
    },
  ];

  return (
    <aside className="flex overflow-hidden flex-col grow justify-center px-3.5 py-4 w-full rounded-xl bg-zinc-900 max-md:mt-10">
      <div className="w-full">
        <h2 className="flex-1 shrink gap-2.5 self-stretch w-full text-sm font-medium tracking-normal leading-tight basis-0 text-zinc-100">
          Withdrawal Instructions:
        </h2>

        <div className="mt-3.5 w-full text-xs">
          <p className="text-neutral-400">
            To initiate a withdrawal, please follow these simple steps:
          </p>

          <div className="mt-1.5 w-full leading-4 text-neutral-400">
            {instructionItems.map((item, index) => (
              <InstructionItem
                key={index}
                text={item.text}
                className={index > 0 ? "mt-3.5" : ""}
              />
            ))}

            <p className="mt-3.5 text-neutral-400">
              If you have any questions or require assistance, our dedicated
              support team is available to assist you throughout the withdrawal
              process.
            </p>

            <p className="mt-3.5 text-neutral-400">
              Once completed, our team will verify the payment and credit the
              amount to your account promptly. For any assistance, our dedicated
              support team is available to help you.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default WithdrawalInstructions;
