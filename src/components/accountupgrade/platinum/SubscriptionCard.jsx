"use client";
import React from "react";
import FeatureList from "./FeatureList";

function SubscriptionCard({ variant, features, iconSrc }) {
  if (variant === "simple") {
    return (
      <article className="flex overflow-hidden flex-col items-start self-stretch py-5 pr-3 my-auto rounded-2xl border border-solid bg-zinc-900 border-neutral-600 w-[243px]">
        <FeatureList features={features} variant="simple" />
        <SubscribeButton variant="simple" />
      </article>
    );
  }

  return (
    <article className="overflow-hidden self-stretch p-6 my-auto rounded-3xl border border-solid bg-zinc-900 border-neutral-600 min-w-60 w-[286px] max-md:px-5">
      <div className="flex flex-col w-full text-xs text-stone-300">
        <img
          src={iconSrc}
          alt="Subscription icon"
          className="object-contain self-center max-w-full aspect-square w-[100px]"
        />
        <FeatureList features={features} variant="detailed" />
      </div>
      <SubscribeButton variant="detailed" />
    </article>
  );
}

function SubscribeButton({ variant }) {
  if (variant === "simple") {
    return (
      <button className="overflow-hidden gap-2 self-stretch py-2.5 pr-2 mt-6 text-xs tracking-normal leading-none whitespace-nowrap rounded-2xl border-solid border-[0.85px] border-[color:var(--Primary-Blue,#E8742A)] min-h-[30px] text-zinc-100">
        Subscribe
      </button>
    );
  }

  return (
    <button className="overflow-hidden gap-2.5 self-stretch p-2.5 mt-5 text-xs tracking-normal leading-none whitespace-nowrap rounded-3xl border border-solid border-[color:var(--Primary-Blue,#E8742A)] min-h-[35px] text-zinc-100">
      Subscribe
    </button>
  );
}

export default SubscriptionCard;
