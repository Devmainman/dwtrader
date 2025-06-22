"use client";
import React from "react";
import IconCircle from "./IconCircle";

function VerificationCard() {
  const handleRequestVerification = () => {
    // Handle verification request logic here
    console.log("Verification link requested");
  };

  return (
    <section className="flex flex-col justify-center items-center px-12 py-14 mt-32 rounded-3xl border bg-zinc-900 border-neutral-600 w-[530px] max-md:px-8 max-md:py-10 max-md:mt-24 max-md:w-[90%] max-sm:px-5 max-sm:py-8 max-sm:mt-16 max-sm:w-full">
      <div className="flex flex-col gap-8 items-center w-[330px] max-md:w-full">
        <div className="flex flex-col gap-8 items-center w-[285px] max-md:w-full">
          <IconCircle />
          <div className="flex flex-col gap-1 justify-center items-center">
            <h1 className="text-2xl font-medium tracking-normal leading-7 text-center text-zinc-100 max-md:text-xl max-sm:text-lg">
              Verify Your email
            </h1>
            <p className="text-xs tracking-normal leading-4 text-center text-zinc-100 w-[285px] max-md:w-full">
              <span>We will send you a verification link to your email </span>
              <span className="font-bold">
                showoleadeyeminemson@gmail.cpom.
              </span>
              <span>
                {" "}
                Please check your email inbox to proceed with the verification
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={handleRequestVerification}
          className="p-2.5 w-full text-xs tracking-normal leading-4 bg-green-700 rounded-3xl h-[42px] text-zinc-100"
        >
          Request Verification link
        </button>
      </div>
    </section>
  );
}

export default VerificationCard;
