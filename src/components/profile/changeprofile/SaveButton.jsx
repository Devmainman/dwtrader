import React from "react";

const SaveButton = ({ children, onClick, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`mt-6 w-full inline-flex items-center justify-center h-11 px-5 rounded-full bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-500 transition active:scale-[.98] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default SaveButton;