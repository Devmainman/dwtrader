import React from "react";

function PersonalInformation() {
  const userInfo = [
    { label: "Full Name:", value: "Showole Benson" },
    { label: "Account ID:", value: "USER7719462596" },
    { label: "Mobile:", value: "+2348100649504" },
    { label: "Email:", value: "Showoleadeyemibenson@gmail.com" },
    { label: "Gender:", value: "Male" },
    { label: "Country", value: "Nigeria" },
    { label: "Currency:", value: "Nigeria Naira (NGN)" },
  ];

  return (
    <section className="overflow-hidden grow px-9 py-3.5 rounded-xl w-[545px] bg-[var(--card)] min-h-[358px] max-md:px-5 max-md:mt-3 max-md:max-w-full">
      <h3 className="text-sm font-medium tracking-normal leading-tight text-neutral-400 max-md:max-w-full">
        Personal Information
      </h3>

      <dl className="mt-4 w-full text-xs tracking-normal leading-none text-neutral-500 max-md:max-w-full">
        {userInfo.map((item, index) => (
          <div
            key={index}
            className={`flex flex-wrap gap-10 justify-between items-center ${
              index > 0 ? "mt-2" : ""
            } w-full max-md:max-w-full`}
          >
            <dt className="gap-2.5 self-stretch p-2.5 my-auto w-[86px]">
              {item.label}
            </dt>
            <dd
              className={`gap-2.5 self-stretch p-2.5 my-auto overflow-hidden min-w-60 w-[249px] ${
                item.label === "Email:" ? "flex-1 shrink basis-0" : ""
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default PersonalInformation;
