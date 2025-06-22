"use client";
import * as React from "react";

function InstructionItem({ text, className = "" }) {
  return (
    <div className={`flex gap-1.5 items-start w-full ${className}`}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec72992227cd154fb2146c3e5d8ce946243da6ff1a40a849a3ff6168b935b4d6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        alt="Instruction bullet point"
        className="object-contain shrink-0 aspect-square w-[18px]"
      />
      <p className="flex-1 shrink basis-0">{text}</p>
    </div>
  );
}

export default InstructionItem;
