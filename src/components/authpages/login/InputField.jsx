"use client";
import React from "react";

function InputField({
  type = "text",
  placeholder,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
}) {
  const isPasswordField = type === "password";

  return (
    <div className="relative">
      <input
        type={isPasswordField && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-5 py-4 w-full text-xs tracking-normal leading-4 bg-transparent rounded-lg border border-neutral-600 h-[51px] text-neutral-400"
      />

      {isPasswordField && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-[20px] top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3.33333C10.6667 3.33333 12.9467 5.06 13.7333 7.5C12.9467 9.94 10.6667 11.6667 8 11.6667C5.33333 11.6667 3.05333 9.94 2.26667 7.5C3.05333 5.06 5.33333 3.33333 8 3.33333ZM8 2C4.66667 2 1.82 4.07333 0.666672 7C1.82 9.92667 4.66667 12 8 12C11.3333 12 14.18 9.92667 15.3333 7C14.18 4.07333 11.3333 2 8 2ZM8 5.5C8.92047 5.5 9.66667 6.24619 9.66667 7.16667C9.66667 8.08714 8.92047 8.83333 8 8.83333C7.07953 8.83333 6.33333 8.08714 6.33333 7.16667C6.33333 6.24619 7.07953 5.5 8 5.5ZM8 4.16667C6.34267 4.16667 5 5.50933 5 7.16667C5 8.824 6.34267 10.1667 8 10.1667C9.65733 10.1667 11 8.824 11 7.16667C11 5.50933 9.65733 4.16667 8 4.16667Z"
                fill="#9F9F9F"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3.33333C10.6667 3.33333 12.9467 5.06 13.7333 7.5C12.9467 9.94 10.6667 11.6667 8 11.6667C5.33333 11.6667 3.05333 9.94 2.26667 7.5C3.05333 5.06 5.33333 3.33333 8 3.33333ZM8 2C4.66667 2 1.82 4.07333 0.666672 7C1.82 9.92667 4.66667 12 8 12C11.3333 12 14.18 9.92667 15.3333 7C14.18 4.07333 11.3333 2 8 2ZM8 5.5C8.92047 5.5 9.66667 6.24619 9.66667 7.16667C9.66667 8.08714 8.92047 8.83333 8 8.83333C7.07953 8.83333 6.33333 8.08714 6.33333 7.16667C6.33333 6.24619 7.07953 5.5 8 5.5ZM8 4.16667C6.34267 4.16667 5 5.50933 5 7.16667C5 8.824 6.34267 10.1667 8 10.1667C9.65733 10.1667 11 8.824 11 7.16667C11 5.50933 9.65733 4.16667 8 4.16667Z"
                fill="#9F9F9F"
              />
              <path
                d="M2.66667 2L13.3333 12.6667"
                stroke="#9F9F9F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export default InputField;
