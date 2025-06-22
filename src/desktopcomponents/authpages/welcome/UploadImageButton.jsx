"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, Upload, Check, Camera, RotateCw, X, RefreshCw } from 'lucide-react';
import cloud from '../../../assets/cloud.svg';

function UploadImageButton({ label, onChange, preview, onRemove }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setSelectedFile(file);
      onChange(file); // Notify parent
    } else if (file) {
      alert("File size exceeds 2MB limit");
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-regular text-[#787878]">{label}</label>
      
      {selectedFile ? (
        <div className="relative">
          <img 
            src={URL.createObjectURL(selectedFile)} 
            alt="Preview" 
            className="h-40 object-contain border border-gray-600 rounded-md"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-[#1D1D1F] rounded-[10px] h-[172px] p-4 text-center">
          <div className="bg-[#242426] rounded-[10px] h-[138px] p-4 text-center">
          <div className="rounded-full flex justify-center mb-2">
              <img
            src={cloud}
            alt="Attachment"
            className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
          />
              </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />

      <p className="mt-2 text-[12px] text-gray-400">Upload Image</p>

        <p className=" text-[8px] text-gray-400">Image size must be less than 2MB</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 mt-2 text-white px-2 py-1 rounded-full text-[10px]"
          >
            Select Image
          </button>
        </div>
        </div>
        
      )}
    </div>
  );
}

export default UploadImageButton;
