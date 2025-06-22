import React from "react";

// InputField.jsx
function InputField({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-xs text-neutral-500">{label}</label>
      <input
        className="p-2.5 w-full h-8 text-xs rounded-lg bg-neutral-900 text-neutral-400"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
