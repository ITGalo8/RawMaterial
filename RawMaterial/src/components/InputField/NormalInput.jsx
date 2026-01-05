import React from "react";

const NormalInput = ({
  label,
  value,
  setterFun,
  placeholder,
  type = "text",
  name,
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="flex flex-col w-full mb-2">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(e) => setterFun(e.target.value)}
        placeholder={placeholder}
        className={`
          border border-gray-300 rounded-md p-1
          focus:outline-none focus:ring-1 focus:ring-blue-500
          ${className}
        `}
      />
    </div>
  );
};

export default NormalInput;
