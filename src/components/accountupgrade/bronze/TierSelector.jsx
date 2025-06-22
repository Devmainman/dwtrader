import React from "react";

const TierSelector = ({ selectedTier, onSelectTier }) => {
  const tiers = [
    "Silver Level",
    "Gold Level",
    "Bronze Level",
    "Platinum Level",
  ];

  return (
    <div className="flex overflow-hidden gap-1 items-center py-2 w-full rounded-3xl bg-neutral-800">
      {tiers.map((tier) => (
        <button
          key={tier}
          className={`gap-2.5 self-stretch px-4 py-2 my-auto rounded-3xl border border-solid ${
            selectedTier === tier
              ? "bg-blue-600 border-[color:var(--white-90,#505050)]"
              : "border-neutral-600"
          } min-h-[29px]`}
          onClick={() => onSelectTier(tier)}
        >
          {tier}
        </button>
      ))}
    </div>
  );
};

export default TierSelector;
