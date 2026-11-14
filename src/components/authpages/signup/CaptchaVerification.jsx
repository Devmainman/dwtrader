"use client";
import React, { useState } from "react";

function CaptchaVerification() {
  const [answer, setAnswer] = useState("");

  return (
    <section className="mt-11 w-full text-xs tracking-normal leading-none">
      <div className="flex flex-col justify-center items-center w-full">
        <p className="text-yellow-700">Confirm you are not a robot</p>
        <div className="flex gap-2.5 items-start mt-2.5">
          <div className="overflow-hidden px-5 py-3 rounded-lg border border-solid border-[color:var(--Primary-Blue,var(--color-blue-600))] min-h-[39px] text-neutral-400 w-[168px]">
            18 +9
          </div>
          <input
            type="text"
            placeholder="Enter Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="overflow-hidden px-5 py-3 rounded-lg bg-zinc-900 min-h-[39px] text-neutral-600 w-[168px] border-none outline-none"
          />
        </div>
      </div>
    </section>
  );
}

export default CaptchaVerification;
