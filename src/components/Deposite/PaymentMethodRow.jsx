import React from "react";
import PaymentMethodOption from "./PaymentMethodOption";

function PaymentMethodRow({ options = [], className = "" }) {
  return (
    <div className={`flex mt-4 w-[351px] h-[80px] gap-3.5 font-semibold leading-tight whitespace-nowrap ${className}`}>
      {options.map((option, index) => (
        <div key={index} className="flex-1">
          <PaymentMethodOption {...option} />
        </div>
      ))}
    </div>
  );
}

export default PaymentMethodRow;
