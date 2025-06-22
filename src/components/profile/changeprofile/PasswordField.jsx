"use client";

import React from "react";

const PasswordField = ({ label, value = "", onChange }) => {
  return (
    <div className="mt-4 w-full first:mt-0">
      <label className="text-neutral-500 text-xs">{label}</label>
      <div className="mt-2.5 w-full whitespace-nowrap text-neutral-600">
        <input
          type="password"
          value={value}
          onChange={onChange}
          className="overflow-hidden gap-2.5 self-stretch p-2.5 w-full rounded-lg bg-neutral-900 min-h-8 text-xs outline-none"
        />
      </div>
    </div>
  );
};

export default PasswordField;