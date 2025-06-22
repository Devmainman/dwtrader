"use client";
import * as React from "react";
import ActionButton from "./ActionButton";
import ImagePreview from "./ImagePreview";
import { useUserAuth } from "../../../context/UserAuthContext";

function SettingsEditUploadImage() {
  const { token } = useUserAuth();
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(
    "https://cdn.builder.io/api/v1/image/assets/TEMP/d4c73eb400d3f5974836515e6540b006f144743ced83151aadf77382db0c30bf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = handleImageChange;
    fileInput.click();
  };

  const handleSave = async () => {
    if (!selectedImage) {
      setError("No image selected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(`/verification/face-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      console.log("Image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="overflow-hidden pt-2 pb-44 w-full text-xs tracking-normal text-center rounded-3xl bg-neutral-900 max-w-[480px] text-zinc-100">
      <div>
        <ImagePreview imageSrc={previewUrl} onUploadClick={handleUpload} onSaveClick={handleSave} isLoading={isLoading} />
        {error && <p className="mt-2 text-red-500 text-xs">{error}</p>}
      </div>
    </section>
  );
}

export default SettingsEditUploadImage;
