import React from "react";

function SaveButton() {
  return (
    <button
      type="submit"
      className="gap-2.5 w-[105px] self-stretch mt-5 ml-4 text-[12px] tracking-normal leading-none text-center bg-blue-600 rounded-3xl min-h-[31px] text-zinc-100 max-md:ml-2.5 hover:bg-blue-700 transition-colors"
    >
      Save Changes
    </button>
  );
}

export default SaveButton;
