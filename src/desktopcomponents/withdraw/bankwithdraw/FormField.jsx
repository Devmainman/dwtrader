import React from "react";

function FormField({ label, placeholder, className = "" }) {
  return (
    <div
      className={`flex gap-10 justify-between items-center w-full max-md:max-w-full ${className}`}
    >
      <label className="gap-2.5 self-stretch my-auto font-medium text-neutral-400 text-xs">
        {label}
      </label>
      <div className="gap-2.5 self-stretch px-2.5 py-3 my-auto whitespace-nowrap rounded-md bg-neutral-800 min-h-9 min-w-60 text-neutral-400 w-[243px] text-xs">
        {placeholder}
      </div>
    </div>
  );
}

export default FormField;
