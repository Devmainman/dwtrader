import React from "react";

function ActionButton({ label, primary = false, onClick, className = "" }) {
  const baseClasses =
    "w-full h-11 rounded-full text-[13px] font-semibold transition active:scale-[.98]";
  const primaryClasses = "bg-blue-600 text-white hover:bg-blue-500";
  const secondaryClasses = "bg-white/[.06] border border-white/10 text-zinc-100 hover:bg-white/10";

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
