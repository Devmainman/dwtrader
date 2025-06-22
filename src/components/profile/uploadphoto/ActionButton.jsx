import React from "react";

function ActionButton({ label, primary = false, onClick, className = "" }) {
  const baseClasses =
    "gap-2.5 self-stretch px-2.5 py-2 w-full rounded-3xl min-h-[31px]";
  const primaryClasses = "bg-blue-600";
  const secondaryClasses = "border border-solid border-neutral-500";

  const buttonClasses = `${baseClasses} ${
    primary ? primaryClasses : secondaryClasses
  } ${className}`;

  return (
    <button className={buttonClasses} onClick={onClick} type="button">
      {label}
    </button>
  );
}

export default ActionButton;
