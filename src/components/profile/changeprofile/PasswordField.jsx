"use client";

import React from "react";

const PasswordField = ({ label, value = "", onChange }) => {
  return (
    <div className="mt-4 w-full first:mt-0">
      <label className="text-[11px] font-medium text-neutral-400">{label}</label>
      <div className="mt-1.5 w-full">
        <input
          type="password"
          value={value}
          onChange={onChange}
          className="w-full h-11 rounded-xl bg-white/[.04] border border-white/10 px-3.5 text-[13px] text-zinc-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition"
        />
      </div>
    </div>
  );
};

export default PasswordField;