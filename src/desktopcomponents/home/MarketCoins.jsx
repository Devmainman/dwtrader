import React from "react";

function MarketCoins() {
  return (
    <section className="self-center max-w-full w-[330px]">
      <div className="flex gap-2 items-center w-full text-[10px] text-stone-300 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex items-center gap-1.5 px-3 py-1.5 w-[95px] rounded-3xl border-2 border-solid border-neutral-800 justify-center">
          <span>Hot Picks</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c271c8d0f9af48647a856b767d22563a88719a94d974e4f34e9d74306eb7dc99?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Hot icon"
            className="object-contain w-4 h-4"
          />
        </div>
        <div className="flex items-center justify-center px-3 py-1.5 w-[95px] rounded-3xl border-2 border-solid border-zinc-900 min-h-[32px]">
          Popular
        </div>
        <div className="flex items-center justify-center px-3 py-1.5 w-[95px] rounded-3xl border-2 border-solid border-zinc-900 min-h-[32px]">
          New
        </div>
        <div className="flex items-center justify-center px-3 py-1.5 w-[95px] rounded-3xl border-2 border-solid border-zinc-900 min-h-[32px]">
          Top Gainers
        </div>
        <div className="flex items-center justify-center px-3 py-1.5 w-[95px] rounded-3xl border-2 border-solid border-zinc-900 min-h-[32px]">
          Meme
        </div>
        <div className="flex items-center justify-center px-3 py-1.5 w-[95px] rounded-3xl border-2 border-solid border-zinc-900 min-h-[32px]">
          24th Volume
        </div>
        <div className="flex items-center justify-center px-3 py-1.5 w-[95px] rounded-3xl border-2 border-solid border-zinc-900 min-h-[32px]">
          Losers
        </div>
      </div>

      <div className="flex overflow-hidden gap-5 justify-between py-2 mt-2.5 w-full text-[10px] text-neutral-400">
        <div className="flex gap-1 items-center">
          <div className="flex gap-0.5 items-center self-stretch my-auto whitespace-nowrap">
            <span className="self-stretch my-auto">Name</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7f101bf469668c7f7a1168f63681653ee381b53b378b711999f616f2fdfc3128?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Sort icon"
              className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
            />
          </div>
          <div className="flex gap-0.5 items-center self-stretch my-auto">
            <span className="self-stretch my-auto">24th vol</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7f101bf469668c7f7a1168f63681653ee381b53b378b711999f616f2fdfc3128?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Sort icon"
              className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
            />
          </div>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="self-stretch my-auto">Last price</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/efb4c4fdcc74f0c7527a6cad4dd23ecb629357d33acddfbb40a017cec8bc456e?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Sort icon"
            className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
          />
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="self-stretch my-auto">Change (%)</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/efb4c4fdcc74f0c7527a6cad4dd23ecb629357d33acddfbb40a017cec8bc456e?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Sort icon"
            className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center mt-2.5 w-full">
        <div className="w-full whitespace-nowrap">
          <CoinItem
            image="https://cdn.builder.io/api/v1/image/assets/TEMP/7777c07fee6af2cce8ae81b057a832508bb5edc740b6f2991469af54da84c05b?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            name="BLOB"
            volume="$78.20M"
            price="$0,003698"
            change="-69.90%"
            isNegative={true}
          />
          <CoinItem
            image="https://cdn.builder.io/api/v1/image/assets/TEMP/34781ce138bc97e3951a574ab55abd794ec6cc667329a397fb3344b8d3e77c7d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            name="HELA"
            volume="$78.20M"
            price="$0,003698"
            change="-69.90%"
            isNegative={false}
          />
          <CoinItem
            image="https://cdn.builder.io/api/v1/image/assets/TEMP/33c24d4fb065b511d83efd69fba56bce505dc62c2fc7e99524e861c39de7e23f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            name="MENG"
            volume="$78.20M"
            price="$0,003698"
            change="-69.90%"
            isNegative={false}
          />
          <CoinItem
            image="https://cdn.builder.io/api/v1/image/assets/TEMP/aff7f7116c2d058a9cd8c8671b008f0ae529492e83f6cab13517f16cbc6a0d5d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            name="UGM"
            volume="$78.20M"
            price="$0,003698"
            change="-69.90%"
            isNegative={true}
          />
          <CoinItem
            image="https://cdn.builder.io/api/v1/image/assets/TEMP/58f3a99964d57cd77c11163d2fa4a62a2abc92a3a9069a1f7578165825501744?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            name="CHILLYGUY"
            volume="$78.20M"
            price="$0,003698"
            change="-69.90%"
            isNegative={false}
          />
        </div>
        <div className="flex gap-1.5 items-center self-center mt-2.5 text-[10px] text-center text-zinc-100">
          <span className="self-stretch my-auto">View All</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/608fd5e5286785f34c0cfd61b540fdda0c07df0ea471dfc5d6e34c8dff807cc4?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="View all icon"
            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
          />
        </div>
      </div>
    </section>
  );
}

function CoinItem({ image, name, volume, price, change, isNegative }) {
  return (
    <div className="flex overflow-hidden gap-5 justify-between py-1 mt-2.5 w-full">
      <div className="flex gap-2 leading-tight">
        <img
          src={image}
          alt={name}
          className="object-contain shrink-0 aspect-[1.05] rounded-[40px] w-[42px]"
        />
        <div className="my-auto">
          <div className="text-[12px] font-bold tracking-normal text-zinc-100">
            {name}
          </div>
          <div className="text-[8px] text-neutral-400">{volume}</div>
        </div>
      </div>
      <div className="flex gap-10 my-auto text-zinc-100">
        <div className="my-auto text-[12px] font-medium tracking-normal leading-tight">
          {price}
        </div>
        <div
          className={`gap-2.5 self-stretch px-2.5 py-1.5 text-[8px] ${
            isNegative ? "bg-red-600" : "bg-green-700"
          } rounded-3xl min-h-[23px]`}
        >
          {change}
        </div>
      </div>
    </div>
  );
}

export default MarketCoins;
