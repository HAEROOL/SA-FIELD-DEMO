import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ className = '', icon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      <input 
        className={`
          w-full bg-gray-50 dark:bg-brand-900/80 
          text-gray-900 dark:text-white 
          placeholder-gray-400 dark:placeholder-gray-500 
          rounded-xl border border-gray-200 dark:border-gray-700 
          focus:outline-none focus:ring-2 focus:ring-brand-500 
          transition-all shadow-inner
          ${icon ? 'pl-10 pr-4' : 'px-4'} py-3
          ${className}
        `}
        {...props}
      />
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  );
}
