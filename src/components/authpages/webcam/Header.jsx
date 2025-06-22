"use client";
import React from "react";
import UKFlagIcon from "./UKFlagIcon";
import DownArrowIcon from "./DownArrowIcon";

function Header() {
  return (
    <header className="flex justify-between items-center p-5 mt-10">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ecfe5de30fb6227d26ec75e4fd3e471879ab5d5"
        className="h-10 w-[43px]"
        alt="Logo"
      />
      <div className="flex gap-2.5 items-center px-2.5 py-1.5 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 w-[165px] max-sm:w-[140px]">
        <div className="flex gap-1.5 items-center">
          <UKFlagIcon />
          <DownArrowIcon />
        </div>
        <span className="text-xs select-text text-neutral-600">
          Select Language
        </span>
      </div>
    </header>
  );
}

export default Header;
