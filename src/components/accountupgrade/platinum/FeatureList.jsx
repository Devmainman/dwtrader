import React from "react";

function FeatureList({ features, variant }) {
  if (variant === "simple") {
    return (
      <ul className="w-full text-xs text-stone-300">
        {features.map((feature, index) => (
          <li
            key={index}
            className={`gap-2 self-stretch w-full ${index > 0 ? "mt-3.5" : ""}`}
          >
            {feature}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="w-full">
      {features.map((feature, index) => (
        <li
          key={index}
          className={`flex gap-2.5 items-center ${
            index > 0 ? "mt-4" : ""
          } w-full`}
        >
          <img
            src={feature.iconSrc}
            alt="Feature icon"
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
          <p className="my-auto w-[204px]">{feature.text}</p>
        </li>
      ))}
    </ul>
  );
}

export default FeatureList;
