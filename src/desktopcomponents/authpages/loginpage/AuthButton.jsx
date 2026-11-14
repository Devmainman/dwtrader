import React from "react";

function AuthButton({ type, text, onClick }) {
  if (type === "primary") {
    return (
      <button
        onClick={onClick}
        className="overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 w-full tracking-normal whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 text-xs"
      >
        {text}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="overflow-hidden gap-2.5 self-stretch px-2.5 py-3.5 w-full tracking-normal rounded-3xl border border-solid border-[var(--color-blue-600)] min-h-[42px] text-zinc-100 text-xs"
    >
      {text}
    </button>
  );
}

export default AuthButton;
