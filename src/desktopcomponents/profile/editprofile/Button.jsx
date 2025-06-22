import React from "react";

function Button({ children, onClick, className = "", variant = "primary" }) {
  const baseClasses =
    "gap-2 mt-3 w-[103px] text-[12px] tracking-normal leading-none text-center rounded-3xl min-h-[31px]";

  const variantClasses = {
    primary: "bg-blue-600 text-zinc-100",
    secondary: "bg-neutral-700 text-zinc-100",
    // Add more variants as needed
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
