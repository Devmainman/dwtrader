"use client";
import React, { useState } from "react";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size exceeds 2MB limit");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  return (
    <div className="flex flex-col justify-center self-stretch my-auto min-w-60 w-[350px]">
      <label className="text-xs font-medium text-neutral-400">
        Upload payment proof
      </label>
      <div className="flex flex-col justify-center px-3.5 py-3 mt-3 max-w-full text-center rounded-xl bg-neutral-800 w-[350px]">
        <div className="flex overflow-hidden flex-col justify-center items-center px-9 py-4 rounded-xl bg-zinc-900 max-md:px-5">
          <div className="flex flex-col max-w-full w-[137px]">
            <div className="flex flex-col w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ec391f010ecf0794dc64df30ced5c6e4bd82f56d00ad2c01f0ad19a49756de6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                className="object-contain self-center aspect-square w-[47px]"
                alt="Upload icon"
              />
              <div className="mt-1 w-full">
                <h3 className="text-xs font-medium tracking-normal leading-none text-zinc-100">
                  Upload Image
                </h3>
                <p className="mt-1.5 text-xs text-neutral-400">
                  Image size must be less than 2MB
                </p>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                {selectedFile && (
                  <p className="mt-1 text-xs text-green-500">
                    {selectedFile.name} selected
                  </p>
                )}
              </div>
            </div>
            <label className="gap-2.5 self-center px-2.5 mt-4 text-xs bg-blue-600 rounded-3xl min-h-[22px] text-zinc-100 w-[86px] flex items-center justify-center cursor-pointer">
              Select Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
