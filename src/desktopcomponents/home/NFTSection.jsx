import React from "react";

function NFTSection() {
  return (
    <section className="flex flex-col mt-5 w-[358px] max-md:mr-1.5">
      <h3 className="self-start text-sm font-medium tracking-normal leading-tight text-zinc-100">
        Trading NFTs
      </h3>
      <div className="mt-2.5 w-full">
        <NFTCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/6775f009b2cf425574b7b52c179452c61b2d1f6b0c6da1c7ebe5a19482cda53b?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          title="Singapore Token2049 Nightopia -RaveDAO ..."
          floorPrice="--"
          volume="--"
        />
        <NFTCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/152d62a1389fc7022ec3091fa1c4101277ec749b3b5e20cf023019a0912b8f79?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          title="GOAT GAMING - GENESIS GOATs"
          floorPrice="0.105"
          volume="--"
        />
        <NFTCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/7a11542d687ff83f25b3257081a69bf320e2ceda7128cd7fb18a27e7c18ad844?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          title="RTFKT Project animus"
          floorPrice=""
          volume=""
          isLast={true}
        />
      </div>
    </section>
  );
}

function NFTCard({ image, title, floorPrice, volume, isLast = false }) {
  return (
    <article
      className={`flex overflow-hidden flex-col px-6 py-3${
        isLast ? " pt-3" : ""
      } ${
        !isLast ? "mt-2.5" : "mt-2.5"
      }  w-full rounded-xl bg-[#1D1D1F] min-h-[161px] max-md:px-5`}
    >
      <div className="flex gap-2.5 w-full text-sm font-semibold tracking-normal leading-4 min-h-[34px] text-zinc-100">
        <img
          src={image}
          alt={title}
          className="object-contain shrink-0 my-auto rounded-none aspect-[1.09] w-[37px]"
        />
        <h4 className={`${isLast ? "w-40" : "flex-1 shrink basis-0"}`}>
          {title}
        </h4>
      </div>
      <div className="flex gap-10 items-center self-center mt-7">
        <div className="flex shrink-0 self-stretch my-auto h-4 rounded-md bg-neutral-800 w-[13px]" />
        <div className="flex shrink-0 self-stretch my-auto h-4 rounded-md bg-neutral-800 w-[13px]" />
        <div className="flex shrink-0 self-stretch my-auto h-4 rounded-md bg-neutral-800 w-[13px]" />
        <div className="flex shrink-0 self-stretch my-auto h-4 rounded-md bg-neutral-800 w-[13px]" />
      </div>
      <div className="flex gap-5 items-center mt-7 w-full text-xs min-h-[35px]">
        {!isLast ? (
          <>
            <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 text-stone-300">
              <div>Floor price</div>
              <div className="flex gap-1 items-center self-start mt-1.5 whitespace-nowrap">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1af02e7da2998a51a0b83821ba90dab569cba4fe5b72790b8372097da76ccb0b?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Ethereum icon"
                  className="object-contain shrink-0 self-stretch my-auto w-2 aspect-[0.47]"
                />
                <div className="self-stretch my-auto">{floorPrice}</div>
              </div>
            </div>
            <div className="flex flex-col flex-1 shrink self-stretch my-auto whitespace-nowrap basis-0">
              <div className="text-stone-300">Volume</div>
              <div className="flex gap-1 items-center self-start mt-1.5 text-zinc-100">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1af02e7da2998a51a0b83821ba90dab569cba4fe5b72790b8372097da76ccb0b?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Ethereum icon"
                  className="object-contain shrink-0 self-stretch my-auto w-2 aspect-[0.47]"
                />
                <div className="self-stretch my-auto">{volume}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 shrink self-stretch my-auto basis-0 text-stone-300">
              Floor price
            </div>
            <div className="flex-1 shrink self-stretch my-auto whitespace-nowrap basis-0 text-stone-300">
              Volume
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export default NFTSection;
