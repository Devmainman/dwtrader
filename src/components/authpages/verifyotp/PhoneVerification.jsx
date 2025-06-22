"use client";
import React, { useState } from "react";
import Header from "./Header";
import ProgressIndicator from "./ProgressIndicator";
import VerificationInfo from "./VerificationInfo";
import OtpInput from "./OtpInput";
import ActionButton from "./ActionButton";

function PhoneVerification() {
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(50); // 50 seconds

  const handleRequestOtp = () => {
    setOtpRequested(true);
    // Start the resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = () => {
    // Implement verification logic here
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      console.log("Verifying OTP:", otpValue);
      // Add verification API call here
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <main className="flex flex-col items-center w-full bg-neutral-900 min-h-screen">
      <section className="relative px-5 py-14 w-full max-w-[390px] min-h-screen">
        <Header />
        <ProgressIndicator currentStep={3} totalSteps={3} />

        <VerificationInfo
          phoneNumber="+23482006466489"
          resendTime={formatTime(resendTimer)}
          showResendTimer={otpRequested}
        />

        {otpRequested ? (
          <>
            <section className="flex flex-col gap-8 mb-10">
              <h2 className="text-lg leading-5 text-zinc-100">
                Enter OTP below
              </h2>
              <OtpInput otp={otp} setOtp={setOtp} />
            </section>
            <ActionButton
              text="Verify"
              onClick={handleVerify}
              bgColor="bg-blue-600"
            />
          </>
        ) : (
          <ActionButton
            text="Request OTP"
            onClick={handleRequestOtp}
            bgColor="bg-green-700"
          />
        )}
      </section>
    </main>
  );
}

export default PhoneVerification;
