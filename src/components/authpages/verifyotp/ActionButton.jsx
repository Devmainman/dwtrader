import React from "react";

function ActionButton({ text, onClick, bgColor = "bg-blue-600" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-xs tracking-normal leading-4 ${bgColor} rounded-3xl h-[42px] text-zinc-100 transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-500`}
    >
      {text}
    </button>
  );
}

export default ActionButton;
