// components/SelectInput.js
export default function SelectInput({
    name,
    value,
    onChange,
    options,
    placeholder,
    error,
    className = '',
  }) {
    return (
      <div className="mb-4">
        <div className={`w-full bg-transparent border ${error ? 'border-red-500' : 'border-gray-700'} rounded-md p-4 text-gray-400 flex justify-between ${className}`}>
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="bg-transparent text-white w-full"
          >
            <option value="">{placeholder}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }