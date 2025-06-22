import React from "react";

function PaymentMethodOption({ iconSrc, name, className = "", selected, onClick }) {
  return (
    <article
      onClick={onClick}
      className={`flex overflow-hidden flex-col justify-center items-start px-4 py-6 w-full font-semibold leading-tight rounded-xl border border-solid 
      bg-neutral-800 transition-all cursor-pointer 
      ${selected ? "border-neutral-600 bg-neutral-700" : "border-zinc-900"} 
      ${className}`}
    >
      <div className="flex gap-2.5 items-center">
        <img
          src={iconSrc}
          alt={`${name} icon`}
          className="object-contain shrink-0 self-stretch my-auto rounded-3xl aspect-square w-[34px]"
        />
        <span className="self-stretch my-auto">{name}</span>
      </div>
    </article>
  );
}

export default PaymentMethodOption;
