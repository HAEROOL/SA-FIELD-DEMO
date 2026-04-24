import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function Card({ children, className = '', onClick, hoverEffect = false }: CardProps) {
  return (
    <div 
      className={`
        bg-white dark:bg-brand-800 
        border border-gray-200 dark:border-gray-700 
        rounded-xl shadow-sm overflow-hidden 
        transition-all duration-200
        ${hoverEffect && 'hover:border-brand-500 dark:hover:border-gray-600 hover:shadow-md cursor-pointer'} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
