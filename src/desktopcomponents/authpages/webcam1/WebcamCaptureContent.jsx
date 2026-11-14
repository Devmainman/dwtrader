"use client";
import React from "react";
import ProgressIndicator from "./ProgressIndicator";

function WebcamCaptureContent() {
  return (
    <article className="flex overflow-hidden flex-col justify-center px-12 py-10 mx-auto w-full rounded-3xl border border-solid bg-zinc-900 border-neutral-600 max-md:px-5 max-md:mt-4 max-md:max-w-full">
      <div className="max-w-full font-medium w-[470px]">
        <div className="w-full max-md:max-w-full">
          <h1 className="text-5xl tracking-wide text-zinc-100 max-md:max-w-full">
            Welcome
          </h1>
          <p className="text-sm tracking-normal leading-tight text-neutral-400">
            You're a few steps to completing your profile
          </p>
        </div>
        <div className="gap-2.5 self-stretch p-2.5 mt-5 max-w-full text-sm tracking-normal leading-tight rounded-lg bg-neutral-800 text-stone-300 w-[204px]">
          Account Authentication
        </div>
      </div>

      <div className="flex flex-wrap gap-10 justify-between items-start mt-8 max-w-full w-[766px]">
        <div className="flex flex-col justify-center min-w-60 w-[350px]">
          <div className="w-full">
            <h2 className="text-lg font-medium leading-tight text-zinc-100">
              Webcam Capture
            </h2>
            <p className="mt-1.5 text-xs tracking-normal leading-4 text-neutral-500">
              We will need to authenticate your account credibility details with
              a Face Capture
            </p>
          </div>
          <div className="flex flex-wrap gap-5 items-end self-center mt-16 max-w-full text-xs tracking-normal leading-none whitespace-nowrap text-zinc-100 w-[325px] max-md:mt-10">
            <button className="overflow-hidden grow shrink gap-2.5 self-stretch px-2.5 py-3.5 bg-blue-600 rounded-3xl min-h-[42px] min-w-60 w-[294px]">
              Upload
            </button>
            <button className="overflow-hidden grow shrink gap-2.5 self-stretch px-2.5 py-3.5 rounded-3xl border border-solid bg-zinc-900 border-[color:var(--Primary-Blue,var(--color-blue-600))] min-h-[42px] w-[125px]">
              Retake
            </button>
            <button className="overflow-hidden grow shrink gap-2.5 self-stretch px-2.5 py-3.5 bg-red-600 rounded-3xl min-h-[42px] w-[125px]">
              Cancel
            </button>
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/be22c7cc5a2276ef4e2f5dd90eb558d06a044685?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Webcam Preview"
          className="object-contain aspect-[0.99] min-w-60 w-[294px]"
        />
      </div>

      <ProgressIndicator />
    </article>
  );
}

export default WebcamCaptureContent;
