import React from "react";

const SingleSelect = ({ lists = [], selectedValue, setSelectedValue, label, placeholder }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm md:text-base
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">
          {placeholder || (lists?.length === 0 ? "Loading..." : "Select an option")}
        </option>

        {lists.map((item) => (
          <option
            key={item?.id || item?.value}
            value={item?.id || item?.value}
          >
            {item?.name || item?.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SingleSelect;
