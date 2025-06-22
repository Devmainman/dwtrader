"use client";
import React, { useState } from "react";
import PaymentMethodOption from "./PaymentMethodOption";
import PaymentMethodRow from "./PaymentMethodRow";
import BankTransfer from "../Deposite/bank/DepositeStage2"; 
import BitcoinTransfer from "../Deposite/bitcoin/index";
import EthereumTransfer from "../Deposite/ethereum/DepositeStage4";
import Bitcoin from "../../assets/bitcoin.svg";
import Ethereum from "../../assets/ethereum.svg";

function DepositeStage1() {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelection = (payment) => {
    setSelectedPayment(payment);
  };

  return (
    <section className="flex flex-col px-5 pt-10 pb-72 mx-auto w-full text-xs tracking-normal rounded-3xl bg-neutral-900 max-w-[480px] text-zinc-100">
      

      {!selectedPayment && (
        <>
        <h1 className="self-start text-base font-medium tracking-normal leading-tight text-stone-300">
        Select Payment Method
      </h1>
          {/* Bank Transfer Option */}
          <PaymentMethodOption
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/62bb3bbaac040340896a0b3b4184f53f4dc736ef118af6e4fd98a2cb168aabf7"
            name="Bank Transfer"
            className="mt-5"
            onClick={() => handlePaymentSelection("bank")}
          />

          <PaymentMethodRow
            options={[
              { iconSrc: Bitcoin, name: "Bitcoin", onClick: () => handlePaymentSelection("bitcoin") },
              { iconSrc: Ethereum , name: "Ethereum", onClick: () => handlePaymentSelection("ethereum") },
            ]}
          />
          <PaymentMethodOption
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/62bb3bbaac040340896a0b3b4184f53f4dc736ef118af6e4fd98a2cb168aabf7"
            name="Bank Transfer"
            className="mt-5"
            onClick={() => handlePaymentSelection("bank")}
          />
          <PaymentMethodRow
            options={[
              { iconSrc: Bitcoin, name: "Bitcoin", onClick: () => handlePaymentSelection("bitcoin") },
              { iconSrc: Ethereum , name: "Ethereum", onClick: () => handlePaymentSelection("ethereum") },
            ]}
          />

        </>
      )}

      {/* Conditionally Render Payment Component */}
      {selectedPayment === "bank" && <BankTransfer />}
      {selectedPayment === "bitcoin" && <BitcoinTransfer />}
      {selectedPayment === "ethereum" && <EthereumTransfer />}
    </section>
  );
}

export default DepositeStage1;
