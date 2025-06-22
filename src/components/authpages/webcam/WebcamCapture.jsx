"use client";
import React from "react";
import Header from "./Header";
import ProgressIndicator from "./ProgressIndicator";
import CaptureArea from "./CaptureArea";
import ActionButtons from "./ActionButtons";
import InstructionsPanel from "./InstructionsPanel";

function WebcamCapture() {
  return (
    <main className="mx-auto max-w-none min-h-screen bg-neutral-900 w-[390px] max-md:max-w-[991px] max-sm:w-full max-sm:max-w-screen-sm font-['Montserrat']">
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <Header />
      <ProgressIndicator />
      <section className="p-5">
        <header className="mb-8">
          <h1 className="mb-1.5 text-lg font-medium text-zinc-100">
            Webcam Capture
          </h1>
          <p className="text-xs tracking-normal leading-4 text-neutral-500">
            We will need to authenticate your account credibility details with a
            Face Capture
          </p>
        </header>

        <CaptureArea />
        <ActionButtons />
        <InstructionsPanel />
      </section>
    </main>
  );
}

export default WebcamCapture;
