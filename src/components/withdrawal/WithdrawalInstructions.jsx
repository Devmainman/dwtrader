"use client";
import React, { useState } from "react";
import InstructionItem from "./InstructionItem";

function WithdrawalInstructions() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
    <section className="px-3.5 py-4 rounded-xl bg-[var(--card)]">
      <div className="flex flex-col gap-3.5">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium tracking-normal leading-4 text-zinc-100">
            Withdrawal Instructions:
          </h2>
          <button
            onClick={toggleExpand}
            aria-expanded={isExpanded}
            aria-controls="instructions-content"
            className="focus:outline-none"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`w-[18px] h-[18px] transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0454 8.99981L7.70966 13.3356L6.91429 12.5402L10.4547 8.99981L6.91429 5.46056L7.70966 4.66406L12.0454 8.99981Z"
                fill="var(--color-blue-600)"
              />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <div id="instructions-content">
            <p className="text-[10px] text-neutral-400">
              To initiate a withdrawal, please follow these simple steps:
            </p>

            <div className="flex flex-col gap-3.5 mt-3.5">
              {instructionItems.map((item, index) => (
                <InstructionItem key={index} text={item.text} />
              ))}
            </div>

            <p className="mt-3.5 text-[10px] text-neutral-400">
              If you have any questions or require assistance, our dedicated
              support team is available to assist you throughout the withdrawal
              process.
            </p>

            <p className="mt-3.5 text-[10px] text-neutral-400">
              Once completed, our team will verify the payment and credit the
              amount to your account promptly. For any assistance, our dedicated
              support team is available to help you.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default WithdrawalInstructions;
