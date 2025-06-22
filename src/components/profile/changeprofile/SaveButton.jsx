import React from "react";

const SaveButton = ({ children, onClick, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`gap-2.5 self-stretch px-2.5 py-2 mt-10 ml-4 text-xs tracking-normal leading-none text-center bg-blue-600 rounded-3xl min-h-[31px] text-zinc-100 w-full ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default SaveButton;