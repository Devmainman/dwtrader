"use client";
import React from "react";
import EarnProductCard from "./EarnProductCard";

function EarnProducts() {
  const products = [
    {
      symbol: "BWB",
      name: "Bitget wallet",
      apy: "5%",
      stakingType: "BWB STARKING",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a2cc8cedcb17e266ff6e0ba0b146ecb3922f4eaa056da999d4a57d6db878f638?placeholderIfAbsent=true",
    },
    {
      symbol: "stETH",
      name: "EIGEN LAYER",
      apy: "15.48%",
      stakingType: ["STETH", "POS STARKING"],
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d4d0e0e3c42c055d20fe316cea08176973138f3e199a5c3dbba61ecce2e57e26?placeholderIfAbsent=true",
    },
  ];

  return (
    <section className="mt-8 w-full overflow-x-auto whitespace-nowrap leading-tight max-w-[480px]">
      <div className="flex items-center w-full text-sm font-medium tracking-normal text-zinc-100">
        <h2 className="flex-1 shrink self-stretch my-auto basis-0">
          Popular Earn product
        </h2>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ad894d521a56b49b00dd8bb16f6efcea56c8f5f5894acd779c7c5e6667eccff?placeholderIfAbsent=true"
          className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
          alt="Arrow icon"
        />
      </div>
      <div className="flex gap-2.5 items-center mt-2.5 w-full">
        {products.map((product, index) => (
          <EarnProductCard key={index} product={product} />
        ))}
      </div>
    </section>
  );
}

export default EarnProducts;
