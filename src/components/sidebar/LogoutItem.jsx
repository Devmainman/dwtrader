import React from "react";

function LogoutItem() {
  return (
    <div className="flex gap-2.5 items-center px-8 mt-10 text-sm font-medium tracking-normal leading-tight whitespace-nowrap border-t border-neutral-600 min-h-[51px] text-stone-300">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c1913937d7355ba3da8db8dfe504c392e0bbeae94bb9c09949bec59ee67cbeb9?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        alt="Logout icon"
      />
      <span className="self-stretch my-auto">Logout</span>
    </div>
  );
}

export default LogoutItem;
