"use client";
import React from "react";
import BalanceDisplay from "./BalanceDisplay";
import SearchBar from "./SearchBar";
import TransactionList from "./TransactionList";

function TransactionHistoryScreen() {
  return (
    <section className="overflow-hidden px-5 py-3 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px] md:max-w-[640px] lg:max-w-[1100px] lg:px-8 lg:py-6">
      <BalanceDisplay />
      <SearchBar />
      <TransactionList />
    </section>
  );
}

export default TransactionHistoryScreen;
