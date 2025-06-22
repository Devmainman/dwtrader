import React from "react";

const NotificationItem = ({
  date,
  subject,
  status,
  statusColor = "bg-yellow-700",
}) => {
  return (
    <article className="flex gap-2.5 items-start w-full max-md:max-w-full">
      <div className="flex flex-col flex-1 shrink justify-center px-2.5 py-4 w-full rounded-xl basis-0 bg-neutral-800 min-w-60 max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
            <div className="self-stretch my-auto w-[108px]">
              <h3 className="text-[10px] font-semibold tracking-normal leading-none text-neutral-400">
                Date
              </h3>
              <p className="text-[10px] text-zinc-100">{date}</p>
            </div>

            <div className="self-stretch my-auto">
              <h3 className="text-[10px] font-semibold tracking-normal leading-none text-neutral-400">
                Subject
              </h3>
              <p className="text-[10px] text-zinc-100">{subject}</p>
            </div>

            <div className="self-stretch my-auto whitespace-nowrap">
              <h3 className="text-[12px] font-semibold tracking-normal leading-none text-neutral-400">
                Status
              </h3>
              <div className="flex flex-col justify-center text-[8px] text-center text-zinc-100">
                <div
                  className={`gap-3 self-stretch py-0.5 pr-2 pl-2 ${statusColor} rounded`}
                >
                  {status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NotificationItem;
