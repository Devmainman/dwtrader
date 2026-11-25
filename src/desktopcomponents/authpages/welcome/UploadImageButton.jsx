"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, Upload, Check, Camera, RotateCw, X, RefreshCw } from 'lucide-react';
import cloud from '../../../assets/cloud.svg';
import { compressImage } from '../../../lib/compressImage';

function UploadImageButton({ label, onChange, preview, onRemove }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Phone photos are usually 3-12 MB; shrink them here instead of rejecting them.
  const handleFileChange = async (event) => {
    const picked = event.target.files[0];
    if (!picked) return;
    setErr("");
    setBusy(true);
    try {
      const file = await compressImage(picked);
      if (file.size > 4 * 1024 * 1024) {
        setErr("This file is too large. Please choose a photo under 4 MB.");
        return;
      }
      setSelectedFile(file);
      onChange(file); // Notify parent
    } finally {
      setBusy(false);
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
      <label className="block text-[12px] font-regular text-[var(--fg-4)]">{label}</label>
      
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
        <div className="bg-[var(--card)]  lg:bg-neutral-900  rounded-[10px] h-[172px] p-4 text-center">
          <div className="bg-[var(--card-2)] rounded-[10px] h-[138px] p-4 text-center">
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

        <p className=" text-[8px] text-gray-400">{err ? <span className="text-red-400">{err}</span> : "Phone photos are fine, we resize them"}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="bg-blue-600 mt-2 text-white px-2 py-1 rounded-full text-[10px]"
          >
            {busy ? "Preparing..." : "Select Image"}
          </button>
        </div>
        </div>
        
      )}
    </div>
  );
}

export default UploadImageButton;
