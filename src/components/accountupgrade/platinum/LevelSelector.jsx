import React from "react";

function LevelSelector({ levels }) {
  return (
    <nav className="flex overflow-hidden gap-1 items-center py-2 w-full rounded-3xl bg-neutral-800">
      {levels.map((level, index) => (
        <button
          key={index}
          className={`gap-2.5 self-stretch px-4 py-2 my-auto rounded-3xl border border-solid ${
            level.active
              ? "bg-blue-600 border-[color:var(--white-90,#505050)]"
              : "border-neutral-600"
          } min-h-[29px]`}
        >
          {level.name}
        </button>
      ))}
    </nav>
  );
}

export default LevelSelector;
