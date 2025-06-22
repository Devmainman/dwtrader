"use client";
import React from "react";
import EthereumIcon from "../../../assets/ethereum.svg"; // Import the SVG

function WithdrawalHeader() {
  return (
    <header className="flex justify-between items-center mb-4">
      <h1 className="text-base font-medium tracking-normal leading-5 text-stone-300">
        Make Withdrawal
      </h1>
      <div className="flex gap-1 items-center">
        <div className="flex justify-center items-center ">
          {/* Use the imported SVG as an image */}
          <img src={EthereumIcon} alt="Bitcoin Icon" className="w-[34px] h-[34px]" />
        </div>
        <span className="text-xs font-semibold tracking-normal leading-4 text-zinc-100">
          Ethereum
        </span>
      </div>
    </header>
  );
}

export default WithdrawalHeader;
