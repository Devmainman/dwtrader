"use client";
import React from "react";
import StatCard from "./StatCard";
import ProgressBar from "./ProgressBar";
import TicketCard from "./TicketCard";
import Button from "./Button";

function OpenSupportDesktop() {
  return (
    <section className="flex overflow-hidden flex-col items-end pt-28 pr-5 pb-48 pl-20 bg-neutral-900 max-md:px-5 max-md:py-24">
      <h1 className="self-start text-3xl font-medium tracking-normal leading-tight text-zinc-100">
        Support Ticket
      </h1>
      <div className="mt-5 w-full max-w-[1129px] max-md:max-w-full">
        <div className="flex flex-wrap gap-2.5 items-center w-full max-md:max-w-full">
          <StatCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/7497f547821d07f3297c1ed36aee29431feae2a3efedd437ada6d065e571172e?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Total Profit"
            value="5,576,910.00"
            currency="NGN"
            percentage="10.4%"
            growth="Growth"
          />
          <StatCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8f05a1b37c47976147eea53238a135bbfd81cebdaeac0bd33d37d1cf33ac49dd?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Total Trade"
            value="10,250.00"
            currency="NGN"
            percentage="10.4%"
            growth="Growth"
            iconClassName="fill-neutral-800 stroke-[1px] stroke-fuchsia-600"
          />
          <StatCard
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1ca143ec3437869cc60724974a4aeed71851c7d318919efdc2075f8e62e728a3?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            title="Referrals"
            value="600,00"
            currency="NGN"
            percentage="10.4%"
            growth="Growth"
          />
        </div>

        <ProgressBar label="Signal Strength" percentage={60} />
      </div>

      <section className="flex overflow-hidden flex-col justify-center px-5 py-6 mt-5 w-full rounded-xl bg-zinc-900 max-w-[1128px] max-md:max-w-full">
        <div className="flex flex-wrap gap-8 justify-center items-center w-full max-md:max-w-full">
          <h2 className="flex-1 shrink self-stretch my-auto text-sm font-medium tracking-normal leading-tight basis-10 text-neutral-400 max-md:max-w-full">
            Support Tickets
          </h2>
          <Button variant="primary" className="flex-1 shrink basis-0 w-[171px]">
            Open New Ticket
          </Button>
        </div>

        <div className="flex flex-wrap gap-5 items-center self-center mt-8 max-md:max-w-full">
          <TicketCard
            title="There is no picture in this very ticket"
            date="24 Nov, 2024 15:36pm"
            priority="Medium"
            status="Open"
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/e9b884ede4b6dcbd6bce3423f3a7ba9acb8509313c9db7a49890bc2b13546404?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          />

          <TicketCard
            title="I love this website"
            date="24 Nov, 2024 15:36pm"
            priority="High"
            status="Open"
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/fb9253c94e6b0a5bff449284131f8265dd11e12946421b702c1e53a9f49db5de?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          />

          <TicketCard
            title="Terminal Needed"
            date="24 Nov, 2024 15:36pm"
            priority="High"
            status="Closed"
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/fa0d5c9128f09be9f134f4d86c42c9eb6bb123c03efd755c3dcc7209fee1a986?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          />
        </div>
      </section>
    </section>
  );
}

export default OpenSupportDesktop;
