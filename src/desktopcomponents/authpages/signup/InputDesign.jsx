"use client";
import React from "react";
import Header from "./Header";
import SignUpForm from "./SignUpForm";

function InputDesign() {
  return (
    <main className="flex flex-col text-white bg-neutral-900 min-h-[screen]">
      <Header />
      <section className="flex justify-center items-center px-5 max-sm:px-4">
        <SignUpForm />
      </section>
    </main>
  );
}

export default InputDesign;
