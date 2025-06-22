"use client";
import React from "react";

function FormInput({ 
  name = "", 
  type = "text", 
  value = "",  // Ensure default is empty string, not undefined
  onChange = () => {}, 
  placeholder = "", 
  error 
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex items-center px-5 py-5 rounded-lg border ${
        error ? "border-red-500" : "border-neutral-600"
      } h-[51px]`}>
        <input
          name={name}
          type={type}
          value={value}  // Will never be undefined
          onChange={onChange}
          placeholder={placeholder}
          className="w-full text-xs bg-transparent text-neutral-400 outline-none"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default FormInput;