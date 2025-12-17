import React, { useState } from "react";

function SelectField({ label, value, options = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const DownArrowIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[16px] h-[16px]"
    >
      <path
        d="M12 6.3335L8 10.3335L4 6.3335H12Z"
        fill="#505050"
        stroke="#505050"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Find label to show from value
  const getSelectedLabel = () => {
    const found = options.find(opt =>
      typeof opt === "string" ? opt === value : opt.value === value
    );
    return typeof found === "string" ? found : found?.label || "Choose";
  };

  return (
    <div className="flex flex-col gap-2.5 relative">
      <label className="text-xs text-neutral-500">{label}</label>
      <div 
        className="flex justify-between items-center p-2.5 w-full h-8 rounded-lg border bg-neutral-900 border-neutral-600 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs text-stone-300">
          {getSelectedLabel()}
        </span>
        <DownArrowIcon />
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-1 w-full z-10 rounded-lg border bg-neutral-900 border-neutral-600 max-h-40 overflow-y-auto">
          {options.map((option, index) => {
            const displayLabel = typeof option === "string" ? option : option.label;
            const optionValue = typeof option === "string" ? option : option.value;

            return (
              <div
                key={index}
                className="p-2.5 text-xs text-stone-300 hover:bg-neutral-800 cursor-pointer"
                onClick={() => {
                  onChange(optionValue);
                  setIsOpen(false);
                }}
              >
                {displayLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SelectField;
