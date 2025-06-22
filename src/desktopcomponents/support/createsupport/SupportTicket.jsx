"use client";
import * as React from "react";
import MetricCard from "./MetricCard";
import ProgressBar from "./ProgressBar";
import TicketForm from "./TicketForm";

function SupportTicket() {
  return (
    <main className="flex overflow-hidden flex-col items-end pt-28 pr-10 pb-16 pl-20 bg-neutral-900 max-md:px-5 max-md:pt-24">
      <h1 className="self-start text-3xl font-medium tracking-normal leading-tight text-zinc-100">
        Create Ticket
      </h1>
      <section className="mt-5 w-full max-w-[1129px] max-md:max-w-full">
        <div className="flex flex-wrap gap-2.5 items-center w-full max-md:max-w-full">
          <MetricCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8738a5b9d8ff478085b2717942b2f8444684c5afb19c6e8d1c6a230954488301?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Total Profit"
            value="5,576,910.00"
            currency="NGN"
            growthPercentage="10.4%"
          />
          <MetricCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/f8973c19505b03134beb2d2bf5149db94f1e151f50ff73a242eacd11816cd8e1?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Total Trade"
            value="10,250.00"
            currency="NGN"
            growthPercentage="10.4%"
            iconClassName="fill-neutral-800 stroke-[1px] stroke-fuchsia-600"
          />
          <MetricCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/35138ec91adb52bff83e9933aca3b419d0e9018dbb7f93d59a6a0db1ff8a56af?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Referrals"
            value="600,00"
            currency="NGN"
            growthPercentage="10.4%"
          />
        </div>
        <ProgressBar label="Signal Strength" percentage={60} />
      </section>
      <TicketForm />
    </main>
  );
}

export default SupportTicket;
