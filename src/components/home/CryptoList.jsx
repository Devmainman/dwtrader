"use client";
import React from "react";
import CryptoListItem from "./CryptoListItem";

function CryptoList() {
  const cryptoData = [
    {
      name: "BLOB",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: false,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7d94f3aaafb2bf639c26b2ea6ed07c585c4f5c643e353403604cd0122c0cc11f?placeholderIfAbsent=true",
    },
    {
      name: "HELA",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: true,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a4101e57c5d7c460452fdb084d5bf8c401e783da635544b911315f9662feb942?placeholderIfAbsent=true",
    },
    {
      name: "MENG",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: true,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/914aa4971cfb8424f681782e28ce0b89926a0d99ae9a503bef9f2427870f465c?placeholderIfAbsent=true",
    },
    {
      name: "UGM",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: false,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/6e73c551acadc162db070659df989484b11ddb832bee1c34a035738d3c2d3fa9?placeholderIfAbsent=true",
    },
    {
      name: "CHILLYGUY",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: true,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2a44b205f19d3da7efdaa4560bcdfccabbb3d53ccc196eeee6761128783e2042?placeholderIfAbsent=true",
    },
  ];

  return (
    <section className="mt-8 w-full overflow-x-auto whitespace-nowrap max-w-[480px] hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
     <div className="flex overflow-x-auto whitespace-nowrap gap-2 items-center w-full text-[10px] text-stone-300 hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
  <div className="flex w-max flex-nowrap gap-2">
    <button className="flex gap-1.5 items-center px-2.5 py-2 my-auto rounded-3xl border-2 border-solid border-neutral-800 min-h-[29px]">
      <span>Hot Picks</span>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd169d524516bd47ca304b951564dd78992e56e60d6b976a858161422e1411db?placeholderIfAbsent=true"
        className="object-contain w-4 aspect-square"
        alt="Hot icon"
      />
    </button>
    <button className="px-2.5 py-2.5 my-auto whitespace-nowrap rounded-3xl border-2 border-solid border-zinc-900 min-h-[29px]">
      Popular
    </button>
    <button className="px-2.5 py-2.5 my-auto whitespace-nowrap rounded-3xl border-2 border-solid border-zinc-900 min-h-[29px]">
      New
    </button>
    <button className="px-2.5 py-2.5 my-auto rounded-3xl border-2 border-solid border-zinc-900 min-h-[29px]">
      Top Gainers
    </button>
    <button className="px-2.5 py-2.5 my-auto whitespace-nowrap rounded-3xl border-2 border-solid border-zinc-900 min-h-[29px]">
      Meme
    </button>
    <button className="px-2.5 py-2.5 my-auto rounded-3xl border-2 border-solid border-zinc-900 min-h-[29px]">
      24th Volume
    </button>
    <button className="px-2.5 py-2.5 my-auto whitespace-nowrap rounded-3xl border-2 border-solid border-zinc-900 min-h-[29px] w-[53px]">
      Losers
    </button>
  </div>
</div>


      <div className="flex overflow-hidden  overflow-x-auto whitespace-nowrap gap-5 justify-between py-2 mt-2.5 w-full text-xs text-neutral-400">
        <div className="flex gap-1 items-center">
          <div className="flex gap-0.5 items-center self-stretch my-auto whitespace-nowrap">
            <span className="self-stretch my-auto">Name</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a2b640e75d7b1b6e9ae8b3f11650ca46678af04f2e910a86f284be3542bd5993?placeholderIfAbsent=true"
              className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
              alt="Sort icon"
            />
          </div>
          <div className="flex gap-0.5 items-center self-stretch my-auto">
            <span className="self-stretch my-auto">24th vol</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/10801700dc2849603858af60d1eb4d9e27bce9ca4a7c9ac434edb92dba6296a1?placeholderIfAbsent=true"
              className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
              alt="Sort icon"
            />
          </div>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="self-stretch my-auto">Last price</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2893d3ae94bf6956788b21598b979c021f6719e7b198a9ff8b4ad4268f693bd1?placeholderIfAbsent=true"
            className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
            alt="Sort icon"
          />
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="self-stretch my-auto">Change (%)</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8aa1c6472f9ece76f7c01677e58d44b05c7dd34e84854a0920490b2da35fa8c0?placeholderIfAbsent=true"
            className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
            alt="Sort icon"
          />
        </div>
      </div>
      <div className="flex flex-col overflow-x-auto whitespace-nowrap justify-center mt-2.5 w-full">
        <div className="w-full whitespace-nowrap">
          {cryptoData.map((crypto, index) => (
            <CryptoListItem
              key={index}
              name={crypto.name}
              volume={crypto.volume}
              price={crypto.price}
              change={crypto.change}
              isPositive={crypto.isPositive}
              image={crypto.image}
              marginTop={index > 0 ? "mt-2.5" : ""}
            />
          ))}
        </div>
        <button className="flex gap-1.5 items-center self-center mt-2.5 text-xs text-center text-zinc-100">
          <span className="self-stretch my-auto">View All</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c7ca2121a573d968bb080eb7f8ca66907c1c0aa2423957e92528b9510a0e3a71?placeholderIfAbsent=true"
            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            alt="View all arrow"
          />
        </button>
      </div>
    </section>
  );
}

export default CryptoList;
