import React from 'react';

export default function OneLineInputWithValidation({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  errors = [],
  placeholder = ''
}) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errors.length > 0 ? 'border-red-500' : ''
        }`}
      />
      {errors.map((error, index) => (
        <p key={index} className="text-red-500 text-xs italic mt-1">
          {error.text}
        </p>
      ))}
    </div>
  );
} 