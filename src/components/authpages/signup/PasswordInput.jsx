"use client";
import React, { useState } from "react";

function PasswordInput({ placeholder, className = "", ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`flex overflow-hidden flex-col justify-center px-5 py-4 w-full rounded-lg border border-solid border-neutral-600 max-w-[350px] ${className}`}
    >
      <div className="flex gap-10 justify-between items-center w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none w-full text-xs tracking-normal leading-none text-neutral-400"
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="focus:outline-none"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/77f40d0871b6a2013fce098ba39562ffa93a361e?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto aspect-[1.25] w-[15px]"
            alt={showPassword ? "Hide password" : "Show password"}
          />
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
