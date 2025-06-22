import React from "react";

function SignalStrength({ percentage }) {
  // Calculate width based on percentage
  const widthPercentage = parseInt(percentage, 10);
  const widthStyle = { width: `${widthPercentage}%` };

  return (
    <div className="mt-2.5 w-full max-md:max-w-full">
      <div className="flex flex-wrap gap-10 justify-between items-center w-full text-xs tracking-normal leading-none text-stone-300 max-md:max-w-full">
        <span className="self-stretch my-auto">Signal Strength</span>
        <span className="self-stretch my-auto">{percentage}</span>
      </div>
      <div className="flex overflow-hidden flex-col items-start mt-2 w-full bg-zinc-100 max-md:pr-5 max-md:max-w-full">
        <div
          className="flex shrink-0 bg-blue-600 rounded-none h-[7px]"
          style={widthStyle}
        />
      </div>
    </div>
  );
}

export default SignalStrength;
