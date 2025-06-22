import React from "react";
import FeatureItem from "./FeatureItem";

const SubscriptionTier = ({
  features,
  className,
  buttonClassName,
  showIcons = false,
  showImage = false,
}) => {
  return (
    <div className={className}>
      <div
        className={`${
          showImage ? "flex flex-col" : ""
        } w-full text-xs text-stone-300`}
      >
        {showImage && (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/809708f2e2f2af59224c1430103f0e5db861e179?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Subscription tier icon"
            className="object-contain self-center max-w-full aspect-square w-[100px]"
          />
        )}

        {features.map((feature, index) =>
          showIcons ? (
            <div
              key={index}
              className={`flex gap-2.5 items-center ${
                index > 0 ? "mt-4" : ""
              } w-full`}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5430ed75dc0d58dcafdb219144a6d589988f783?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Check icon"
                className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              />
              <p className="my-auto w-[204px]">{feature}</p>
            </div>
          ) : (
            <p
              key={index}
              className={`gap-2 self-stretch ${
                index > 0 ? "mt-3.5" : ""
              } w-full`}
            >
              {feature}
            </p>
          )
        )}
      </div>

      <button className={buttonClassName}>Subscribe</button>
    </div>
  );
};

export default SubscriptionTier;
