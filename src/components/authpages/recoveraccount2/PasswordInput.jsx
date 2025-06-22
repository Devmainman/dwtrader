"use client";
import React, { useState } from "react";

function PasswordInput({ placeholder }) {
  const [password, setPassword] = useState("");

  return (
    <input
      type="password"
      placeholder={placeholder}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="px-5 pt-5 pb-4 text-xs tracking-normal rounded-lg border border-solid border-neutral-600 text-neutral-400 bg-transparent w-full"
    />
  );
}

export default PasswordInput;
