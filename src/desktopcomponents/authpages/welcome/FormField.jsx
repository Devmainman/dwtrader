import React from "react";

function FormField({ placeholder, value, disabled = false }) {
  return (
    <div className="flex items-center px-4 py-4 rounded-lg border border-solid border-neutral-600">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        className={`w-full text-xs border-[none] bg-transparent outline-none ${
          disabled ? "text-neutral-600" : "text-neutral-500"
        }`}
      />
    </div>
  );
}

export default FormField;
