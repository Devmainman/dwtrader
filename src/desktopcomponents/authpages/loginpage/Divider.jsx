import React from "react";

function Divider() {
  return (
    <div className="flex gap-1.5 items-center self-center mt-7 text-xs whitespace-nowrap text-stone-500">
      <div className="shrink-0 self-stretch my-auto h-0 border border-solid border-neutral-600 w-[139px]" />
      <span className="self-stretch my-auto">or</span>
      <div className="shrink-0 self-stretch my-auto h-0 border border-solid border-neutral-600 w-[139px]" />
    </div>
  );
}

export default Divider;
