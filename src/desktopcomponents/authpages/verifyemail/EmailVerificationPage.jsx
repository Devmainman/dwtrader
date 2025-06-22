"use client";
import React from "react";
import Header from "./Header";
import VerificationCard from "./VerificationCard";

function EmailVerificationPage() {
  return (
    <main className="flex flex-col items-center px-10 pt-14 pb-56 w-full bg-neutral-900 min-h-[screen] max-md:px-8 max-md:py-10 max-sm:p-5">
      <Header />
      <VerificationCard />
    </main>
  );
}

export default EmailVerificationPage;
