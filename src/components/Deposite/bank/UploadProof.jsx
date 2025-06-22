"use client";
import React, { useState } from "react";

function UploadProof() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = () => {
    // This would typically trigger a file input click
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="mt-4">
      <label className="text-[10px] font-medium text-neutral-400">
        Upload payment proof
      </label>
      <div className="flex flex-col justify-center px-3.5 py-4 mt-3 max-w-full text-center rounded-xl bg-[#1D1D1F] w-[350px]">
        <div className="flex overflow-hidden flex-col justify-center items-center px-9 py-2.5 rounded-xl bg-neutral-800">
          <div className="flex flex-col max-w-full w-[137px]">
            <div className="flex flex-col w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8893c6a2e312a965b276c0a79248829998e46f8d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                className="object-contain self-center aspect-square w-[47px]"
                alt="Upload icon"
              />
              <div className="mt-1 w-full">
                <h3 className="text-xs font-medium tracking-normal leading-none text-zinc-100">
                  Upload Image
                </h3>
                <p className="mt-1.5 text-[8px] text-neutral-400">
                  Image size must be less than 2MB
                </p>
              </div>
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
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
  );
}

export default UploadProof;
