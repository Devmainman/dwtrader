import React from "react";

function InputField({ label, value, readOnly = false, onChange }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-neutral-500 text-[10px]">{label}</label>
      <div className="mt-2.5 w-full whitespace-nowrap text-neutral-400">
        <input
          type="text"
          value={value}
          readOnly={readOnly}
          onChange={onChange}
          className="overflow-hidden gap-2.5 self-stretch py-2.5 pl-2.5 w-full rounded-lg bg-neutral-900 min-h-8 text-[10px] outline-none"
        />
      </div>
    </div>
  );
}

export default InputField;
