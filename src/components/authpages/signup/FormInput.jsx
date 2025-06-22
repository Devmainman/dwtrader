import React from "react";

function FormInput({
  placeholder,
  errorMessage,
  hasError = false,
  className = "",
  ...props
}) {
  return (
    <div className={`max-w-full w-[350px] ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="overflow-hidden px-5 py-5 w-full text-xs tracking-normal leading-none rounded-lg border border-solid border-neutral-600 text-neutral-400 bg-transparent"
        {...props}
      />
      {hasError && errorMessage && (
        <p className="mt-1.5 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

export default FormInput;
