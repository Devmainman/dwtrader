import React from "react";
import VerificationRequirement from "./VerificationRequirement";

function InstructionsSidebar() {
  return (
    <aside className="flex overflow-hidden flex-col justify-center px-3.5 py-4 text-xs leading-none rounded-xl bg-zinc-900 min-w-60 text-neutral-400 w-[402px]">
      <div className="w-full">
        <div className="w-full">
          <div className="w-full">
            <p className="text-neutral-400">
              Thank you for registering with our platform! To ensure the
              security of your account and provide you with a seamless
              experience, we kindly request you to upload a scanned copy or
              clear photograph of your government-issued identity card for
              verification purposes.
            </p>
            <p className="mt-3.5 text-neutral-400">
              The provided identity card should be one of the following:
            </p>

            <VerificationRequirement text="Passport" />
            <VerificationRequirement text="National Identity Card" />
            <VerificationRequirement text="Driver's License" />

            <p className="mt-3.5 text-neutral-400">
              Please make sure that the uploaded document clearly displays the
              following details:
            </p>

            <VerificationRequirement text="Your full name" />
            <VerificationRequirement text="Date of birth" />
            <VerificationRequirement text="Photograph" />
            <VerificationRequirement text="ID number" />
            <VerificationRequirement text="Issuing authority" />

            <p className="mt-3.5 text-neutral-400">
              Rest assured that all information you provide will be handled with
              the utmost confidentiality and used solely for verification
              purposes in accordance with our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default InstructionsSidebar;
