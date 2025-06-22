import React from "react";

function MarketOverview() {
  return (
    <section className="overflow-hidden px-3 py-4 w-full rounded-xl bg-[#1D1D1F]">
      <div className="w-full">
        <div className="flex items-center w-full text-[14px] font-medium tracking-normal leading-tight text-zinc-100">
          <h3 className="flex-1 shrink self-stretch my-auto basis-0">
            Market Overview
          </h3>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/12dc4eedc48b993f32f163c0ad22764b45352e46eb89749af2d772985ad77f4c?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="More options"
            className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
          />
        </div>
        <div className="flex gap-0.5 items-center mt-2.5 w-full">
          <div className="flex-1 shrink self-stretch my-auto w-full basis-0 min-w-60">
            <div className="flex gap-0.5 items-start w-full">
              <div className="flex-1 shrink text-[8px] leading-tight basis-0 text-neutral-400">
                Signal strength
              </div>
              <div className="text-[8px] text-yellow-700">80%</div>
            </div>
            <div className="flex overflow-hidden flex-col items-start w-full rounded-none bg-zinc-100 max-md:pr-5">
              <div className="flex shrink-0 h-1.5 bg-yellow-700 rounded-none" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1.5 items-center mt-2.5 w-full font-medium leading-tight">
        <CryptoCard
          symbol="BTC"
          change="+0.95%"
          price="NGN 91.212.61"
          isPositive={true}
        />
        <CryptoCard
          symbol="ETH"
          change="+0.95%"
          price="NGN 91.212.61"
          isPositive={false}
        />
        <CryptoCard
          symbol="BWB"
          change="+0.95%"
          price="NGN 91.212.61"
          isPositive={true}
        />
      </div>
    </section>
  );
}

function CryptoCard({ symbol, change, price, isPositive }) {
  return (
    <div className="flex overflow-hidden flex-col justify-center self-stretch px-2.5 py-2 my-auto rounded-md bg-neutral-800 w-[113px]">
      <div className="flex flex-col w-full">
        <div className="flex gap-1.5 items-center self-start whitespace-nowrap">
          <div className="self-stretch my-auto text-[14px] tracking-normal text-zinc-100">
            {symbol}
          </div>
          <div
            className={`self-stretch my-auto text-[8px] ${
              isPositive ? "text-green-700" : "text-red-600"
            }`}
          >
            {change}
          </div>
        </div>
        <div className="mt-1 text-[8px] text-neutral-600">{price}</div>
      </div>
    </div>
  );
}

export default MarketOverview;
