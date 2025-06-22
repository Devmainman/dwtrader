"use client";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import StepIndicator from "./StepIndicator";
import FormField from "./FormField";
import SelectField from "./SelectField";

function InputDesign() {
  return (
    <section className="relative p-5 mx-auto max-w-none rounded-3xl bg-neutral-900 min-h-[991px] w-[390px] max-md:max-w-[991px] max-sm:p-4 max-sm:w-full max-sm:max-w-screen-sm">
      <header className="flex justify-between items-center mb-8 max-sm:mb-5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ecfe5de30fb6227d26ec75e4fd3e471879ab5d5"
          className="h-10 w-[43px]"
          alt="Logo"
        />
        <LanguageSelector />
      </header>

      <StepIndicator currentStep={2} totalSteps={3} />

      <div className="mb-10">
        <div>
          <h1 className="mb-1 text-3xl font-medium text-zinc-100 max-sm:text-3xl">
            Welcome
          </h1>
          <p className="mb-5 text-xs text-zinc-100">
            You're a few steps to completing your profile
          </p>
        </div>
        <div className="p-2.5 text-sm rounded-lg bg-zinc-900 text-stone-300">
          Account Authentication
        </div>
      </div>

      <form className="flex flex-col gap-5 mb-8 max-sm:gap-4">
        <FormField type="text" placeholder="Enter your First Name" />
        <FormField type="text" placeholder="Enter your Last Name" />
        <FormField
          type="email"
          value="Shwoleadeyemibenson@gmail.com"
          disabled={true}
        />
        <SelectField label="Select Country" />
        <div className="flex gap-2.5 items-center px-4 py-4 w-full rounded-lg border border-solid border-neutral-600">
          <span className="text-xs text-stone-300">+234</span>
          <input
            type="tel"
            placeholder="Enter your Phone Number"
            className="w-full text-xs border-none bg-transparent outline-none text-neutral-500"
          />
        </div>
        <SelectField label="Select Gender" />
        <SelectField label="Select Currency" />
      </form>

      <button className="absolute left-8 text-xs bg-blue-600 rounded-3xl cursor-pointer border-none bottom-[58px] h-[42px] text-zinc-100 w-[325px] max-sm:left-[15px] max-sm:w-[calc(100%_-_30px)]">
        Continue
      </button>
    </section>
  );
}

export default InputDesign;
