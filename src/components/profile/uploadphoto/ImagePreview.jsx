import React from "react";
import ActionButton from "./ActionButton";

function ImagePreview({ imageSrc, onUploadClick, onSaveClick, isLoading }) {
  return (
    <article className="flex overflow-hidden flex-col justify-center items-center px-16 w-full rounded-xl aspect-square bg-[var(--card)]">
      <div className="flex flex-col">
        <img
          src={imageSrc}
          alt="Profile preview"
          className="object-contain aspect-[1.06] rounded-[30px] w-[212px]"
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