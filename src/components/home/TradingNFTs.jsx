"use client";
import React from "react";
import NFTCard from "./NFTCard";

function TradingNFTs() {
  const nfts = [
    {
      title: "Singapore Token2049 Nightopia -RaveDAO ...",
      floorPrice: "--",
      volume: "--",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/6121a1cc41a68e05eef38fdfb711fa9123347e43a52300ef15b6632cc7c4da3b?placeholderIfAbsent=true",
      indicators: 4,
      hasEthIcon: false,
    },
    {
      title: "GOAT GAMING - GENESIS GOATs",
      floorPrice: "0.105",
      volume: "--",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/91eaaf320db9a6dbdc25b65557044370e251e3fd63034bb4f35daa4df01eb7e8?placeholderIfAbsent=true",
      indicators: 3,
      hasEthIcon: true,
    },
  ];

  return (
    <section className="mt-8 w-full max-w-[480px]">
      <div className="flex items-center w-full text-sm font-medium tracking-normal leading-tight text-zinc-100">
        <h2 className="flex-1 shrink self-stretch my-auto basis-0">
          Trading NFTs
        </h2>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ad894d521a56b49b00dd8bb16f6efcea56c8f5f5894acd779c7c5e6667eccff?placeholderIfAbsent=true"
          className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
          alt="Arrow icon"
        />
      </div>
      <div className="flex gap-2.5 items-center mt-2.5 w-full">
        {nfts.map((nft, index) => (
          <NFTCard key={index} nft={nft} />
        ))}
      </div>
    </section>
  );
}

export default TradingNFTs;
