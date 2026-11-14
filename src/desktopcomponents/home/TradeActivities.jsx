import React from "react";

function TradeActivities() {
  return (
    <section className="flex overflow-hidden gap-2.5 justify-center items-center p-4 mt-2.5 rounded-xl border border-solid bg-[#1D1D1F] border-neutral-600">
      <div className="flex-1 shrink self-stretch my-auto w-full basis-0 min-w-60">
        <div className="w-full">
          <div className="w-full">
            <div className="flex gap-10 justify-between items-center w-full">
              <h3 className="self-stretch my-auto text-[14px] font-medium tracking-normal leading-tight text-zinc-100 w-[127px]">
                Trade Activities
              </h3>
              <div className="flex gap-1.5 items-center self-stretch my-auto text-[8px] whitespace-nowrap text-neutral-400">
                <span className="self-stretch my-auto">Show</span>
                <div className="flex gap-1.5 justify-center items-center self-stretch px-1.5 py-0.5 my-auto text-[10px] bg-blue-600 rounded min-h-5 text-zinc-100 w-[45px]">
                  <span className="self-stretch my-auto">10</span>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/51b079f15ac477fb1d71de7b620db5a223e68167997a0f74002e9f8a31bf7dc8?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                    alt="Dropdown arrow"
                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                  />
                </div>
                <span className="self-stretch my-auto">entries</span>
              </div>
            </div>
            <div className="mt-3.5 w-[89px]">
              <div className="text-[8px] text-neutral-400">December 1, 2024</div>
              <div className="mt-1.5 text-[12px] tracking-normal leading-none text-stone-300">
                Today
              </div>
            </div>
          </div>
          <div className="flex gap-7 justify-between items-center mt-5 w-full whitespace-nowrap">
            <DayItem day="Mon" date="4" isActive={false} />
            <DayItem day="Tue" date="5" isActive={false} />
            <DayItem day="Wed" date="6" isActive={false} />
            <DayItem day="Thur" date="7" isActive={true} />
            <DayItem day="Fri" date="8" isActive={false} />
            <DayItem day="Sat" date="9" isActive={false} />
            <DayItem day="Sun" date="10" isActive={false} />
          </div>
        </div>
        <div className="mt-4 w-full">
          <TradeActivityItem status="paused" />
          <TradeActivityItem status="terminated" />
          <TradeActivityItem status="in-progress" />
          <TradeActivityItem status="completed" />
        </div>
        <div className="mt-4 text-[10px] text-center text-blue-600">
          Showing All
        </div>
      </div>
    </section>
  );
}

function DayItem({ day, date, isActive }) {
  return (
    <div
      className={`flex flex-col justify-center ${
        isActive
          ? "items-center self-stretch py-1.5 pr-1.5 pl-1.5 my-auto bg-yellow-700 rounded-xl text-zinc-100 w-[35px]"
          : "items-center self-stretch my-auto w-[23px]"
      }`}
    >
      <div
        className={`text-[10px] ${isActive ? "font-semibold" : "text-stone-300"}`}
      >
        {day}
      </div>
      <div
        className={`mt-1 text-[18px] font-medium leading-tight ${
          isActive ? "" : "text-neutral-500"
        }`}
      >
        {date}
      </div>
    </div>
  );
}

function TradeActivityItem({ status }) {
  const isInProgress = status === "in-progress";
  const statusColors = {
    paused: "bg-yellow-600",
    terminated: "bg-red-600",
    "in-progress": "bg-blue-600",
    completed: "bg-green-700",
  };

  const statusText = {
    paused: "Paused",
    terminated: "Terminated",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  const progressPercentage = {
    paused: "100%",
    terminated: "100%",
    "in-progress": "37%",
    completed: "100%",
  };

  return (
    <div className="flex gap-0 mt-2.5 w-[313px] h-[103px]">
      <div className="flex  gap-1 flex-col items-center h-full">
        {/* Top Circle */}
        <div className="w-5 h-5 rounded-full border border-[color:var(--Linear-color,#EB25C6)]" />

        {/* Top Line */}
        <div className="w-[2px] flex-1 bg-[linear-gradient(180deg,#EB25C6_0%,#F5852F_100%)]" />
      
    </div>

      <div
        className={`flex flex-col flex-1 shrink justify-center self-start px-2.5 py-4 rounded-xl basis-0 ${
          isInProgress ? "bg-neutral-900" : "bg-neutral-800"
        } min-w-60`}
      >
        <div className="w-[full]">
          <div className="w-full">
            <div className="flex gap-2 items-center w-full">
              <div className="self-stretch my-auto w-[108px]">
                <div className="text-[12px] font-semibold tracking-normal leading-none text-fuchsia-600">
                  Swift
                </div>
                <div className="text-[10px] text-neutral-400">
                  27 Nov, 2024 09:14am
                </div>
              </div>
              <div className="self-stretch my-auto">
                <div className="text-[10px] text-neutral-400">Trade Amount</div>
                <div className="text-[10px] text-zinc-100">50 NGN</div>
              </div>
              <div className="self-stretch my-auto">
                <div className="text-[10px] text-neutral-400">Profit Returns</div>
                <div className="text-[10px] text-zinc-100">720 NGN</div>
              </div>
            </div>
            <div className="flex overflow-hidden flex-col items-start mt-2 w-full text-[4px] text-white whitespace-nowrap bg-white rounded-xl max-md:pr-5">
              <div
                className={`overflow-hidden h-[4px] px-5 py-px ${
                  statusColors[status]
                } rounded-xl ${
                  status === "in-progress" ? "w-[57px]" : ""
                } max-md:px-5`}
              >
                {progressPercentage[status]}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`gap-1.5 self-end px-1.5 py-1 mt-${
            isInProgress ? "1.5" : "1.5"
          } text-[8px] ${statusColors[status]} rounded min-h-[15px] text-zinc-100`}
        >
          {statusText[status]}
        </div>
      </div>
    </div>
  );
}

export default TradeActivities;
