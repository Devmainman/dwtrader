import React from "react";

function SearchBar() {
  return (
    <div className="flex overflow-hidden flex-wrap grow shrink gap-2.5 items-center self-stretch p-2.5 my-auto text-xs rounded-3xl bg-neutral-800 min-h-9 min-w-60 text-stone-300 w-[808px] max-md:max-w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/283f66bf227fcb74d3e6127cadf5731fab54b5b9ba3023aae3224e5f6761f851?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
        alt="Search icon"
      />
      <span className="self-stretch my-auto">Search here</span>
    </div>
  );
}

export default SearchBar;
