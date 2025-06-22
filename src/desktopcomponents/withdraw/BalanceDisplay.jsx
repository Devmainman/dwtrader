import React from "react";

const BalanceDisplay = ({ icon, label, amount }) => {
  return (
    <section className="mt-8 max-w-full whitespace-nowrap w-[353px]">
      <h3 className="text-xs tracking-normal leading-none text-neutral-400">
        {label}
      </h3>
      <div className="flex overflow-hidden gap-10 px-4 py-6 w-full leading-tight rounded-xl bg-neutral-900">
        <div className="flex flex-1 gap-2.5 items-center text-xs font-semibold tracking-normal text-zinc-100">
          <img
            src={icon}
            className="object-contain shrink-0 self-stretch my-auto aspect-square fill-zinc-100 w-[34px]"
            alt={label}
          />
          <span className="self-stretch my-auto">{label}</span>
        </div>
        <div className="flex flex-1 justify-center items-center my-auto text-base font-medium tracking-normal text-zinc-100">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e13805cc530528093f06d17a963c8701146fd1e604336143b869327149b5f83?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            alt="Currency icon"
          />
          <span className="self-stretch my-auto">{amount}</span>
        </div>
      </div>
    </section>
  );
};

export default BalanceDisplay;
