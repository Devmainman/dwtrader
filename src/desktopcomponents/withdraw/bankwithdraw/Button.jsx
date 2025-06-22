import React from "react";

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 my-auto w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
