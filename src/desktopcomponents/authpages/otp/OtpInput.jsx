"use client";
import React, { useState, useRef, useEffect } from "react";

function OtpInput({ length = 6, className = "" }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow one digit
    if (value.length > 1) return;

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted data is numeric and has correct length
    if (/^\d+$/.test(pastedData) && pastedData.length <= length) {
      const newOtp = [...otp];

      // Fill OTP array with pasted digits
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }

      setOtp(newOtp);

      // Focus on the next empty input or the last input
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex].focus();
    }
  };

  return (
    <div className={`flex gap-5 items-start w-full ${className}`}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => (inputRefs.current[index] = el)}
            className="flex shrink-0 gap-2 rounded-md border border-solid border-neutral-600 h-[43px] w-[43px] text-center text-zinc-100 bg-transparent focus:outline-none focus:border-blue-600"
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
    </div>
  );
}

export default OtpInput;
