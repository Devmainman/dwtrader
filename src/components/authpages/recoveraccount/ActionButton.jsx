import React from "react";

function ActionButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex justify-center items-center p-2.5 text-xs tracking-normal leading-4 bg-blue-600 rounded-3xl h-[42px] text-zinc-100 w-[325px] hover:bg-blue-700 transition-colors"
    >
      {text}
    </button>
  );
}

export default ActionButton;
