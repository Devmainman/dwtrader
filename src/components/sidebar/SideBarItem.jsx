import React from "react";

function SideBarItem({ icon, text }) {
  return (
    <li className="flex gap-2.5 items-center px-8 w-full whitespace-nowrap rounded-3xl min-h-[51px]">
      {icon && (
        <img
          src={icon}
          className="object-contain shrink-0 self-stretch my-auto aspect-[0.83] w-[19px]"
          alt={`${text} icon`}
        />
      )}
      <span className="self-stretch my-auto">{text}</span>
    </li>
  );
}

export default SideBarItem;
