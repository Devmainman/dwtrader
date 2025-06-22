import React from "react";

function Button({ children, onClick }) {
  return (
    <button
      className="px-2.5 text-xs tracking-normal leading-4 bg-blue-600 rounded-3xl h-[31px] text-zinc-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
