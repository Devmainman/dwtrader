"use client";
import React, { useState } from "react";

const DepositInstructions = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="p-4 w-full rounded-xl bg-[#1D1D1F]">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex gap-2.5 items-center">
          <h2 className="flex-1 text-[14px] font-medium tracking-normal leading-4 text-zinc-100">
            Lets Proceed with that Deposit
          </h2>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={
              isExpanded ? "Collapse instructions" : "Expand instructions"
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`w-[18px] h-[18px] transition-transform ${
                isExpanded ? "rotate-90" : "rotate-0"
              }`}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0454 9.00006L7.70966 13.3358L6.91429 12.5404L10.4547 9.00006L6.91429 5.46081L7.70966 4.66431L12.0454 9.00006Z"
                fill="var(--color-blue-600)"
              />
            </svg>
          </button>
        </div>
        <p className="text-[10px] font-medium text-neutral-500">
          To make a deposit, please follow these simple steps:
        </p>
      </div>

      {isExpanded && (
        <>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-1.5 items-start">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[18px] h-[18px] flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9C2.25 10.7902 2.96116 12.5071 4.22703 13.773C5.4929 15.0388 7.20979 15.75 9 15.75ZM8.826 11.73L12.576 7.23L11.424 6.27L8.199 10.1392L6.53025 8.46975L5.46975 9.53025L7.71975 11.7802L8.30025 12.3608L8.826 11.73Z"
                  fill="#8D6612"
                />
              </svg>
              <p className="flex-1 text-[10px] leading-3 text-neutral-400">
                Payment Information: Initiate the payment by transferring the
                funds to the provided payment details.
              </p>
            </div>
            <div className="flex gap-1.5 items-start">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[18px] h-[18px] flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9C2.25 10.7902 2.96116 12.5071 4.22703 13.773C5.4929 15.0388 7.20979 15.75 9 15.75ZM8.826 11.73L12.576 7.23L11.424 6.27L8.199 10.1392L6.53025 8.46975L5.46975 9.53025L7.71975 11.7802L8.30025 12.3608L8.826 11.73Z"
                  fill="#8D6612"
                />
              </svg>
              <p className="flex-1 text-[10px] leading-3 text-neutral-400">
                Proof of Payment: After making the payment, upload the proof of
                payment in the designated section. This ensures a seamless
                update to your account.
              </p>
            </div>
          </div>
          <p className="text-[10px] text-neutral-400">
            Once completed, our team will verify the payment and credit the
            amount to your account promptly. For any assistance, our dedicated
            support team is available to help you.
          </p>
        </>
      )}
    </section>
  );
};

export default DepositInstructions;
