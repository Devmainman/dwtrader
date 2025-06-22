import React from "react";

function ActionButton({
  children,
  primary = false,
  secondary = false,
  className = "",
  ...props
}) {
  const baseClasses =
    "overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 w-full rounded-3xl min-h-[42px] text-xs tracking-normal leading-none text-center";

  const buttonClasses = primary
    ? `${baseClasses} bg-blue-600 text-zinc-100`
    : secondary
    ? `${baseClasses} text-blue-600`
    : baseClasses;

  return (
    <button className={`${buttonClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default ActionButton;
