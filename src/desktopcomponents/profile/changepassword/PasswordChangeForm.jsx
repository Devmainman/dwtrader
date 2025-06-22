"use client";
import React, { useState } from "react";
import FormHeading from "./FormHeading";
import PasswordField from "./PasswordField";
import SaveButton from "./SaveButton";

function PasswordChangeForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password change submission
    console.log({ oldPassword, newPassword, confirmPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex overflow-hidden flex-col items-start py-8 pr-10 pl-9 rounded-xl bg-[#1D1D1F] h-[359px] w-[545px] max-w-auto max-md:px-5"
    >
      <FormHeading />

      <div className="self-center mt-5 max-w-full text-[10px] w-[245px]">
        <PasswordField
          label="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-4"
        />

        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-4"
        />
      </div>

      <SaveButton />
    </form>
  );
}

export default PasswordChangeForm;
