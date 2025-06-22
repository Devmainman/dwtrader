import React from "react";

function VerificationItem({ text }) {
  return (
    <div className="flex gap-1.5 items-center mt-3.5 w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        alt="Checkmark icon"
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
      />
      <span className="flex-1 shrink self-stretch my-auto basis-0">{text}</span>
    </div>
  );
}

export default VerificationItem;
