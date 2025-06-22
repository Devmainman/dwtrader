import React from "react";
import CryptoItem from "./CryptoItem";

function CryptoList() {
  const cryptoData = [
    {
      id: "BLOB",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7d94f3aaafb2bf639c26b2ea6ed07c585c4f5c643e353403604cd0122c0cc11f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: false,
    },
    {
      id: "HELA",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a4101e57c5d7c460452fdb084d5bf8c401e783da635544b911315f9662feb942?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: true,
    },
    {
      id: "MENG",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/914aa4971cfb8424f681782e28ce0b89926a0d99ae9a503bef9f2427870f465c?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: true,
    },
    {
      id: "UGM",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/6e73c551acadc162db070659df989484b11ddb832bee1c34a035738d3c2d3fa9?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: false,
    },
    {
      id: "CHILLYGUY",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2a44b205f19d3da7efdaa4560bcdfccabbb3d53ccc196eeee6761128783e2042?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
      volume: "$78.20M",
      price: "$0,003698",
      change: "-69.90%",
      isPositive: true,
    },
  ];

  return (
    <>
      <div className="flex overflow-hidden gap-5 justify-between py-2 mt-2.5 w-full text-[10px] text-neutral-400">
        <div className="flex gap-1 items-center">
          <div className="flex gap-0.5 items-center self-stretch my-auto whitespace-nowrap">
            <p className="self-stretch my-auto">Name</p>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/257f17e9e91a0561644746f7a253ea5855f9aac3f93b1e582e2bfe3ee4ebc088?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
              alt="Sort"
            />
          </div>
          <div className="flex gap-0.5 items-center self-stretch my-auto">
            <p className="self-stretch my-auto">24th vol</p>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/257f17e9e91a0561644746f7a253ea5855f9aac3f93b1e582e2bfe3ee4ebc088?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
              alt="Sort"
            />
          </div>
        </div>
        <div className="flex pl-8 gap-0.5 items-center">
          <p className="self-stretch my-auto">Last price</p>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/257f17e9e91a0561644746f7a253ea5855f9aac3f93b1e582e2bfe3ee4ebc088?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
            alt="Sort"
          />
        </div>
        <div className="flex gap-0.5 items-center">
          <p className="self-stretch my-auto">Change (%)</p>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/257f17e9e91a0561644746f7a253ea5855f9aac3f93b1e582e2bfe3ee4ebc088?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto w-2.5 aspect-[0.5]"
            alt="Sort"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center mt- w-full">
        <div className="w-full whitespace-nowrap">
          {cryptoData.map((crypto) => (
            <CryptoItem
              key={crypto.id}
              id={crypto.id}
              image={crypto.image}
              volume={crypto.volume}
              price={crypto.price}
              change={crypto.change}
              isPositive={crypto.isPositive}
            />
          ))}
        </div>

        <button className="flex gap-1.5 items-center self-center mt-2.5 text-[10px] text-center text-zinc-100">
          <span className="self-stretch my-auto">View All</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f4d6eb0765fb82208beb907fc9bb47ad3420a7fb42d0a18d8e688b0f3ff06356?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            alt="View all"
          />
        </button>
      </div>
    </>
  );
}

export default CryptoList;
