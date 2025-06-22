"use client";
import React, { useState, useRef } from "react";
import ButtonComponent from "./ButtonComponent";

/**
 * Component for handling image upload with preview and action buttons
 */
export function ImageUploader() {
  const [imageUrl, setImageUrl] = useState(
    "https://cdn.builder.io/api/v1/image/assets/TEMP/d4c73eb400d3f5974836515e6540b006f144743ced83151aadf77382db0c30bf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
  );
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    // Trigger file input click
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the selected image
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleSaveChanges = () => {
    // Handle save functionality
    console.log("Saving changes with image:", imageUrl);
    // Additional save logic would go here
  };

  return (
    <section className="flex flex-col items-center justify-center max-w-auto h-[357px] w-[545px] bg-[#1D1D1F] p-6 rounded-xl"> {/* Background and padding */}
      <div className="w-[212px] pl- rounded-lg"> {/* Background for the image section */}
        <img
          src={imageUrl}
          alt="Profile preview"
          className="object-contain w-full aspect-[1.06] rounded-[30px] mb-4"
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="self-center mt-6 max-w-full w-[107px]">
        <ButtonComponent
          text="Upload Image"
          variant="primary"
          onClick={handleUploadClick}
          className="w-full" // Button width adjustment
        />

        <div className="mt-4">
          <ButtonComponent
            text="Save Changes"
            variant="secondary"
            onClick={handleSaveChanges}
            className="w-full" // Button width adjustment
          />
        </div>
      </div>
    </section>
  );
}

export default ImageUploader;
