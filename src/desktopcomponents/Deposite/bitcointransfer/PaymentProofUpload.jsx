"use client";
import React, { useState } from "react";

function PaymentProofUpload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = () => {
    // This would typically open a file dialog
    // For now, it's just a placeholder
    console.log("Select image clicked");
  };

  return (
    <div className="flex flex-col min-w-60 w-[350px]">
      <div className="flex flex-col justify-center w-full">
        <label className="text-xs font-medium text-neutral-400">
          Upload payment proof
        </label>
        <div className="flex flex-col justify-center px-3.5 py-3 mt-3 w-full text-center rounded-xl bg-neutral-800">
          <div className="flex overflow-hidden flex-col justify-center items-center px-9 py-4 rounded-xl bg-zinc-900 max-md:px-5">
            <div className="flex flex-col max-w-full w-[137px]">
              <div className="flex flex-col w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ec391f010ecf0794dc64df30ced5c6e4bd82f56d00ad2c01f0ad19a49756de6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Upload icon"
                  className="object-contain self-center aspect-square w-[47px]"
                />
                <div className="mt-1 w-full">
                  <h4 className="text-xs font-medium tracking-normal leading-none text-zinc-100">
                    Upload Image
                  </h4>
                  <p className="mt-1.5 text-xs text-neutral-400">
                    Image size must be less than 2MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleImageSelect}
                className="gap-2.5 self-center px-2.5 mt-4 text-xs bg-blue-600 rounded-3xl min-h-[22px] text-zinc-100 w-[86px]"
              >
                Select Image
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-6 max-w-full text-xs tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 w-[325px]">
        Submit
      </button>
    </div>
  );
}

export default PaymentProofUpload;
