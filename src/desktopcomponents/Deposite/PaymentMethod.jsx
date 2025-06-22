import React, { useState } from "react";
import StatCard from "./StatCard";
import ProgressBar from "./ProgressBar";
import PaymentOption from "./PaymentOption";
import BankTransfer from "./banktransfer/SelectPaymentMethod";  // Import BankTransfer component
import BitcoinTransfer from "./banktransfer/BitcoinMethod";  // Import BitcoinTransfer component
import EthereumTransfer from "./banktransfer/EtheriumMethod";  // Import EthereumTransfer component
import StatisticsCards from "../home/StatisticsCards";
import PaymentSystem from "../../components/Deposite/payment/PaymentSystem"

function SelectPaymentMethod() {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelection = (payment) => {
    setSelectedPayment(payment);
  };

  return (
    <section className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <h1 className="self-start text-3xl font-medium tracking-normal leading-tight text-zinc-100">
        Make Deposit
      </h1>

      <div className="mb-3 mt-3 w-full max-w-[1129px] max-md:max-w-full">
        <StatisticsCards />
      </div>
      <ProgressBar label="Signal Strength" percentage={60} />
      <div className="mt-5">
        <div className="flex gap-4 justify-between items-start w-full text-xs font-semibold tracking-normal text-zinc-100 max-md:max-w-full">
         
        </div>

       <PaymentSystem />
      </div>
    </section>
  );
}

export default SelectPaymentMethod;
