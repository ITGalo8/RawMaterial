import React from "react";

const ButtonWithIcon = ({
  title = "",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {icon}
      {title}
    </button>
  );
};

export default ButtonWithIcon;
