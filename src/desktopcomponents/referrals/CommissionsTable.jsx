import React from "react";
import CommissionEntry from "./CommissionEntry";

const CommissionsTable = () => {
  // Sample data for commission entries
  const commissions = [
    {
      id: 1,
      name: "Adesuwa Lateef",
      amount: "10.00 NGN",
      date: "27 Nov, 2024",
    },
    {
      id: 2,
      name: "Adesuwa Lateef",
      amount: "10.00 NGN",
      date: "27 Nov, 2024",
    },
    {
      id: 3,
      name: "Adesuwa Lateef",
      amount: "10.00 NGN",
      date: "27 Nov, 2024",
    },
    {
      id: 4,
      name: "Adesuwa Lateef",
      amount: "10.00 NGN",
      date: "27 Nov, 2024",
    },
    {
      id: 5,
      name: "Adesuwa Lateef",
      amount: "10.00 NGN",
      date: "27 Nov, 2024",
    },
  ];

  return (
    <section className="flex overflow-hidden grow shrink gap-2.5 justify-center items-center p-4 rounded-xl border border-solid bg-[#1D1D1F] border-neutral-600 min-w-60 w-[776px] max-md:max-w-full">
      <div className="flex-1 shrink self-stretch my-auto w-full basis-0 min-w-60 max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <div className="w-full max-md:max-w-full">
            <header className="flex flex-wrap gap-10 justify-between items-center w-full whitespace-nowrap max-md:max-w-full">
              <h2 className="self-stretch my-auto text-sm font-medium tracking-normal leading-tight text-zinc-100 w-[95px]">
                Commissions
              </h2>
              <div className="flex gap-1.5 items-center self-stretch my-auto text-xs text-neutral-400">
                <span className="self-stretch my-auto">Show</span>
                <div className="flex gap-1.5 justify-center items-center self-stretch px-1.5 py-0.5 my-auto text-xs bg-blue-600 rounded min-h-5 text-zinc-100 w-[45px]">
                  <span className="self-stretch my-auto">10</span>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/8df889bba600d1bde3a696b3a71f4581180d02b124d2ffac0b825c166b7512b0?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                    alt="Dropdown icon"
                  />
                </div>
                <span className="self-stretch my-auto">entries</span>
              </div>
            </header>
            <div className="mt-3.5 w-[89px]">
              <time className="text-xs text-neutral-400">December 7, 2024</time>
              <p className="mt-1.5 text-xs tracking-normal leading-none text-stone-300">
                Today
              </p>
            </div>
          </div>
        </div>

        {commissions.map((commission) => (
          <CommissionEntry
            key={commission.id}
            name={commission.name}
            amount={commission.amount}
            date={commission.date}
          />
        ))}
      </div>
    </section>
  );
};

export default CommissionsTable;
