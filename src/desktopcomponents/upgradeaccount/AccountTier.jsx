import React from "react";

function AccountTier({ icon, title, features, price }) {
  return (
    <article className="flex overflow-hidden flex-col grow shrink justify-center items-center px-4 py-8 rounded-3xl border border-solid bg-[#1D1D1F] border-neutral-600 min-w-60 w-[214px]">
      <div className="flex flex-col items-center text-[28px] font-medium tracking-normal leading-tight">
        <img
          src={icon}
          className="object-contain max-w-full aspect-square w-[100px]"
          alt={title}
        />
        <h3 className="mt-4 text-[28px]">{title}</h3>
      </div>
      <ul className="self-stretch mt-8 w-full text-[10px]">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex gap-2.5 items-center mt-4 w-full first:mt-0"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/66c0cf87127c233cccab925d7c414e3db4c29edbabd2ca372baa4927c48f29bc?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              alt="Check mark"
            />
            <span className="flex-1 shrink my-auto basis-0">{feature}</span>
          </li>
        ))}
      </ul>
      <button className="flex overflow-hidden gap-2.5 justify-center items-center px-2.5 py-2 mt-8 max-w-full text-xs tracking-normal leading-none bg-blue-600 rounded-3xl min-h-[51px] text-zinc-100 w-[237px]">
        <div className="flex flex-col justify-center items-center self-stretch my-auto">
          <span>Proceed with Plan</span>
          <span className="mt-1.5 font-bold">{price}</span>
        </div>
      </button>
    </article>
  );
}

export default AccountTier;
