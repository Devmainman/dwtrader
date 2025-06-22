import React from "react";

function StatisticsCards() {
  return (
    <div className="flex flex gap-2 items-stretch w-[370px]">
      <StatCard
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1595fd46c36b0c2f05154fb6cbb36c4c661d61587f264240a8ba1ecea076f1e9?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        title="Total Profit"
        amount="5,576,910.00"
        currency="NGN"
        percentage="10.4%"
        status="Growth"
      />
      <StatCard
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/cd47d48371af2f914a2297b9cc031960a5e49690d45c86ad003c899fec2bef99?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        title="Total Trade"
        amount="10,250.00"
        currency="NGN"
        percentage="10.4%"
        status="Growth"
      />
      <StatCard
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/2045349417021670dee98097328a0e9a608a5b20426f5f5319bcd3c90e6d468c?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        title="Referrals"
        amount="600,00"
        currency="NGN"
        percentage="10.4%"
        status="Growth"
      />
    </div>
  );
}


function StatCard({ icon, title, amount, currency, percentage, status }) {
  return (
    <article className="flex flex-col justify-between gap-4 p-5 rounded-xl border border-neutral-600 bg-[#1D1D1F] text-white w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] min-w-[350px]">
      <div className="flex gap-3 items-center">
        <img src={icon} alt={title} className="w-10 h-10 object-contain" />
        <span className="text-base font-medium text-stone-300">{title}</span>
      </div>

      <div className="flex justify-between items-end">
        <div className="text-3xl font-semibold text-zinc-100">
          {amount} <span className="text-base text-stone-300">{currency}</span>
        </div>
        <div className="text-right">
          <div className="bg-neutral-800 rounded-3xl text-xs p-1 px-3">
            {percentage}
          </div>
          <div className="mt-1 text-xs font-bold text-green-600">{status}</div>
        </div>
      </div>
    </article>
  );
}


export default StatisticsCards;
