"use client";
import React, { useRef, useState } from "react";

const UploadProof = ({ onFileUpload, selectedFile }) => {
  const fileInputRef = useRef(null);
  const [fileError, setFileError] = useState("");

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        setFileError("File size exceeds 2MB limit");
        return;
      }

      setFileError("");
      onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <label className="text-[10px] font-medium text-neutral-400">
        Upload payment proof
      </label>
      <div className="px-3.5 py-4 w-full rounded-xl bg-[#1D1D1F]">
        <div className="flex flex-col gap-2 justify-center items-center p-2 w-full rounded-xl bg-neutral-800 h-[138px]">
          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-medium text-zinc-100">
                {selectedFile.name}
              </div>
              <button
                type="button"
                onClick={() => onFileUpload(null)}
                className="px-2.5 text-xs text-center bg-red-600 rounded-3xl h-[22px] text-zinc-100"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <svg
                width="47"
                height="47"
                viewBox="0 0 47 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[47px] h-[47px]"
              >
                <path
                  d="M24.9688 39.6562V30.8438H30.8438L23.5 22.0312L16.1562 30.8438H22.0312V39.6562H14.6875V39.5828C14.4408 39.5975 14.2058 39.6562 13.9531 39.6562C11.0316 39.6562 8.22973 38.4957 6.1639 36.4298C4.09807 34.364 2.9375 31.5622 2.9375 28.6406C2.9375 22.9889 7.21156 18.3829 12.6959 17.7513C13.1767 15.2377 14.5185 12.9702 16.4903 11.3388C18.4621 9.70737 20.9408 8.81407 23.5 8.8125C26.0596 8.81391 28.5387 9.7071 30.511 11.3385C32.4833 12.9698 33.8256 15.2374 34.3071 17.7513C39.7914 18.3829 44.0596 22.9889 44.0596 28.6406C44.0596 31.5622 42.899 34.364 40.8332 36.4298C38.7673 38.4957 35.9655 39.6562 33.0439 39.6562C32.7972 39.6562 32.5592 39.5975 32.3096 39.5828V39.6562H24.9688Z"
                  fill="#C7C7C7"
                />
              </svg>
              <div className="flex flex-col gap-1.5 items-center">
                <p className="text-[12px] font-medium tracking-normal leading-4 text-center text-zinc-100">
                  Upload Image
                </p>
                <p className="text-[8px] text-center text-neutral-400">
                  Image size must be less than 2MB
                </p>
              </div>
              <button
                type="button"
                onClick={handleFileSelect}
                className="px-2.5 text-[10px] text-center bg-blue-600 rounded-3xl h-[22px] text-zinc-100"
              >
                Select Image
              </button>
              {fileError && <p className="text-xs text-red-500">{fileError}</p>}
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload payment proof"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadProof;
