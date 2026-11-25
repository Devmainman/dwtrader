"use client";
import React from "react";

function NFTCard({ nft }) {
  return (
    <div className="flex flex-col w-[218px] h-auto bg-[var(--card)] rounded-xl p-4 lg:w-auto lg:bg-black/40 lg:border lg:border-white/5">
  <div className="flex gap-2 text-[12px] w-[218px] lg:w-auto font-semibold tracking-normal leading-4 text-zinc-100">
    <img
      src={nft.image}
      className="object-contain flex-none w-[33px] h-auto"
      alt="NFT icon"
    />
    <h3 className="w-[145px]">{nft.title}</h3>
  </div>

  <div className="flex gap-10 items-center mt-5">
    {Array.from({ length: nft.indicators }).map((_, i) => (
      <div key={i} className="w-3 h-3.5 rounded-md bg-neutral-800" />
    ))}
  </div>

  <div className="flex gap-5 self-start mt-7 text-[10px] text-stone-300">
    <div className="flex flex-col">
      <p>Floor price</p>
      <div className="flex gap-1 items-center mt-1.5">
        <img
          src={
            nft.hasEthIcon
              ? "https://cdn.builder.io/api/v1/image/assets/TEMP/acae7d1f7fcb8dd5adbe7ea7bb51744eb36d3fffae9aa46cecb61b0b77918e03?placeholderIfAbsent=true"
              : "https://cdn.builder.io/api/v1/image/assets/TEMP/5ec45f34adfa435ccedb9ecf3dc8e9c6477d523bc6e6e8c28955cb626cd960bd?placeholderIfAbsent=true"
          }
          className="object-contain w-4 h-4"
          alt="Currency icon"
        />
        <span>{nft.floorPrice}</span>
      </div>
    </div>

    <div className="flex flex-col">
      <p>Volume</p>
      <div className="flex gap-1 items-center mt-1.5 text-zinc-100">
        <img
          src={
            nft.hasEthIcon
              ? "https://cdn.builder.io/api/v1/image/assets/TEMP/acae7d1f7fcb8dd5adbe7ea7bb51744eb36d3fffae9aa46cecb61b0b77918e03?placeholderIfAbsent=true"
              : "https://cdn.builder.io/api/v1/image/assets/TEMP/5ec45f34adfa435ccedb9ecf3dc8e9c6477d523bc6e6e8c28955cb626cd960bd?placeholderIfAbsent=true"
          }
          className="object-contain w-4 h-4"
          alt="Currency icon"
        />
        <span>{nft.volume}</span>
      </div>
    </div>
  </div>
</div>

  );
}

export default NFTCard;
