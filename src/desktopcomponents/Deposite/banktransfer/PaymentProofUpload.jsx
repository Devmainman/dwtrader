"use client";
import React, { useState, useRef } from "react";

function PaymentProofUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col min-w-60 w-[350px]">
      <div className="flex flex-col justify-center w-full">
        <h3 className="text-[10px] font-medium text-neutral-400">
          Upload payment proof
        </h3>
        <div className="flex flex-col justify-center px-3.5 py-3 mt-3 w-full text-center rounded-xl bg-neutral-800">
          <div className="flex overflow-hidden flex-col justify-center items-center px-9 py-4 rounded-xl bg-zinc-900 max-md:px-5">
            <div className="flex flex-col max-w-full w-[137px]">
              <div className="flex flex-col w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ec391f010ecf0794dc64df30ced5c6e4bd82f56d00ad2c01f0ad19a49756de6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  className="object-contain self-center aspect-square w-[47px]"
                  alt="Upload icon"
                />
                <div className="mt-1 w-full">
                  <p className="text-[12px] font-medium tracking-normal leading-none text-zinc-100">
                    Upload Image
                  </p>
                  <p className="mt-1.5 text-[8px] text-neutral-400">
                    Image size must be less than 2MB
                  </p>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={handleFileSelect}
                className="gap-2.5 self-center px-2.5 mt-4 text-[10px] bg-blue-600 rounded-3xl min-h-[22px] text-zinc-100 w-[86px]"
              >
                Select Image
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="overflow-hidden gap-2.5 self-center px-2.5 py-3.5 mt-6 max-w-full text-[12px] tracking-normal leading-none whitespace-nowrap bg-blue-600 rounded-3xl min-h-[42px] text-zinc-100 w-[325px]">
        Submit
      </button>
    </div>
  );
}

export default PaymentProofUpload;
