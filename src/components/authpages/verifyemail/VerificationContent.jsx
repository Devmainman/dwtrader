"use client";
import React from "react";
import VerificationButton from "./VerificationButton";

function VerificationContent() {
  return (
    <section className="flex flex-col self-center mt-48 w-full text-zinc-100">
      <div className="flex flex-col self-center max-w-full text-center w-[285px]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f5d6df7af0bdee927fb5c7d9092ea475aad7bb27?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Verification icon"
          className="object-contain self-center aspect-square rounded-[40px] w-[76px]"
        />
        <div className="flex flex-col justify-center mt-8 w-full">
          <h1 className="self-center text-2xl font-medium tracking-normal leading-tight">
            Verify Your email
          </h1>
          <p className="text-xs tracking-normal leading-4">
            We will send you a verification link to your email{" "}
            <span className="font-semibold">
              showoleadeyeminemson@gmail.cpom.{" "}
            </span>
            Please check your email inbox to proceed with the verification
          </p>
        </div>
      </div>
      <VerificationButton />
    </section>
  );
}

export default VerificationContent;
