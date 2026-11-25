import React from "react";

function FormField({ label, value, readOnly = false, type = "text" }) {
  return (
    <div className="flex gap-8 justify-between items-center w-full text-[10px]">
      <label className="gap-2.5 self-stretch my-auto font-semibold text-neutral-400">
        {label}
      </label>
      {readOnly ? (
        <div className="gap-2.5 self-stretch px-2.5 py-3 my-auto whitespace-nowrap rounded-md bg-[var(--card)] min-h-9 min-w-60 text-zinc-100 w-[243px]">
          {value}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          className="gap-2.5 self-stretch px-2.5 py-3 my-auto whitespace-nowrap rounded-md bg-[var(--card)] min-h-9 min-w-60 text-zinc-100 w-[243px]"
        />
      )}
    </div>
  );
}

export default FormField;
