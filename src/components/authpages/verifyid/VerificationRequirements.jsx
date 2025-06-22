import React from "react";
import RequirementItem from "./RequirementItem";

function VerificationRequirements({ className = "" }) {
  return (
    <section
      className={`flex overflow-hidden flex-col justify-center px-3.5 py-4 text-xs leading-none rounded-xl bg-zinc-900 text-neutral-400 ${className}`}
    >
      <div className="w-full">
        <p className="text-neutral-400">
          Thank you for registering with our platform! To ensure the security of
          your account and provide you with a seamless experience, we kindly
          request you to upload a scanned copy or clear photograph of your
          government-issued identity card for verification purposes.
        </p>

        <p className="mt-3.5 text-neutral-400">
          The provided identity card should be one of the following:
        </p>

        <RequirementItem text="Passport" className="mt-3.5" />
        <RequirementItem text="National Identity Card" className="mt-3.5" />
        <RequirementItem text="Driver's License" className="mt-3.5" />

        <p className="mt-3.5 text-neutral-400">
          Please make sure that the uploaded document clearly displays the
          following details:
        </p>

        <RequirementItem text="Your full name" className="mt-3.5" />
        <RequirementItem text="Date of birth" className="mt-3.5" />
        <RequirementItem text="Photograph" className="mt-3.5" />
        <RequirementItem text="ID number" className="mt-3.5" />
        <RequirementItem text="Issuing authority" className="mt-3.5" />

        <p className="mt-3.5 text-neutral-400">
          Rest assured that all information you provide will be handled with the
          utmost confidentiality and used solely for verification purposes in
          accordance with our privacy policy.
        </p>
      </div>
    </section>
  );
}

export default VerificationRequirements;
