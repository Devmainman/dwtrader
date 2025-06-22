import React from "react";

const SignalStrength = ({ percentage }) => {
  // Convert percentage string to number
  const percentValue = parseInt(percentage.replace("%", ""), 10);

  return (
    <section className="mt-2.5 w-full max-md:max-w-full">
      <div className="flex flex-wrap gap-10 justify-between items-center w-full text-xs tracking-normal leading-none text-stone-300 max-md:max-w-full">
        <p className="self-stretch my-auto">Signal Strength</p>
        <p className="self-stretch my-auto">{percentage}</p>
      </div>
      <div className="flex overflow-hidden flex-col items-start mt-2 w-full bg-zinc-100 max-md:pr-5 max-md:max-w-full">
        <div
          className="flex shrink-0 max-w-full bg-blue-600 rounded-none h-[7px]"
          style={{ width: `${percentValue}%` }}
        />
      </div>
    </section>
  );
};

export default SignalStrength;
