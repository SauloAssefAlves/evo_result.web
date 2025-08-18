import React from "react";
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "normal",
  onClick,
  disabled = false,
  icon,
  className = "",
  style = {},
}) => {
  const baseClasses = "btn inline-flex items-center gap-2 m-1";

  const variants = {
    primary: "btn-primary",
    secondary: "btn-ghost",
    danger: "btn-error",
    outline: "btn-outline",
    "primary-large": "btn-primary btn-lg",
  } as const;

  const sizes = {
    small: "btn-sm",
    normal: "",
    large: "btn-lg",
  } as const;

  const disabledClasses = disabled ? "btn-disabled" : "";

  return (
    <button
      className={`${baseClasses} ${
        variants[variant as keyof typeof variants]
      } ${sizes[size as keyof typeof sizes]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {icon && <i className={icon}></i>}
      {children}
    </button>
  );
};

export default Button;
