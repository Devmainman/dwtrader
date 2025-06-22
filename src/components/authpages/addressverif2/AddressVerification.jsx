"use client";
import React from "react";
import Header from "./Header";
import ProgressIndicator from "./ProgressIndicator";
import UploadArea from "./UploadArea";
import NavigationButtons from "./NavigationButtons";
import InfoSection from "./InfoSection";

function AddressVerification() {
  return (
    <main className="flex justify-center items-center p-5 w-full bg-neutral-900 min-h-[screen]">
      <article className="flex flex-col rounded-3xl bg-neutral-900 w-[390px]">
        <Header />
        <ProgressIndicator />
        <section className="flex flex-col gap-1.5 px-5 mb-8">
          <h1 className="text-lg font-medium leading-5 text-zinc-100">
            Address Verification
          </h1>
          <p className="text-xs tracking-normal leading-4 text-neutral-500">
            We will need to authenticate your account credibility details with
            Proof of Address
          </p>
        </section>
        <section className="flex flex-col gap-5 px-5">
          <UploadArea />
          <NavigationButtons />
          <InfoSection />
        </section>
      </article>
    </main>
  );
}

export default AddressVerification;
