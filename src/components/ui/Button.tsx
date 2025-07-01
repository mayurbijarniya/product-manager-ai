import React from 'react';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className,
  type = 'button',
  fullWidth = false,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-blue-500 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-gray-500 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 dark:text-white border border-gray-300 dark:border-gray-600',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white rounded-xl',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-red-500',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-green-500',
  };
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs rounded-lg',
    sm: 'px-3 py-2 text-sm rounded-xl',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <button
      type={type}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        'focus:ring-offset-white dark:focus:ring-offset-gray-900',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      
      {loading ? (
        <div className="flex items-center">
          <div className={clsx("animate-spin rounded-full border-2 border-current border-t-transparent", iconSizes[size])} />
          {children && <span className="ml-2">{children}</span>}
        </div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && children && (
            <Icon className={clsx(iconSizes[size], "mr-2")} />
          )}
          {Icon && !children && (
            <Icon className={iconSizes[size]} />
          )}
          {children}
          {Icon && iconPosition === 'right' && children && (
            <Icon className={clsx(iconSizes[size], "ml-2")} />
          )}
        </>
      )}
    </button>
  );
};