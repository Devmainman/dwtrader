import React from "react";

function RequirementItem({ text, className = "" }) {
  return (
    <div className={`flex gap-1.5 items-center w-full ${className}`}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c6d24b028c73d802c474923cb9450b8cda117bd1?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
        alt="Checkmark"
      />
      <span className="flex-1 shrink self-stretch my-auto basis-0">{text}</span>
    </div>
  );
}

export default RequirementItem;
