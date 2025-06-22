import React from "react";

function SelectField({
  label,
  placeholder = "Select",
  options = [],
  onChange,
}) {
  return (
    <div className="w-full mb-4 whitespace-nowrap">
      <label className="block text-neutral-500 text-[10px]">{label}</label>
      <div className="relative mt-2.5">
        <div className="flex overflow-hidden gap-1 items-center px-2.5 py-2 w-full rounded-lg border border-solid bg-neutral-900 border-neutral-600 min-h-8 text-stone-300">
          <select
            className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none text-[10px] appearance-none cursor-pointer"
            onChange={onChange}
            defaultValue=""
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/18b2bb6c05ebfc39636d2743e4809e1703dd784c6c7a984dcbb7169ca9063542?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Dropdown arrow"
            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}

export default SelectField;
