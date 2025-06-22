import React from "react";

const FeatureItem = ({ text, showIcon = false }) => {
  return (
    <div className="flex gap-2.5 items-center w-full mt-4 first:mt-0">
      {showIcon && (
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5430ed75dc0d58dcafdb219144a6d589988f783?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Check icon"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
      )}
      <p className="my-auto w-[204px]">{text}</p>
    </div>
  );
};

export default FeatureItem;
