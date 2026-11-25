import React from "react";

function Button({ children, onClick }) {
  return (
    <button
      className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-500 transition active:scale-[.98]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
