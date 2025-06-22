import React from "react";
import VerificationItem from "./VerificationItem";

function VerificationInstructions() {
  const idTypes = ["Passport", "National Identity Card", "Driver's License"];

  const requiredDetails = [
    "Your full name",
    "Date of birth",
    "Photograph",
    "ID number",
    "Issuing authority",
  ];

  return (
    <article className="flex overflow-hidden flex-col justify-center px-3.5 py-4 mt-8 w-full text-xs leading-none rounded-xl bg-zinc-900 text-neutral-400">
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

            {idTypes.map((type, index) => (
              <VerificationItem key={index} text={type} />
            ))}

            <p className="mt-3.5 text-neutral-400">
              Please make sure that the uploaded document clearly displays the
              following details:
            </p>

            {requiredDetails.map((detail, index) => (
              <VerificationItem key={index} text={detail} />
            ))}

            <p className="mt-3.5 text-neutral-400">
              Rest assured that all information you provide will be handled with
              the utmost confidentiality and used solely for verification
              purposes in accordance with our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default VerificationInstructions;
