import React from "react";

function CryptoItem({ id, image, volume, price, change, isPositive }) {
  return (
    <div className="flex overflow-hidden gap-5 justify-between py-1 mt-2.5 w-full">
      <div className="flex gap-2 leading-tight">
        <img
          src={image}
          className="object-contain shrink-0 aspect-[1.05] rounded-[40px] w-[42px]"
          alt={id}
        />
        <div className="my-auto">
          <h3 className="text-xs font-bold tracking-normal text-zinc-100">
            {id}
          </h3>
          <p className="text-[8px] text-neutral-400">{volume}</p>
        </div>
      </div>
      <div className="flex gap-14 my-auto text-zinc-100">
        <p className="my-auto text-xs font-medium tracking-normal leading-tight">
          {price}
        </p>
        <div
          className={`gap-2.5 self-stretch px-2.5 py-1.5 text-[10px] ${
            isPositive ? "bg-green-700" : "bg-red-600"
          } rounded-3xl min-h-[23px]`}
        >
          {change}
        </div>
      </div>
    </div>
  );
}

export default CryptoItem;
