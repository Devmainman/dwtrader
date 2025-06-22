import React from "react";

function NotificationSection() {
  return (
    <section className="flex overflow-hidden flex-col mt-3 w-350px h-[359px]">
      <div className="flex overflow-hidden flex-col justify-center px-1 py-4 w-full bg-zinc-900">
        <h3 className="text-xs tracking-normal leading-none text-stone-300">
          Recent Notification
        </h3>
        <div className="flex gap-2.5 items-start self-center mt-1.5">
          <div className="flex flex-col justify-center min-w-60 w-full">
            <NotificationCard />
            <NotificationCard />
          </div>
          <div className="pb-44 w-0.5 rounded-xl bg-stone-300 max-md:pb-24">
            <div className="flex shrink-0 h-20 rounded-xl bg-neutral-600 max-md:-mr-0.5" />
          </div>
        </div>
      </div>
      <div className="self-center mt-1.5 max-w-full text-sm font-medium tracking-normal leading-tight text-neutral-400 w-[342px]">
        <div className="overflow-hidden px-3.5 pt-4 w-full rounded-lg bg-neutral-800">
          <div className="w-full">
            <div className="flex gap-2.5 items-start w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b6e9a48afc3a173f6c476588f9347dde0d86c0cf338cd04ee6f4ef037d79c521?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Document icon"
                className="object-contain shrink-0 w-7 aspect-[1.4]"
              />
              <div className="min-w-60 w-[277px]">
                Contract Document Notification
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotificationCard() {
  return (
    <article className="overflow-hidden px-3.5 pt-4 pb-1 mt-3 w-full rounded-lg bg-neutral-900">
      <div className="flex flex-col w-full">
        <div className="flex gap-2.5 items-start w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8f6e2db70830793a33075aa5069a635c44a4074da9ae7fb78e0d722d96de7708?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Notification icon"
            className="object-contain shrink-0 w-7 aspect-square"
          />
          <div className="min-w-60 w-[277px]">
            <h4 className="text-sm font-medium tracking-normal leading-tight text-neutral-400">
              Contract Document Notification
            </h4>
            <p className="mt-1.5 text-xs tracking-normal leading-4 text-neutral-600">
              To proceed, please download the required form, complete it with
              the necessary information, and send it back
            </p>
          </div>
        </div>
        <div className="flex gap-10 items-center self-end mt-3.5 text-xs text-center">
          <div className="flex gap-1.5 items-center self-stretch my-auto tracking-normal leading-none text-neutral-500">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ba9771b5c26fff383627debdd0a9c4d2e07869a93b54d930f31d3567348667e?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Clock icon"
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
            <span className="self-stretch my-auto">9 hours ago</span>
          </div>
          <button className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-1.5 my-auto leading-tight text-blue-600 rounded-xl border border-solid basis-0 bg-neutral-800 border-zinc-900 min-h-[23px] w-[107px]">
            Mark as Read
          </button>
        </div>
      </div>
    </article>
  );
}

export default NotificationSection;
