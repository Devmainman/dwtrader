import React from "react";

function VerificationInfo({ phoneNumber, resendTime, showResendTimer }) {
  return (
    <section className="flex flex-col gap-8 mb-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg leading-5 text-zinc-100">
          Verify your Phone Number
        </h1>
        <p className="text-xs tracking-normal leading-4 text-neutral-500">
          We will send you a verification OTP to your Phone number
          <span className="font-bold"> {phoneNumber}.</span>
          <span> Enter the 6 digit code sent to your phone number</span>
        </p>
      </div>

      {showResendTimer && (
        <div className="flex gap-1.5 items-center">
          <p className="text-xs text-stone-500">Didn't receive the code?</p>
          <p className="text-xs font-semibold text-indigo-700">
            Resend code in {resendTime}
          </p>
        </div>
      )}
    </section>
  );
}

export default VerificationInfo;
