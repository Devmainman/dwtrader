"use client";
import React, { useState } from "react";

function EmailInput() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="mt-10">
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="Enter your email address"
        className="w-full px-5 py-5 text-xs tracking-normal leading-4 rounded-lg border border-neutral-600 h-[51px] text-neutral-400 bg-transparent focus:outline-none focus:border-blue-600"
      />
    </div>
  );
}

export default EmailInput;
