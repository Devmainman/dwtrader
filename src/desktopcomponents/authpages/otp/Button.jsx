import React from "react";

function Button({ children, variant = "primary", className = "", ...props }) {
  const baseClasses =
    "overflow-hidden gap-2.5 px-2.5 py-3.5 text-xs tracking-normal leading-none rounded-3xl min-h-[42px] text-zinc-100";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-700 hover:bg-green-800",
    secondary: "bg-neutral-700 hover:bg-neutral-800",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
