"use client";
import React from "react";
import ProfileForm from "./ProfileForm";

function InputDesign() {
  return (
    <section className="flex flex-col items-center p-5 w-full bg-black min-h-[screen]">
      <div className="flex flex-col gap-2.5 w-[351px]">
        <ProfileForm />
      </div>
    </section>
  );
}

export default InputDesign;
