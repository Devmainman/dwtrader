import React from "react";

const FormField = ({ type, placeholder, value, disabled = false }) => {
  return (
    <div className="flex gap-2.5 items-center px-4 py-4 w-full rounded-lg border border-solid border-neutral-600">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        className="w-full text-xs border-none bg-transparent outline-none text-neutral-500"
      />
    </div>
  );
};

export default FormField;
