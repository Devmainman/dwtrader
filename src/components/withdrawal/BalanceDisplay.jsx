import React from "react";
import CurrencyIcon from "./CurrencyIcon";

const BalanceDisplay = ({ amount }) => {
  return (
    <div className="flex gap-1 items-center">
      <CurrencyIcon type="naira" />
      <p className="text-base font-medium tracking-normal leading-5 text-zinc-100">
        {amount}
      </p>
    </div>
  );
};

export default BalanceDisplay;
