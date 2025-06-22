"use client";
import React from "react";

function WithdrawalInputField({ label, placeholder }) {
  return (
    <div className="flex justify-between items-center">
      <label className="text-[10px] w-full font-medium text-neutral-400">{label}</label>
      <div className="flex items-center px-4.5 h-9 rounded-md bg-[#1D1D1F] w-[243px]">
        <input
          type="text"
          placeholder={placeholder}
          className=" text-[10px] bg-transparent text-neutral-400 outline-none"
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default WithdrawalInputField;
