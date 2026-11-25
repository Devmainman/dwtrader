import React from "react";
import CurrencyIcon from "./CurrencyIcon";

const AccountOption = ({ icon, title, description, iconBackground, onClick }) => {
  return (
    <div
      onClick={onClick} // Handle click event
      className="flex justify-between items-center px-4 h-[80px] py-6 mb-2.5 rounded-xl border border-solid bg-neutral-800 border-[var(--card)] max-sm:px-3 max-sm:py-4 cursor-pointer"
    >
      <div className="flex gap-2.5 items-center">
        <div
          className={`flex justify-center items-center p-1.5 rounded-3xl ${iconBackground} h-[34px] w-[34px]`}
        >
          <CurrencyIcon type={icon} />
        </div>
        <p className="text-xs font-semibold tracking-normal leading-4 text-zinc-100">
          {title}
        </p>
      </div>
      {description && (
        <p className="text-xs tracking-normal leading-4 text-zinc-100">
          {description}
        </p>
      )}
    </div>
  );
};

export default AccountOption;
