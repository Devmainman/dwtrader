import React from "react";

function Button({ children, variant = "primary", className = "", ...props }) {
  const baseClasses =
    "gap-2.5 px-5 py-2.5 text-[12px] w-[full] tracking-normal leading-none text-center rounded-3xl";

  const variantClasses = {
    primary: "bg-blue-600 text-zinc-100",
    secondary: "bg-neutral-800 text-zinc-100",
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}

export default Button;
