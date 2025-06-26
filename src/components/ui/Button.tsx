import React from 'react';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
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
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-400 dark:hover:bg-primary-300 text-white dark:text-dark-primary focus:ring-primary-600 dark:focus:ring-primary-400 shadow-light dark:shadow-dark hover:shadow-light-md dark:hover:shadow-dark-md',
    secondary: 'bg-light-surface text-light-text-primary hover:bg-primary-100 focus:ring-primary-600 dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-primary-900 dark:focus:ring-primary-400 border border-light-border dark:border-dark-border',
    ghost: 'text-light-text-secondary hover:bg-light-surface focus:ring-primary-600 dark:text-dark-text-secondary dark:hover:bg-dark-surface dark:focus:ring-primary-400 hover:text-light-text-primary dark:hover:text-dark-text-primary',
    danger: 'bg-error-light text-white hover:bg-error-light/90 focus:ring-error-light dark:bg-error-dark dark:hover:bg-error-dark/90 dark:focus:ring-error-dark shadow-light dark:shadow-dark hover:shadow-light-md dark:hover:shadow-dark-md',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-xl',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  return (
    <button
      type={type}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        'focus:ring-offset-white dark:focus:ring-offset-dark-primary',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      ) : Icon && iconPosition === 'left' && children ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : Icon && !children ? (
        <Icon className="w-4 h-4" />
      ) : null}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && children ? (
        <Icon className="w-4 h-4 ml-2" />
      ) : null}
    </button>
  );
};