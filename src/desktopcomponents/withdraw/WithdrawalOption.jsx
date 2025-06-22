import React from "react";

const WithdrawalOption = ({ icon, label, isSelected }) => {
  return (
    <article
      className={`flex overflow-hidden flex-col justify-center items-start px-4 py-6 font-semibold leading-tight whitespace-nowrap rounded-xl border border-solid ${
        isSelected ? "bg-neutral-800" : "bg-neutral-800"
      } border-neutral-600 min-w-60 text-zinc-100 w-[351px] max-md:pr-5`}
    >
      <div className="flex gap-2.5 items-center">
        <img
          src={icon}
          className="object-contain shrink-0 self-stretch my-auto rounded-3xl aspect-square w-[34px]"
          alt={label}
        />
        <h3 className="self-stretch my-auto">{label}</h3>
      </div>
    </article>
  );
};

export default WithdrawalOption;
