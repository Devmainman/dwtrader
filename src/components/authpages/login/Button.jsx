import React from "react";

function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  onClick,
}) {
  const baseClasses =
    "w-full text-xs tracking-normal leading-4 rounded-3xl h-[42px] text-zinc-100";

  const variantClasses = {
    primary: "bg-blue-600",
    secondary: "border border-blue-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
