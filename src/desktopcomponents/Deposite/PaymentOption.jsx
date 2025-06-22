import React from "react";

function PaymentOption({ icon, name, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex overflow-hidden flex-col justify-center items-start px-4 py-6 rounded-xl border border-solid bg-neutral-800 border-neutral-600 min-w-60 w-[351px] max-md:pr-5"
    >
      <div className="flex gap-2.5 items-center">
        <img
          src={icon}
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[34px]"
          alt={`${name} icon`}
        />
        <span className="self-stretch my-auto">{name}</span>
      </div>
    </button>
  );
}

export default PaymentOption;
