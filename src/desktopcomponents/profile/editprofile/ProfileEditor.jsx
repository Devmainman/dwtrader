"use client";
import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import Button from "./Button";

function ProfileEditor() {
  return (
    <section className="flex overflow-hidden flex-col px-5 py-6 rounded-xl h-[357px] w-[545px] bg-[var(--card)] max-md:px-5">
  <header className="text-[14px] mb-6 font-medium tracking-normal leading-tight text-neutral-400 max-md:max-w-full">
    Edit Profile Information
  </header>

  <div className="flex flex-row justify-between gap-6 w-full">
    {/* Left Column */}
    <div className="flex flex-col w-1/2 min-w-[196px]">
      <InputField
        label="First Name"
        value="Benson"
        readOnly
        className="text-sm" // Font size for the input field
      />
      <InputField
        label="Phone Number"
        value="+2348100649504"
        readOnly
        className="text-sm" // Font size for the input field
      />
      <SelectField label="Country" placeholder="Choose" className="" /> {/* Font size for select field */}
    </div>

    {/* Right Column */}
    <div className="flex flex-col w-1/2 min-w-[196px]">
      <InputField
        label="Last Name"
        value="Showole"
        readOnly
        className="text-sm" // Font size for the input field
      />
      <SelectField label="Gender" placeholder="Choose" className="text-sm" /> {/* Font size for select field */}
    </div>
  </div>

  <Button className="mt">Save Changes</Button>
</section>

  );
}

export default ProfileEditor;
