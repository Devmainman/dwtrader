"use client";
import React from "react";
import ImageUploader from "./ImageUploader";

/**
 * Main component that displays the image upload interface
 */
function InputDesign() {
  return (
    <article className="flex overflow-hidden flex-col justify-center items-center px-20 py-8 text-xs tracking-normal leading-none text-center rounded-xl bg-zinc-900 max-w-[568px] text-zinc-100 max-md:px-5">
      <ImageUploader />
    </article>
  );
}

export default InputDesign;
