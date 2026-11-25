import React from "react";

// InputField.jsx
function InputField({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-neutral-400">{label}</label>
      <input
        className="w-full h-11 rounded-xl bg-white/[.04] border border-white/10 px-3.5 text-[13px] text-zinc-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
