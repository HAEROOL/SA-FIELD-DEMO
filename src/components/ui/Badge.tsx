import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'brand' | 'accent' | 'success' | 'warning' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}: BadgeProps) {
  
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200",
    outline: "border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300",
    brand: "bg-brand-500 text-white shadow-md shadow-brand-500/30",
    accent: "bg-brand-accent/10 border border-brand-accent/50 text-brand-accent",
    success: "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400",
    warning: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    gray: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span className={`inline-flex items-center justify-center font-bold rounded-full whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
