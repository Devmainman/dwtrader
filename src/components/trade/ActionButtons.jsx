import React from "react";
import { Link } from "react-router-dom";

function ActionButtons() {
  return (
    
    <div className="flex gap-3 items-center mt-4 w-full text-xs tracking-normal leading-none whitespace-nowrap text-zinc-100">
      <Link
        to="/withdraw"
        className="overflow-hidden self-stretch px-14 py-3.5 my-auto rounded-3xl border border-solid bg-neutral-800 border-neutral-600 w-full text-center flex justify-center items-center"
      >
        Withdraw
      </Link>
      <Link
        to="/deposit"
        className="overflow-hidden self-stretch px-16 py-3.5 my-auto bg-blue-600 rounded-3xl w-full text-center flex justify-center items-center"
      >
        Deposit
      </Link>
    </div>
  );
}

export default ActionButtons;
