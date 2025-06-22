import React from "react";

const SignalStrengthIndicator = ({ percentage }) => {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-xs tracking-normal leading-4 text-stone-300">
          Signal Strength
        </h3>
        <span className="text-xs tracking-normal leading-4 text-stone-300">
          {percentage}%
        </span>
      </div>
      <div className="relative bg-zinc-100 h-[7px]">
        <div
          className="h-full bg-blue-600 rounded-none"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
};

export default SignalStrengthIndicator;
