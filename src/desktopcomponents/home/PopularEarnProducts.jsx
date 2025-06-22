import React from "react";

function PopularEarnProducts() {
  return (
    <section className="mt-5 w-full leading-tight">
      <h3 className="flex-1 shrink self-stretch w-full text-sm font-medium tracking-normal basis-0 text-zinc-100">
        Popular Earn product
      </h3>
      <div className="flex flex-wrap gap-2.5 items-center mt-2.5 w-full">
        <EarnProductCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/2869e0a21b789583467fb62859870d790e90bf054a44a98554f9d062b544308c?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          name="BWB"
          description="Bitget wallet"
          apy="5%"
          type="BWB STARKING"
        />
        <EarnProductCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/120fc9eb2aedf4d7cbb1fc00dd667015838beccba9f9bd0e03db81c3e997d66e?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          name="stETH"
          description="EIGEN LAYER"
          apy="15.48%"
          type="STETH"
          secondType="POS STARKING"
        />
        <EarnProductCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1f85d7a560ceb1b5041f9f6b4989d5c655d89b6f969b00b64bdd12549182747b?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          name="USDT"
          description="Aave V3"
          apy="6.21%"
          type="USDT"
          secondType="LIQUIDITY POOL"
        />
      </div>
    </section>
  );
}

function EarnProductCard({ icon, name, description, apy, type, secondType }) {
  return (
    <article className="flex overflow-hidden flex-col grow shrink items-start self-stretch py-3 pr-9 pl-4 my-auto rounded-xl bg-[#1D1D1F] w-[145px] max-md:pr-5">
      <div className="flex gap-2 items-center">
        <img
          src={icon}
          alt={name}
          className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.06] w-[33px]"
        />
        <div className="self-stretch my-auto w-[52px]">
          <div className="text-[12px] font-semibold tracking-normal text-zinc-100">
            {name}
          </div>
          <div className="mt-1 text-[8px] tracking-normal text-stone-300">
            {description}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-4">
        <div className="flex gap-px items-center self-start whitespace-nowrap flex-wrap">
          <div className="self-stretch my-auto text-[12px] font-semibold text-zinc-100">
            {apy}
          </div>
          <div className="self-stretch my-auto text-[8px] font-medium text-neutral-400">
            APY
          </div>
        </div>
        {secondType ? (
          <div className="flex gap-1.5 mt-1.5 text-[7px] font-medium text-neutral-400">
            <div className="gap-2.5 self-stretch px-1.5 py-1.5 whitespace-nowrap rounded-xl bg-neutral-800 min-h-5">
              {type}
            </div>
            <div className="flex-1 shrink gap-2.5 p-1.5 rounded-xl basis-0 bg-neutral-800 min-h-5">
              {secondType}
            </div>
          </div>
        ) : (
          <div className="gap-2.5 self-stretch px-1.5 py-1.5 mt-1.5 w-full text-[7px] font-medium rounded-xl bg-neutral-800 min-h-5 text-neutral-400">
            {type}
          </div>
        )}
      </div>
    </article>
  );
}

export default PopularEarnProducts;
