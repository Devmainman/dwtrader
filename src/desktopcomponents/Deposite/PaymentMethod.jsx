"use client";
import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import ProgressBar from "./ProgressBar";
import PaymentOption from "./PaymentOption";
import BankTransfer from "./banktransfer/SelectPaymentMethod";
import BitcoinTransfer from "./banktransfer/BitcoinMethod";
import EthereumTransfer from "./banktransfer/EtheriumMethod";
import StatisticsCards from "../home/StatisticsCards";
import PaymentSystem from "../../components/Deposite/payment/PaymentSystem";
import { useUserAuth } from "../../context/UserAuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";

function SelectPaymentMethod() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [signalStrength, setSignalStrength] = useState(0);
  const { token } = useUserAuth();

  const handlePaymentSelection = (payment) => {
    setSelectedPayment(payment);
  };

  useEffect(() => {
    const fetchSignalStrength = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/account/signal-strength`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSignalStrength(res.data.signalStrength || 0);
      } catch (err) {
        console.error("Failed to fetch signal strength:", err);
      }
    };

    if (token) {
      fetchSignalStrength();
    }
  }, [token]);

  return (
    <section className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <h1 className="self-start text-3xl font-medium tracking-normal leading-tight text-zinc-100">
        Make Deposit
      </h1>

      <div className="mb-3 mt-3 w-full max-w-[1229px] max-md:max-w-full">
        <StatisticsCards />
      </div>

      {/* Signal Strength ProgressBar */}
      <ProgressBar label="Signal Strength" percentage={signalStrength} />

      <div className="mt-5">
        <div className="flex gap-4 justify-between items-start w-full text-xs font-semibold tracking-normal text-zinc-100 max-md:max-w-full">
          {/* Optional payment type UI */}
        </div>

        <PaymentSystem />
      </div>
    </section>
  );
}

export default SelectPaymentMethod;
