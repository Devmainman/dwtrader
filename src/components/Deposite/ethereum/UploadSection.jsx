"use client";
import React, { useState } from "react";

function UploadSection() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 2 * 1024 * 1024) {
        // 2MB limit
        setSelectedFile(file);
      } else {
        alert("File size exceeds 2MB limit");
      }
    }
  };

  return (
    <section className="mt-5">
      <h2 className="text-xs font-medium text-neutral-400">
        Upload payment proof
      </h2>
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
                <p className="text-[12px] font-medium tracking-normal leading-none text-zinc-100">
                  Upload Image
                </p>
                <p className="mt-1.5 text-[8px] text-neutral-400">
                  Image size must be less than 2MB
                </p>
              </div>
            </div>
            <label className="gap-2.5 self-center px-2.5 mt-4 text-[10px] bg-blue-600 rounded-3xl min-h-[22px] text-zinc-100 w-[86px] flex items-center justify-center cursor-pointer">
              Select Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
            {selectedFile && (
              <p className="mt-2 text-xs text-green-400">
                {selectedFile.name} selected
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadSection;
