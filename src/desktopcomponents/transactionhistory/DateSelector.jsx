"use client";
import React from "react";

function DateSelector() {
  return (
    <div>
      <div className="mt-3.5 w-[89px]">
        <div className="text-[8px] text-neutral-400">December 7, 2024</div>
        <div className="mt-1.5 text-xs tracking-normal leading-none text-stone-300">
          Today
        </div>
      </div>

      <div className="flex flex-wrap gap-10 justify-between items-center mt-5 w-full whitespace-nowrap max-md:max-w-full">
        <DayItem day="Mon" date="4" />
        <DayItem day="Tue" date="5" />
        <DayItem day="Wed" date="6" />
        <DayItem day="Thur" date="7" isActive={true} />
        <DayItem day="Fri" date="8" />
        <DayItem day="Sat" date="9" />
        <DayItem day="Sun" date="10" />
      </div>
    </div>
  );
}

function DayItem({ day, date, isActive = false }) {
  if (isActive) {
    return (
      <div className="flex flex-col justify-center items-center self-stretch py-1.5 px-1.5 my-auto bg-yellow-700 rounded-xl text-zinc-100 w-[35px]">
        <div className="text-xs font-semibold">{day}</div>
        <div className="mt-1 text-lg font-medium leading-tight">{date}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center self-stretch my-auto w-[23px]">
      <div className="text-xs text-stone-300">{day}</div>
      <div className="mt-1 text-lg font-medium leading-tight text-neutral-500">
        {date}
      </div>
    </div>
  );
}

export default DateSelector;
