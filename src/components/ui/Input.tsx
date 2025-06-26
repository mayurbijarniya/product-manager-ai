import React from 'react';
import { clsx } from 'clsx';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  className,
  rows = 3,
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const normalClasses = 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white';
  
  const errorClasses = 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 placeholder-red-400 focus:border-red-500 focus:ring-red-500';

  const inputClasses = clsx(
    baseClasses,
    error ? errorClasses : normalClasses,
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};