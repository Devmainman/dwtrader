import React from "react";
import StatCard from "./StatCard";
import SignalStrength from "./SignalStrength";

const StatsSection = () => {
  return (
    <section className="mt-5 w-full max-w-[1129px] max-md:max-w-full">
      <div className="flex flex-wrap gap-2.5 items-center w-full max-md:max-w-full">
        <StatCard
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/5337962616855316756ae50cfb2917aff210d274ef0a25ddf976243cf9c9b747?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          title="Total Profit"
          amount="5,576,910.00"
          currency="NGN"
          percentage="10.4%"
          containerClassName="w-[296px] max-md:pr-5"
        />

        <StatCard
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/b97335b1049465950d07ff6704fe56960315f744de417d081bc65f94cc5bd45f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          title="Total Trade"
          amount="10,250.00"
          currency="NGN"
          percentage="10.4%"
          containerClassName="w-[295px]"
        />

        <StatCard
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/0e27cf32bcc201a210a2894db76ea693e8d3afe950aeeebad6e328a56443860c?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          title="Referrals"
          amount="600,00"
          currency="NGN"
          percentage="10.4%"
          containerClassName="w-[296px] max-md:pr-5"
        />
      </div>

      <SignalStrength percentage="60%" />
    </section>
  );
};

export default StatsSection;
