// components/FormInput.js
export default function FormInput({
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    className = '',
    ...props
  }) {
    return (
      <div className="mb-4">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-transparent border ${error ? 'border-red-500' : 'border-gray-700'} rounded-md p-4 text-white ${className}`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }