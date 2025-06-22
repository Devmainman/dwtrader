"use client";
import React from "react";
import Header from "./Header";
import VerificationForm from "./VerificationForm";
import InstructionsSidebar from "./InstructionsSidebar";

function SignUpScreen() {
  return (
    <div className="flex overflow-hidden flex-col px-10 py-14 bg-neutral-900 max-md:px-5">
      <Header />
      <div className="flex flex-wrap gap-2.5 items-start self-center mt-16 max-md:mt-10 max-md:max-w-full">
        <VerificationForm />
        <InstructionsSidebar />
      </div>
    </div>
  );
}

export default SignUpScreen;
