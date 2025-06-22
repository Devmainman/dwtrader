"use client";
import * as React from "react";
import Header from "./Header";
import WebcamCaptureContent from "./WebcamCaptureContent";
import InstructionsSidebar from "./InstructionsSidebar";

function WebcamCapture() {
  return (
    <main className="flex overflow-hidden flex-col px-10 py-14 bg-neutral-900 max-md:px-5">
      <Header />
      <section className="self-center mt-16 w-full max-w-[1283px] max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[68%] max-md:ml-0 max-md:w-full">
            <WebcamCaptureContent />
          </div>
          <div className="ml-5 w-[32%] max-md:ml-0 max-md:w-full">
            <InstructionsSidebar />
          </div>
        </div>
      </section>
    </main>
  );
}

export default WebcamCapture;
