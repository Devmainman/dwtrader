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
      <label className="block text-[12px] font-medium text-neutral-400">{label}</label>
      
      {selectedFile ? (
        <div className="relative">
          <img 
            src={URL.createObjectURL(selectedFile)} 
            alt="Preview" 
            className="h-44 w-full object-contain rounded-2xl border border-white/10 bg-black/20"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white rounded-full p-1.5 hover:bg-red-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 hover:border-blue-500/50 bg-white/[.02] transition p-1.5 text-center">
          <div className="rounded-xl py-6 px-4 text-center">
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

      <p className="mt-2 text-[13px] font-medium text-zinc-100">Add a photo</p>

        <p className="text-[11px] text-neutral-500 mt-0.5">{err ? <span className="text-red-400">{err}</span> : "Phone photos are fine, we resize them"}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="bg-blue-600 hover:bg-blue-500 mt-3 text-white h-9 px-4 rounded-full text-[12px] font-semibold transition"
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
