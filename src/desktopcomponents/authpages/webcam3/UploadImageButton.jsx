"use client";
import React, { useState } from "react";

function UploadImageButton() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      // 2MB limit
      setSelectedFile(file);
    } else if (file) {
      alert("File size exceeds 2MB limit");
    }
  };

  return (
    <div className="flex flex-col justify-center px-3.5 py-4 mt-5 w-full text-center rounded-xl bg-neutral-900">
      <div className="flex overflow-hidden flex-col justify-center items-center px-9 py-2.5 rounded-xl bg-neutral-800 max-md:px-5">
        <div className="flex flex-col max-w-full w-[137px]">
          <div className="flex flex-col w-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8893c6a2e312a965b276c0a79248829998e46f8d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Upload icon"
              className="object-contain self-center aspect-square w-[47px]"
            />
            <div className="mt-1 w-full">
              <h3 className="text-xs font-medium tracking-normal leading-none text-zinc-100">
                Upload Image
              </h3>
              <p className="mt-1.5 text-xs text-neutral-400">
                Image size must be less than 2MB
              </p>
            </div>
          </div>
          <label className="cursor-pointer">
            <div className="gap-2.5 self-center px-2.5 mt-4 text-xs bg-blue-600 rounded-3xl min-h-[22px] text-zinc-100 w-[86px] flex items-center justify-center">
              Select Image
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default UploadImageButton;
