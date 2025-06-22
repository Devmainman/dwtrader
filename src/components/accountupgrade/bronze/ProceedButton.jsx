import React from "react";

const ProceedButton = ({ price }) => {
  return (
    <button className="flex overflow-hidden gap-2.5 justify-center items-center self-center px-2.5 py-2 mt-5 max-w-full bg-blue-600 rounded-3xl min-h-[51px] w-[325px]">
      <div className="flex flex-col justify-center items-center self-stretch my-auto">
        <span>Proceed with Plan</span>
        <span className="mt-1.5 font-bold">{price}</span>
      </div>
    </button>
  );
};

export default ProceedButton;
