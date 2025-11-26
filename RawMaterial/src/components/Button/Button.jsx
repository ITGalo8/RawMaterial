import React from "react";

const Button = ({
  title = "Button",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-xl font-semibold text-white
        bg-yellow-500 hover:scale-[1.03]
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
