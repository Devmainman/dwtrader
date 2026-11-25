import React from "react";
import ActionButton from "./ActionButton";

function ImagePreview({ imageSrc, onUploadClick, onSaveClick, isLoading }) {
  return (
    <article className="flex overflow-hidden flex-col justify-center items-center py-6 w-full rounded-2xl border border-dashed border-white/15 bg-white/[.02]">
      <div className="flex flex-col">
        <img
          src={imageSrc}
          alt="Profile preview"
          className="object-cover aspect-square rounded-full w-[160px] border border-white/10"
        />
        <div className="self-center mt-6 max-w-full w-[107px]">
          <ActionButton
            label="Upload Image"
            primary={true}
            onClick={onUploadClick}
            disabled={isLoading}
          />
          <ActionButton
            label={isLoading ? "Saving..." : "Save Changes"}
            primary={false}
            onClick={onSaveClick}
            className="mt-4"
            disabled={isLoading}
          />
        </div>
      </div>
    </article>
  );
}

export default ImagePreview;