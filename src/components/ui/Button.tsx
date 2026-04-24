import React from "react";
import Loader from "@/components/common/Loader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 active:scale-95",
    secondary:
      "bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-500 hover:bg-brand-200 dark:hover:bg-brand-700",
    ghost:
      "text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-brand-800/50",
    outline:
      "border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700",
    danger:
      "bg-brand-lose text-white hover:bg-red-600 shadow-md shadow-red-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
    icon: "p-2 aspect-square",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader size="sm" className="mr-2" />}
      {children}
    </button>
  );
}
