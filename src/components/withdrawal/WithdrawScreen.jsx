"use client";

import React, { useState } from "react";
import BalanceDisplay from "./BalanceDisplay";
import AccountOption from "./AccountOption";
import CurrencyIcon from "./CurrencyIcon";
import WithdrawalForm from "./WithdrawalForm"; // For Bank
import Bitcoin from "./BitcoinWithdraw";
import Ethereum from "./ethereum/EthereumWithdraw";

const WithdrawScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const renderForm = () => {
    switch (selectedMethod) {
      case "Bank":
        return <WithdrawalForm />;
      case "Bitcoin":
        return <Bitcoin />;
      case "Ethereum":
        return <Ethereum />;
      default:
        return null;
    }
  };

  return (
    <main className="flex justify-center mx-auto min-h-screen">
      {/* Wrapper with consistent max width and padding */}
      <section className="w-full max-w-[480px] px-5 py-6 rounded-3xl bg-neutral-900 min-h-screen">
        {/* Withdrawal Form (if method is selected) */}
        {selectedMethod ? (
          renderForm()
        ) : (
          <div className="flex flex-col gap-5">
            {/* Header */}
            <header className="flex justify-between items-center mb-5 w-full">
              <h1 className="text-[16px] font-medium text-stone-300">
                Withdraw
              </h1>
              <div className="flex flex-col gap-1.5 items-end text-right">
                <p className="text-[10px] text-neutral-400">Available Balance</p>
                <BalanceDisplay amount="4,867.00" />
              </div>
            </header>

            {/* From Section */}
            <div>
              <label className="text-xs text-neutral-400">From</label>
              <div className="flex justify-between items-center px-4 py-6 rounded-xl border border-[#505050] bg-neutral-800">
                <div className="flex gap-2.5 items-center">
                  <CurrencyIcon type="balance" />
                  <p className="text-xs font-semibold text-zinc-100">Balance</p>
                </div>
                <BalanceDisplay amount="4,867.00" />
              </div>
            </div>

            {/* To Section */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">To</label>
              <AccountOption
                icon="bank"
                title="Bank"
                description="Bank Transfer"
                iconBackground="bg-zinc-100"
                onClick={() => setSelectedMethod("Bank")}
              />
              <AccountOption
                icon="bitcoin"
                title="Bitcoin"
                iconBackground="bg-neutral-900"
                onClick={() => setSelectedMethod("Bitcoin")}
              />
              <AccountOption
                icon="ethereum"
                title="Ethereum"
                iconBackground="bg-neutral-900"
                onClick={() => setSelectedMethod("Ethereum")}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default WithdrawScreen;
