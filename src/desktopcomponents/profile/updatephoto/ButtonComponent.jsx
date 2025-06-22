"use client";
import React from "react";

/**
 * A reusable button component with primary and secondary variants
 */
export function ButtonComponent({
  text,
  variant = "primary",
  onClick,
  className = "",
}) {
  // Define button styles based on variant
  const baseStyles =
    "gap-2.5 self-stretch px-2.5 py-2 w-full rounded-3xl min-h-[31px] text-xs";

  const variantStyles = {
    primary: "bg-blue-600 text-zinc-100",
    secondary: "border border-solid border-neutral-500 text-zinc-100",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default ButtonComponent;
