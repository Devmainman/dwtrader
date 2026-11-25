"use client";
import React from "react";
import SearchBar from "./SearchBar";
import SummaryCard from "./SummaryCard";
import SignalStrengthBar from "../trade/SignalStrengthBar";
import DateSelector from "./DateSelector";
import TransactionList from "../../components/transactionhistory/TransactionList";
import StatisticsCards from "../home/StatisticsCards";

function TransactionHistory() {
  return (
    <section className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <header className="flex flex-row items-center w-full gap-2 flex-nowrap justify-between">
      <h1 className="text-[28px] font-medium leading-8 text-zinc-100 max-md:text-2xl max-sm:text-xl whitespace-nowrap">
       Transaction History
        </h1>
        <SearchBar />
      </header>
    
      <div className="mt-3 w-full max-w-[1229px] max-md:max-w-auto">
        <div className="mb-6">
       <StatisticsCards />
       </div>

        <SignalStrengthBar />
      

      <div className="flex overflow-hidden w-full gap-2.5 justify-center items-center p-4 mt-5 rounded-xl border border-solid bg-[var(--card)] border-neutral-600">
        <div className="flex-1 shrink self-stretch my-auto w-full basis-0 min-w-60 max-md:max-w-full">
          <div className="w-full max-md:max-w-full">
            <div className="w-full max-md:max-w-full">
              <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
                <h2 className="self-stretch text-[14px] font-medium tracking-normal leading-tight text-zinc-100 w-[145px]">
                  Transaction History
                </h2>
                <div className="flex gap-1.5 items-center self-stretch my-auto text-xs whitespace-nowrap text-neutral-400">
                  <span className="self-stretch my-auto">Show</span>
                  <div className="flex gap-1.5 justify-center items-center self-stretch px-1.5 py-0.5 my-auto text-xs bg-blue-600 rounded min-h-5 text-zinc-100 w-[45px]">
                    <span className="self-stretch my-auto">10</span>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/8df889bba600d1bde3a696b3a71f4581180d02b124d2ffac0b825c166b7512b0?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                      className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                      alt="Dropdown icon"
                    />
                  </div>
                  <span className="self-stretch my-auto">entries</span>
                </div>
              </div>

              <DateSelector />
            </div>

            <TransactionList />

            <div className="mt-4 text-xs text-center text-blue-600 max-md:max-w-full">
              Showing All
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

export default TransactionHistory;
