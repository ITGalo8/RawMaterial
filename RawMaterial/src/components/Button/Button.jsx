import React from "react";

const Button = ({
  title = "Button",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "default", // NEW
}) => {
  const baseStyles =
    variant === "default"
      ? "px-4 py-2 rounded-xl font-semibold text-white bg-yellow-500 hover:scale-[1.03]"
      : // icon button → no padding, no bg, no color
        "p-1 text-gray-600 hover:text-gray-900 bg-transparent";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {title}
    </button>
  );
};

export default Button;
