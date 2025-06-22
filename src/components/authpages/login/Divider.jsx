import React from "react";

function Divider({ text, className = "" }) {
  return (
    <div className={`flex gap-1.5 items-center ${className}`}>
      <div className="flex-1 h-px bg-neutral-600" />
      <div className="text-xs text-stone-500">{text}</div>
      <div className="flex-1 h-px bg-neutral-600" />
    </div>
  );
}

export default Divider;
