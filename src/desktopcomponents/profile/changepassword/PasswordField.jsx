"use client";
import React, { useState } from "react";

function PasswordField({ label, value, onChange, className = "" }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      <label
        className="text-neutral-500"
        htmlFor={`password-${label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        {label}
      </label>
      <div className="mt-2.5 w-full whitespace-nowrap text-neutral-600">
        <input
          type="password"
          id={`password-${label.replace(/\s+/g, "-").toLowerCase()}`}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="1234..."
          className="overflow-hidden w-full p-2.5 rounded-lg bg-neutral-900 min-h-8 text-neutral-600 outline-none"
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default PasswordField;
