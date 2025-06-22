import React from "react";

function VerificationMethod() {
  return (
    <div className="grow shrink min-w-60 w-[285px]">
      <div className="w-full">
        <h2 className="text-lg font-medium leading-tight text-zinc-100">
          Verify your ID card
        </h2>
        <p className="mt-4 text-xs tracking-normal leading-4 text-neutral-500">
          We will need to authenticate your account credibility details with an
          additional ID verification
        </p>
      </div>
      <div className="flex overflow-hidden gap-2.5 justify-center items-center px-4 py-4 mt-5 w-full text-xs tracking-normal leading-none rounded-lg border-2 border-solid border-neutral-600 text-neutral-500">
        <span className="flex-1 shrink self-stretch my-auto basis-0">
          Method of verification
        </span>
        <div className="flex shrink-0 self-stretch my-auto w-5 h-5" />
      </div>
    </div>
  );
}

export default VerificationMethod;
