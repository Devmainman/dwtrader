"use client";
import React from "react";
import SubscriptionCard from "./SubscriptionCard";
import LevelSelector from "./LevelSelector";
import ProceedButton from "./ProceedButton";

function AccountUpgrade() {
  return (
    <section className="flex flex-col items-start px-20 mx-auto w-full max-w-[480px] max-md:pl-5">
      <article className="overflow-hidden px-5 pt-32 pb-16 w-full rounded-3xl bg-neutral-900 max-md:pt-24">
        <header className="flex gap-10 justify-center items-start text-zinc-100">
          <h1 className="text-base font-medium tracking-normal leading-tight w-[226px]">
            Account Upgrade
          </h1>
          <span className="gap-2.5 self-stretch px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap bg-yellow-700 rounded-3xl min-h-[21px] w-[39px]">
            PRO
          </span>
        </header>

        <div className="flex gap-7 items-center mt-6">
          <SubscriptionCard
            variant="simple"
            features={[
              "Minimal Trading Fees: 40% discount on trading fees",
              "Exclusive Market Insights: Daily reports and real-time market updates.",
              "VIP Customer Support: 24/7 support with the fastest response times",
              "Elite Trading Tools: Access to full trading suite, including AI-driven analysis",
              "Unlimited Withdrawals: No limit on daily withdrawals.",
            ]}
          />

          <SubscriptionCard
            variant="detailed"
            features={[
              {
                text: "Minimal Trading Fees: 40% discount on trading fees",
                iconSrc:
                  "https://cdn.builder.io/api/v1/image/assets/TEMP/1ea56cc0adb038c5a18164ab4f56e4355acd7622?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
              },
              {
                text: "Exclusive Market Insights: Daily reports and real-time market updates.",
                iconSrc:
                  "https://cdn.builder.io/api/v1/image/assets/TEMP/90aa9c899b56c37f65b776d0342166e1c50c353a?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
              },
              {
                text: "VIP Customer Support: 24/7 support with the fastest response times",
                iconSrc:
                  "https://cdn.builder.io/api/v1/image/assets/TEMP/90aa9c899b56c37f65b776d0342166e1c50c353a?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
              },
              {
                text: "Elite Trading Tools: Access to full trading suite, including AI-driven analysis",
                iconSrc:
                  "https://cdn.builder.io/api/v1/image/assets/TEMP/a294a8b0c99694c624c8a16d888f241ecc53961d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
              },
              {
                text: "Unlimited Withdrawals: No limit on daily withdrawals.",
                iconSrc:
                  "https://cdn.builder.io/api/v1/image/assets/TEMP/1ea56cc0adb038c5a18164ab4f56e4355acd7622?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
              },
            ]}
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/580a104af77a3134a9728fcc436a429333638f4b?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          />
        </div>

        <footer className="flex flex-col mt-24 w-full text-xs tracking-normal leading-none text-zinc-100 max-md:mt-10">
          <LevelSelector
            levels={[
              { name: "Silver Level", active: false },
              { name: "Gold Level", active: false },
              { name: "Bronze Level", active: false },
              { name: "Platinum Level", active: true },
            ]}
          />

          <ProceedButton price="5,000,00 NGN" />
        </footer>
      </article>
    </section>
  );
}

export default AccountUpgrade;
